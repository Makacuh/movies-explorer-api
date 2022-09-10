const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const { PORT, DATABASE_URL } = require('./utils/config');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/notFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./utils/config');

const app = express();

app.use(helmet());
app.use(requestLogger);
app.use(limiter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.use(require('./routes/login'));

app.use(auth);

app.use(require('./routes/users'));
app.use(require('./routes/movies'));

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
  await mongoose.connect(DATABASE_URL, {
    useNewUrlParser: true,
  });
  console.log('Connected to db');
  await app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Ссылка на сервер');
  });
}

main();
