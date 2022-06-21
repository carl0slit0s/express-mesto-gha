const router = require("express").Router();
const Card = require("../models/card");

const {addCard, getCards, deleteCard, likeCard, dislikeCard} = require('../controllers/card')

router.post("/", addCard);

router.get("/", getCards);

router.delete("/:cardId", likeCard);

router.delete("/:cardId/likes", dislikeCard);

module.exports = router;
