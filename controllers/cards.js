const Card = require('../models/card');
const { customError } = require('../errors/customErrors');
const { CREATED } = require('../errors/errorStatuses');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(CREATED).send(card);
    })
    .catch((err) => {
      customError(err, req, res, next);
    });
};

const findCards = (req, res, next) => {
  Card.find({}).sort({ createdAt: -1 })
    .then((cards) => res.send(cards))
    .catch((err) => {
      customError(err, req, res, next);
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError('Данных по указанному id нет');
    })
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Удаляемая запись принадлежит другому пользователю');
      }
      Card.findByIdAndRemove(req.params.cardId)
        .orFail(() => {
          throw new NotFoundError('Данных по указанному id нет');
        })
        .then((cardForDeleting) => {
          res.send(cardForDeleting);
        })
        .catch((err) => {
          customError(err, req, res, next);
        });
    })
    .catch((err) => {
      customError(err, req, res, next);
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Данных по указанному id нет');
    })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      customError(err, req, res, next);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Данных по указанному id нет');
    })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      customError(err, req, res, next);
    });
};

module.exports = {
  createCard,
  findCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
