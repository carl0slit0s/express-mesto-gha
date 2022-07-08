const router = require('express').Router();
const { celebrate, joi } = require('celebrate');

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

router.patch('/me', updateUsers);

router.patch('/me/avatar', updateAvatar);

module.exports = router;
