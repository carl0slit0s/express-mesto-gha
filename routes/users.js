const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  // creatUser,
  getUser,
  getUsers,
  updateUsers,
  updateAvatar,
  getUserData,
} = require('../controllers/user');

// const { isAuthorized } = require('../middlewares/auth')

// router.post('/', creatUser);
// router.post('/auth', isAuthorized);

router.get('/me', getUserData);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), getUser);

router.get('/', getUsers);

router.patch('/me', updateUsers);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/(http|https):\/\/([\w.]+\/?)\S*/),
  }),
}), updateAvatar);

module.exports = router;
