const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();

const {
  getUserInfo,
  updateUserInfo,
} = require('../controllers/users');

router.get('/users/me', getUserInfo);

router.patch('users/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), updateUserInfo);

module.exports = router;
