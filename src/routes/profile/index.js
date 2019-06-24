import express from "express";
import Joi from 'joi';

import { User } from '../../db/models';
import * as error from '../error';
import { requireAuth } from "../middlewares";

const profile = express.Router();

profile.get('/info', requireAuth, fetchCurrentUserInfo);
profile.get('/info/:user_id', requireAuth, fetchUserInfo);
profile.put('/info', requireAuth, updateUserInfo);

async function fetchCurrentUserInfo(req, res, next) {
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

async function updateUserInfo(req, res, next) {
  const updateSchema = Joi.object().keys({
    email: Joi.string().email(),
    password: Joi.string(),
    nickname: Joi.string(),
  });

  try {
    const body = await Joi.validate(req.body, updateSchema);
    const { email, password, nickname } = body;
    const { user_id } = req.authData.user;

    await User.update({
      email,
      password,
      nickname,
    }, { where: { user_id } });

    const user = await User.findOne({
      where: { user_id },
    });

    res.locals.payload = user.info;
    next();
  } catch (e) {
    if (e.isJoi) next(error.parameter(e));
    else next(error.database(e));
  }
}

export default profile;