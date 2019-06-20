import express from "express";
import { sha512 } from 'js-sha512';
import { User } from '../../db/models';

const user = express.Router();

user.post('/signin', signin);
user.post('/signup', signup);

async function signin(req, res, next) {

}

async function signup(req, res, next) {
  
}

export default user;