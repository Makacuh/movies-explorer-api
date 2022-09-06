const jwt = require('jsonwebtoken');

const { NODE_ENV, SECRET_KEY } = process.env;

const AuthorizationError = require('../errors/authorizationError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthorizationError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? SECRET_KEY : 'dev-key');
  } catch (err) {
    throw new AuthorizationError('Необходима авторизация!');
  }

  req.user = payload;

  return next();
};
