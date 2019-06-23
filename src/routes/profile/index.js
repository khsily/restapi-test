import express from "express";

import { User } from '../../db/models';
import * as error from '../error';
import { requireAuth } from "../middlewares";

const profile = express.Router();

profile.get('/currentUser', requireAuth, fetchCurrentUser);
profile.get('/info/:user_id', requireAuth, fetchUserInfo);

async function fetchCurrentUser(req, res, next) {
  try {
    const { user_id } = req.authData.user;
    const user = await User.findOne({
      where: { user_id },
    });

    res.locals.payload = user.info;
    next();
  } catch (e) {
    next(error.database(e));
  }
}

async function fetchUserInfo(req, res, next) {
  try {
    const { user_id } = req.params;
    const user = await User.findOne({
      where: { user_id },
    });

    res.locals.payload = user.info;
    next();
  } catch (e) {
    next(error.database(e));
  }
}

export default profile;