import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import routes from './routes';
import { appConfig, dbConfig } from './config';
import sequelize from './db/sequelize';
import './db/models';

const app = express();

const appConf = appConfig();
const dbConf = dbConfig();

// Request Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '5mb' }));

// Set Routes
app.use(routes);

// Run server
(async function () {
  // Sync postgres database
  await sequelize.sync({ force: false });

  app.listen(appConf.port, () => {
    console.log(`===================================
Server Info
===================================
PORT    : ${appConf.port}
ENV     : ${process.env.NODE_ENV}
DB      : ${dbConf.host}
===================================`);
  });
})();