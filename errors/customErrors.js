const BadRequestError = require('./badRequestError');
const ConflictError = require('./conflictError');

module.exports.customError = (err, req, res, next) => {
  if (err.name === 'CastError' || err.name === 'ValidationError') {
    return next(new BadRequestError('Переданы некорректные данные для данной операции'));
  }
  if (err.code === 11000) {
    return next(new ConflictError('Пользователь с такой почтой уже существует'));
  }
  return next(err);
};
