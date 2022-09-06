const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, 'Должно быть не менее 2, у вас {VALUE}'],
    maxlength: [30, 'Должно быть не менее 2, у вас {VALUE}'],
  },
  link: {
    type: String,
    required: true,
    validator: (link) => validator.isURL(link, {
      protocols: ['http', 'https'],
      require_protocol: true,
    }),
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
