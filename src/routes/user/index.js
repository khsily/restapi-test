import express from "express";
import { sha512 } from 'js-sha512';
import Joi from 'joi';
import { User } from '../../db/models';
import * as error from '../error';

const user = express.Router();

user.post('/signin', signin);
user.post('/signup', signup);

async function signin(req, res, next) {
  
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

    const result = await User.create({
      email: email,
      password: sha512(password),
      nickname: nickname,
    });

    res.locals.payload = result;
    next();
  } catch (e) {
    if (e.isJoi) next(error.parameter(e));
    else next(error.database(e));
  }
}

export default user;