const mongoose = require('mongoose');
const validator = require('validator');

const hexAvatar = (val) => /(http|https):\/\/([\w.]+\/?)\S*/.test(val);

// const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    // use: { hexAvatar },
    validate: {
      validator: (val) => /(http|https):\/\/([\w.]+\/?)\S*/.test(val),
      message: () => 'неккоректная ссылка',
    },
    message: () => 'неккоректная ссылка',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (val) => validator.isEmail(val),
      message: 'некоректная почта',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: 8,
  },
});

module.exports = mongoose.model('user', userSchema);
