import express from "express";
import { sha512 } from 'js-sha512';
import Joi from 'joi';
import jwt from 'jsonwebtoken';

import { User } from '../../db/models';
import * as error from '../error';
import { jwtSecretKey } from "../../config";
import { requireAuth } from "../middlewares";

const user = express.Router();

user.post('/signin', signin);
user.post('/signup', signup);
user.put('/', requireAuth, updateUser);

async function signin(req, res, next) {
  const signinShcema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  try {
    const body = await Joi.validate(req.body, signinShcema);
    const { email, password } = body;

    const user = await User.findOne({
      where: { email, password: sha512(password) },
    });

    jwt.sign({ user }, jwtSecretKey, (err, token) => {
      user.dataValues.token = token;
      res.locals.payload = user.info;
      next();
    });
  } catch (e) {
    if (e.isJoi) next(error.parameter(e));
    else next(error.database(e));
  }
}

async function signup(req, res, next) {
  const signupSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    nickname: Joi.string().required(),
  });

  try {
    const body = await Joi.validate(req.body, signupSchema);
    const { email, password, nickname } = body;

    const user = await User.create({
      email: email,
      password: sha512(password),
      nickname: nickname,
    });

    res.locals.payload = user.info;
    next();
  } catch (e) {
    if (e.isJoi) next(error.parameter(e));
    else next(error.database(e));
  }
}

async function updateUser(req, res, next) {
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
      email: email,
      password: password && sha512(password),
      nickname: nickname,
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

export default user;