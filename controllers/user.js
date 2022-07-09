const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  reqErorr,
  authErorr,
  notFoundErorr,
  alreadyExistsError,
} = require('../middlewares/errors');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

module.exports.getUserData = (req, res, next) => {
  User.findById(req.user.id)
    .orFail(() => {
      throw new NotFoundError('NotFound');
    })
    .then((user) => res.send({ user }))
    .catch(next);
};

module.exports.creatUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(201).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.avatar,
      _id: user._id,
    }))
    // .catch(next)
    .catch((err) => {
      if (err.code === 11000) {
        next(alreadyExistsError());
      }
      next(err);
    });
};

module.exports.getUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (user === null) {
        return next(notFoundErorr());
      }
      return res.send({ user });
    })
    .catch(next);
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(() => res.status(500).send({ message: 'Что-то пошло не так...' }));
};

module.exports.updateUsers = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user.id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.avatar,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: err.message });
      }
      if (err.name === 'CastError') {
        return res.status(404).send({ message: err.message });
      }
      return res.status(500).send({ message: 'Что-то пошло не так...' });
    });
};

module.exports.updateAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user.id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .then((avatar) => {
      res.send({ avatar });
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  // if (!email || !password) {
  //   reqErorr();
  // }
  try {
    User.findOne({ email })
      .select('+password')
      .then((user) => {
        if (!user) {
          authErorr();
        }
        return Promise.all([user, bcrypt.compare(password, user.password)]);
      })
      .then(([user, isPasswordCorrect]) => {
        if (!isPasswordCorrect) {
          authErorr();
        }
        return jwt.sign({ id: user._id }, 'very_secret', { maxAge: 3600000 * 24 * 7 });
      })
      .then((token) => {
        res.send({ token });
      })
      .catch(next);
  } catch (err) {
    authErorr();
  }
};
