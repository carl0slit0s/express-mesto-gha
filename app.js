const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const { login, creatUser } = require('./controllers/user');
const { isAuthorized } = require('./middlewares/auth');
// const { reqErorr, authErorr, notFoundErorr } = require('./middlewares/errors');

mongoose.connect('mongodb://localhost:27017/mestodb');

const PORT = 3000;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use((req, res, next) => {
//   req.user = {
//     _id: '62acbb78863178a82c1e1aea',
//   };

//   next();
// });

app.post('/signin', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    about: Joi.string().min(2).max(30),
    avatar: Joi.number().integer().required().min(18),
    password: Joi.string().required().min(8),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    about: Joi.string().min(2).max(30),
    avatar: Joi.number().integer().required().min(18),
    password: Joi.string().required().min(8),
  }),
}), creatUser);

app.use('/', isAuthorized);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use(errors());
app.use((err, req, res, next) => {
  if (err.statusCode) {
    return res.status(err.statusCode).send({ message: err.message });
  }

  return res.status(500).send({ message: 'что-то пошло не так' });
});

// app.use((req, res) => {
//   res.status(404).send({ message: 'страницы не существует' });
// });

app.listen(PORT, () => {});
