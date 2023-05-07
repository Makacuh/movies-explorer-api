const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, SECRET_KEY, HASH_LENGTH } = require('../utils/config');

const User = require('../models/user');

const { customError } = require('../errors/customErrors');
const NotFoundError = require('../errors/notFoundError');

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, HASH_LENGTH).then((hash) => User.create({
    name, email, password: hash,
  }))
    .then((userWithPass) => {
      const userWithOutPass = {
        _id: userWithPass._id,
        name: userWithPass.name,
        email: userWithPass.email,
      };
      return userWithOutPass;
    })
    .then((user) => res.send(user))
    .catch((err) => {
      customError(err, req, res, next);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? SECRET_KEY : 'dev-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError('Данных по указанному id нет');
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      customError(err, req, res, next);
    });
};

const updateUserInfo = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      throw new NotFoundError('Данных по указанному id нет');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      customError(err, req, res, next);
    });
};

module.exports = {
  login,
  createUser,
  getUserInfo,
  updateUserInfo,
};
