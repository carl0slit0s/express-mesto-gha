const Card = require("../models/card");

module.exports.addCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  const likes = [];
  Card.create({ name, link, owner, likes })
    .then((card) => res.status(201).send({ card }))
    .catch((err) => {
      if (err.name == "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.massage });
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => new Error("NotFound"))
    .then(() => res.send({ message: "карточка удалена" }))
    .catch((err) => {
      if (err.name == "CastError") {
        return res.status(400).send({ message: err.message });
      }
      if (err.name == "Error") {
        return res.status(404).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.likeCard = (req, res) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new Error("NotFound"))
    .then(() => res.send({ message: "лайк" }))
    .catch((err) => {
      if (err.name == "CastError") {
        return res.status(400).send({ message: err.message });
      }
      if (err.name == "Error") {
        return res.status(404).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });

module.exports.dislikeCard = (req, res) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new Error("NotFound"))
    .then(() => res.send({ message: "дизлайк" }))
    .catch((err) => {
      if (err.name == "CastError") {
        return res.status(400).send({ message: err.message });
      }
      if (err.name == "Error") {
        return res.status(404).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
