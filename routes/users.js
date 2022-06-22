const router = require('express').Router();

const {
  creatUser,
  getUser,
  getUsers,
  updateUsers,
  updateAvatar,
} = require('../controllers/user');

router.post('/', creatUser);

router.get('/:userId', getUser);

router.get('/', getUsers);

router.patch('/me', updateUsers);

router.patch('/me/avatar', updateAvatar);

module.exports = router;
