// const User = require('../models/user');
const jwt = require('jsonwebtoken');

const { authErorr } = require('./errors');

module.exports.isAuthorized = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) {
    console.log('проверка авторизации');
    authErorr();
  }
  const token = auth.replace('Bearer ', '');
  if (!token) {
    authErorr();
  }
  try {
    const payload = jwt.verify(token, 'very_secret');
    req.user = payload;
    console.log('первая точка')
    next();
    console.log('вторая точка')
  } catch (err) {
    authErorr();
  }
};
