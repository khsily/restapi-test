import express from 'express';

const post = express.Router();

post.get('/', fetchPostList);
post.get('/:post_id');
post.post('/');
post.put('/:post_id');

async function fetchPostList(req, res, next) {

}

export default post;