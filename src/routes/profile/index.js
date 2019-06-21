import express from "express";

import { User } from '../../db/models';
import * as error from '../error';
import { requireAuth } from "../middlewares";

const profile = express.Router();

profile.get('/currentUser', requireAuth, currentUser);
profile.get('/info/:user_id', requireAuth, info);

async function currentUser(req, res, next) {
  try {
    const { user_id } = req.authData.user;
    const result = await User.findOne({
      where: { user_id },
    });

    res.locals.payload = result;
    next();
  } catch (e) {
    next(error.database(e));
  }
}

async function info(req, res, next) {
  try {
    const { user_id } = req.params;
    const result = await User.findOne({
      where: { user_id },
    });

    res.locals.payload = result;
    next();
  } catch (e) {
    next(error.database(e));
  }
}

export default profile;