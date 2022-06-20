const User = require("../models/user");

module.exports.creatUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name == "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.massage });
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => new Error("NotFound"))
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name == "CastError") {
        return res.status(400).send({ message: err.message });
      }
      if (err.name == "Error") {
        return res.status(404).send({ message: err.message });
      }

      return res.status(500).send({ message: err.name });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch((err) => res.status(500).send({ message: "Произошла ошибка" }));
};

module.exports.updateUsers = (req, res) => {
  const { name, about, avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name: name, about: about, avatar: avatar },
    { new: true, runValidators: true }
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name == "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.massage });
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
      if (err.name == "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.massage });
    });
};

