const User = require('../models/user');
const jwt = require('jsonwebtoken');

const { reqErorr, authErorr, notFoundErorr } = require('../middlewares/errors');

module.exports.isAuthorized = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) {
    authErorr();
    // return res.status(401).send({ message: 'требуется авторизация' });
  }
  const token = auth.replace('Bearer ', '');
  // try {
    const payload = jwt.verify(token, 'very_secret');

  // }
  req.user = payload;
  console.log(req.user, '123');
  next();
};
