const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: Object,
    required: true,
  },
  likes: {
    type: Array,
    required: true,
  },
  createdAt : {
    type: Date,
    required: true,
  },
})

module.exports = mongoose.model('card', cardSchema)