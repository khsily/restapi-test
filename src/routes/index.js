
import express from "express";
import * as middlewares from './middlewares';

import user from './user';
import profile from './profile';
import post from './post';

const routes = express.Router();

//routes
routes.get('/ping', (req, res) => res.send('pong'));
routes.use('/user', user);
routes.use('/profile', profile);
routes.use('/post', post);

//middlewares
routes.use(middlewares.logger);
routes.use(middlewares.resultHandler);
routes.use(middlewares.notFoundCommand);
routes.use(middlewares.defaultErrorLogger);
routes.use(middlewares.defaultErrorHandler);

export default routes;