const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { reqErorr, authErorr, notFoundErorr, alreadyExistsError } = require('../middlewares/errors');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

module.exports.getUserData = (req, res) => {
  User.findById(req.user.id)
    .orFail(() => {
      throw new NotFoundError('NotFound');
    })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: err.message });
      }
      if (err.name === 'NotFoundError') {
        return res.status(404).send({ message: err.message });
      }

      return res.status(500).send({ message: 'Что-то пошло не так...' });
    });
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
    })
      // if (err.name === 'ValidationError') {
      //   return res.status(400).send({ message: err.message });
      // }
      // return res.status(500).send({ message: 'Что-то пошло не так...' });
    ;
};

module.exports.getUser = (req, res, next) => {
  const { userId } = req.params;
  console.log('userId', userId)
  User.findById(userId)
    .then((user) => {
      console.log('123', user);
      if (user === null) {
        return next(notFoundErorr());
      }
      res.send({ user });})
    .catch(err => {
      console.log(err.name)
      if (err.name === 'CastError') {
        next(notFoundErorr())
      }
      next(err)
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(() => res.status(500).send({ message: 'Что-то пошло не так...' }));
};

module.exports.updateUsers = (req, res) => {
  const { name, about } = req.body;
  console.log(req.user.id)
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
  console.log(req.user.id);
  User.findByIdAndUpdate(
    req.user.id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .then((avatar) => {
      if (!avatar) {
        console.log(123);
      }

      res.send({ avatar });
    })
    .catch(next);

    // .catch((err) => {
    //   console.log(err)
    //   if (err.name === 'Bad Request') {
    //     return res.status(400).send({ message: err.message });
    //   }
    //   if (err.name === 'CastError') {
    //     return res.status(404).send({ message: err.message });
    //   }
    //   return res.status(500).send({ message: 'Что-то пошло не так...' });
    // });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    reqErorr();
  }
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
        return jwt.sign({ id: user._id }, 'very_secret');
      })
      .then((token) => {
        res.send({ token });
      })
      .catch(next);
  } catch (err) {
    authErorr();
  }
};
