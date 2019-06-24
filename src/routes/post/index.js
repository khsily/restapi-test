import express from 'express';
import Joi from 'joi';

import { Post, Like } from '../../db/models';
import * as error from '../error';
import { requireAuth } from "../middlewares";

const post = express.Router();

post.get('/', fetchPostList);
post.get('/:post_id', requireAuth, fetchPostDetail);
post.post('/', requireAuth, createPost);
post.put('/:post_id', requireAuth, updatePost);
post.delete('/:post_id', requireAuth, deletePost);
post.get('/like/:post_id', fetchPostLikeCount);
post.put('/like/:post_id', requireAuth, likePost);

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

    let post = await Post.findOne({
      where: { post_id },
      attributes: ['user_id'],
    });

    if (post.user_id !== req.authData.user.user_id) {
      next(error.owner(Error("Only owner can access to this method")));
    }

    await Post.update({
      title: title,
      content: content,
    }, { where: { post_id } });

    post = await Post.findOne({
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

    let post = await Post.findOne({
      where: { post_id },
      attributes: ['user_id'],
    });

    if (post.user_id !== req.authData.user.user_id) {
      next(error.owner(Error("Only owner can access to this method")));
    }

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

async function fetchPostLikeCount(req, res, next) {
  try {
    const { post_id } = req.params;
    const likeCount = await Like.count({ where: { post_id } });
    res.locals.payload = { likeCount };
    next();
  } catch (e) {
    next(error.database(e));
  }
}

async function likePost(req, res, next) {
  const schema = Joi.object().keys({
    positive: Joi.boolean().required(),
  });

  try {
    const body = await Joi.validate(req.body, schema);
    const { positive } = body;
    const { post_id } = req.params;
    const { user_id } = req.authData.user;

    await Like.createOrUpdate({
      positive,
      user_id,
      post_id,
    });

    res.locals.payload = { positive };
    next();
  } catch (e) {
    if (e.isJoi) next(error.parameter(e));
    else next(error.database(e));
  }
}

export default post;