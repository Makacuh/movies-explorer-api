const Movie = require('../models/movies');
const { customError } = require('../errors/customErrors');
const { CREATED } = require('../errors/errorStatuses');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');

const createMovie = (req, res, next) => {
  const ownerId = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: ownerId,
  })
    .then((movie) => {
      res.status(CREATED).send(movie);
    })
    .catch((err) => {
      customError(err, req, res, next);
    });
};

const getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => res.send(movies))
    .catch((err) => {
      customError(err, req, res, next);
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .orFail(() => {
      throw new NotFoundError('Данных по указанному id нет');
    })
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Удаляемая запись принадлежит другому пользователю');
      }
      Movie.findByIdAndRemove(req.params._id)
        .orFail(() => {
          throw new NotFoundError('Данных по указанному id нет');
        })
        .then((movieForDeleting) => {
          res.send(movieForDeleting);
        })
        .catch((err) => {
          customError(err, req, res, next);
        });
    })
    .catch((err) => {
      customError(err, req, res, next);
    });
};

module.exports = {
  createMovie,
  getMovies,
  deleteMovie,
};
