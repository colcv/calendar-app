const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  start: {
    type: Date,
    required: true,
  },
  visibility: {
    type: String,
    enum: ['private', 'public'],
    default: 'private',
  },
  creator: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = mongoose.model('Task', taskSchema);
