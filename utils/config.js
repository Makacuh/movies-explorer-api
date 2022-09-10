require('dotenv').config();
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // за 15 минут
  max: 100, // можно совершить максимум 100 запросов с одного IP
});

const {
  PORT = 3000, SECRET_KEY, DATABASE_URL = 'mongodb://127.0.0.1:27017/moviesdb', NODE_ENV, HASH_LENGTH = 10,
} = process.env;

const JWT_STORAGE_TIME = '7d';

module.exports = {
  PORT,
  SECRET_KEY,
  DATABASE_URL,
  HASH_LENGTH,
  JWT_STORAGE_TIME,
  NODE_ENV,
  limiter,
};
