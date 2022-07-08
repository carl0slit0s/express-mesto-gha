const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
// const { celebrate, joi } = require('celebrate');

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
router.get('/:userId', getUser);

router.get('/', getUsers);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().min(18),
    password: Joi.string().required().min(8),
  }),
}), updateUsers);

router.patch('/me/avatar', updateAvatar);

module.exports = router;
