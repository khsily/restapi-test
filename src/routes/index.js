
import express from "express";
import * as middlewares from './middlewares';

import user from './user';

const routes = express.Router();

//routes
routes.use('/user', user);

//middlewares
// routes.use(middlewares.logger);
// routes.use(middlewares.resultHandler);
// routes.use(middlewares.notFoundCommand);
// routes.use(middlewares.defaultErrorLogger);
// routes.use(middlewares.defaultErrorHandler);

export default routes;