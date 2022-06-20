const router = require("express").Router();
const User = require("../models/user");

router.post("/", (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
});

router.get("/", (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: "Произошла ошибка" }));
});

router.get("/:userId", (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: "Произошла ошибка" }));
});

router.patch("/me", (req, res) => {
  User.findByIdAndUpdate(req.user._id, {user: req.params.user})
    .then((user) => res.send({ user }))
    .catch((err) => res.status(500).send({ message: err.message }));
});

router.patch("/me/avatar", (req, res) => {
  User.findByIdAndUpdate(req.user._id, {avatar: req.params.avatar})
    .then((avatar) => res.send({ avatar }))
    .catch((err) => res.status(500).send({ message: err.message }));
});



module.exports = router;
