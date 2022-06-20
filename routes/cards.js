const router = require("express").Router();
const Card = require("../models/card");

router.post("/", (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link })
    .then((card) => res.status(201).send({ card }))
    .catch((err) => res.status(500).send({ message: err.message }));
});

router.get("/", (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => res.status(500).send({ message: "произошла ошибка" }));
});

router.delete("/:cardId", (req, res) => {
  Card.findById(req.params.cardId)
    .then(() => res.send({ message: "карточка удалена" }))
    .catch((err) => res.status(500).send({ message: "Проищошла ошибка" }));
});

router.put("/:cardId/likes", (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  ).then(() => res.send({message: 'лайк поставлен'})).catch((err) => res.status({message: err.message}));
});

router.delete("/:cardId/likes", (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $$pull: { likes: req.user._id } },
    { new: true }
  ).then(() => res.send({message: 'лайк поставлен'})).catch((err) => res.status({message: err.message}));
});

module.exports = router;
