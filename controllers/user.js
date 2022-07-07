const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { reqErorr, authErorr, notFoundErorr } = require('../middlewares/errors');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

module.exports.getUserData = (req, res) => {
  console.log(req.user.id);
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

module.exports.creatUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => {
      return User.create({ name, about, avatar, email, password: hash });
    })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: 'Что-то пошло не так...' });
    });
  // User.create({ name, about, avatar })
  //   .then((user) => res.status(201).send({ data: user }))
  //   .catch((err) => {
  //     if (err.name === 'ValidationError') {
  //       return res.status(400).send({ message: err.message });
  //     }
  //     return res.status(500).send({ message: 'Что-то пошло не так...' });
  //   });
};

module.exports.getUser = (req, res, next) => {
  console.log(req.params.userId);
  User.findById(req.params.userId)
    // .orFail(() => {
    //   throw new NotFoundError('NotFound');
    // })
    .then((user) => {
      if (user === null) {
        console.log('не нашли пользорвателя');
        notFoundErorr();
      }
      res.send({ user });
    })
    .catch(next);
};
//     catch (err) {
//   console.log('ловим ошибку');
//   notFoundErorr();
// }
// {
//   if (err.name === 'CastError') {
//     return res.status(400).send({ message: err.message });
//   }
//   if (err.name === 'NotFoundError') {
//     return res.status(404).send({ message: err.message });
//   }

//   return res.status(500).send({ message: 'Что-то пошло не так...' });
// });
// };

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(() => res.status(500).send({ message: 'Что-то пошло не так...' }));
};

module.exports.updateUsers = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => res.send(user))
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

module.exports.updateAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true }
  )
    .then((avatar) => res.send({ avatar }))
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
          console.log('неправильный logiiin');
          authErorr();
        }
        return Promise.all([user, bcrypt.compare(password, user.password)]);
      })
      .then(([user, isPasswordCorrect]) => {
        if (!isPasswordCorrect) {
          console.log('неправильный парооооодь');
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
