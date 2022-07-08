// const User = require('../models/user');
const jwt = require('jsonwebtoken');

const { authErorr } = require('./errors');

module.exports.isAuthorized = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) {
    authErorr();
  }
  const token = auth.replace('Bearer ', '');
  const payload = jwt.verify(token, 'very_secret');
  req.user = payload;
  next();
};
