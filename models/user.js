const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { isEmail } = require('validator');
const AuthorizationError = require('../errors/authorizationError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Значение должно быть не меньше 2, у вас {VALUE}'],
    maxlength: [30, 'Значение должно быть не больше 30, у вас {VALUE}'],
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new AuthorizationError('Пользователь не найден'),
        );
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(
              new AuthorizationError('Неправильные почта или пароль'),
            );
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
