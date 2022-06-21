const router = require("express").Router();
const Card = require("../models/card");

const {addCard, getCards, deleteCard, likeCard, dislikeCard} = require('../controllers/card')

router.post("/", addCard);

router.get("/", getCards);

router.delete("/:cardId", deleteCard);

router.put("/:cardId/likes", likeCard);
router.delete("/:cardId/likes", dislikeCard);

module.exports = router;
