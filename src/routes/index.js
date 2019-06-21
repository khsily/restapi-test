
import express from "express";
import * as middlewares from './middlewares';

import user from './user';
import profile from './profile';

const routes = express.Router();

//routes
routes.use('/user', user);
routes.use('/profile', profile);

//middlewares
routes.use(middlewares.logger);
routes.use(middlewares.resultHandler);
routes.use(middlewares.notFoundCommand);
routes.use(middlewares.defaultErrorLogger);
routes.use(middlewares.defaultErrorHandler);

export default routes;