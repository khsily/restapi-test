import express from 'express';
import Joi from 'joi';

import { Post } from '../../db/models';
import * as error from '../error';
import { requireAuth } from "../middlewares";

const post = express.Router();

post.get('/', fetchPostList);
post.get('/:post_id', requireAuth, fetchPostDetail);
post.post('/', requireAuth, createPost);
post.put('/:post_id', requireAuth, updatePost);
post.delete('/:post_id', requireAuth, deletePost);

async function fetchPostList(req, res, next) {
  try {
    const posts = await Post.findAll();
    res.locals.payload = posts;
    next();
  } catch (e) {
    next(error.database(e));
  }
}

async function fetchPostDetail(req, res, next) {
  try {
    const { post_id } = req.params;
    const post = await Post.findOne({
      where: { post_id },
    });

    res.locals.payload = post;
    next();
  } catch (e) {
    next(error.database(e));
  }
}

async function createPost(req, res, next) {
  const schema = Joi.object().keys({
    title: Joi.string().required(),
    content: Joi.string().required(),
  });

  try {
    const body = await Joi.validate(req.body, schema);
    const { title, content } = body;
    const { user_id } = req.authData.user;

    const post = await Post.create({ title, content, user_id });

    res.locals.payload = post;
    next();
  } catch (e) {
    if (e.isJoi) next(error.parameter(e));
    else next(error.database(e));
  }
}

async function updatePost(req, res, next) {
  const schema = Joi.object().keys({
    title: Joi.string(),
    content: Joi.string(),
  });

  try {
    const body = await Joi.validate(req.body, schema);
    const { title, content } = body;
    const { post_id } = req.params;

    await Post.update({
      title: title,
      content: content,
    }, { where: { post_id } });

    const post = await Post.findOne({
      where: { post_id },
    });

    res.locals.payload = post;
    next();
  } catch (e) {
    if (e.isJoi) next(error.parameter(e));
    else next(error.database(e));
  }
}

async function deletePost(req, res, next) {
  try {
    const { post_id } = req.params;

    await Post.destroy({
      where: { post_id }
    });

    res.locals.payload = { deleted: post_id };
    next();
  } catch (e) {
    if (e.isJoi) next(error.parameter(e));
    else next(error.database(e));
  }
}

export default post;