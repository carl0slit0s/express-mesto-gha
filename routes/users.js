const router = require("express").Router();
const User = require("../models/user");

router.post("/", (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    // .catch((err) => res.status(500).send({ name: err.name, "message": err.massage }));
    .catch((err) => {
      if (err.name == "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.massage });
    });
});

router.get("/", (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: "Произошла ошибка" }));
});

router.get("/:userId", (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name == "CastError") {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.massage });
    });
});

router.patch("/me", (req, res) => {
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
});

router.patch("/me/avatar", (req, res) => {
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
});

module.exports = router;
