require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const signup = require('./routes/signup');
const signin = require('./routes/signin');
const auth = require('./middlewares/auth');
const users = require('./routes/users');
const movies = require('./routes/movies');
const NotFoundError = require('./errors/notFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000, BASE_PATH } = process.env;

const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(helmet());
app.use(requestLogger);
app.use(limiter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.use('/signin', signin);
app.use('/signup', signup);

app.use(auth);

app.use('/users', users);
app.use('/movies', movies);

app.use('/*', () => {
  throw new NotFoundError('Страница не найдена');
});

app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({ message: statusCode === 500 ? 'Ошибка на сервере' : message });
  next();
});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/moviesdb', {
    useNewUrlParser: true,
  });
  console.log('Connected to db');
  await app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Ссылка на сервер');
    console.log(BASE_PATH);
  });
}

main();
