const mongoose = require('mongoose');

const calendarSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, 'Please provide calendar title'],
      minlength: [5, 'Calendar title must have at least 5 characters'],
      maxlength: [50, 'Calendar title length limit is 50 characters'],
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'Please provide calendar description'],
      minlength: [10, 'Description must have at least 10 characters'],
      maxlength: [1000, 'Description length limit is 1000 characters'],
    },
    // summary: {
    //   type: String,
    //   trim: true,
    //   required: [true, 'Please provide calendar summary'],
    //   minlength: [10, 'Summary must have at least 10 characters'],
    //   maxlength: [50, 'Summary length limit is 50 characters'],
    // },
    creator: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    accessingUsers: [
      {
        user: {
          type: mongoose.Types.ObjectId,
          ref: 'User',
        },
        role: {
          type: String,
          enum: ['reader', 'writer', 'owner'],
        },
      },
    ],
    events: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Event',
      },
    ],
    tasks: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Task',
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Calendar', calendarSchema);
