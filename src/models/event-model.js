const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, 'Please provide event title'],
      minlength: [5, 'Event title must have at least 5 characters'],
      maxlength: [50, 'Event title length limit is 50 characters'],
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'Please provide event description'],
      minlength: [10, 'Event description must have at least 10 characters'],
      maxlength: [1000, 'Event description length limit is 1000 characters'],
    },
    // summary: {
    //   type: String,
    //   trim: true,
    //   required: [true, 'Please provide event summary'],
    //   minlength: [10, 'Event summary must have at least 10 characters'],
    //   maxlength: [50, 'Event summary length limit is 50 characters'],
    // },
    location: {
      type: String,
      required: [true, 'Please provide event location'],
      minlength: [5, 'Event location must have at least 10 characters'],
      maxlength: [50, 'Event location length limit is 50 characters'],
    },
    organizer: {
      type: String,
      trim: true,
      // required: [true, 'Please provide event organizer'],
      minlength: [5, 'Event organizer must have at least 10 characters'],
      maxlength: [50, 'Event organizer length limit is 50 characters'],
    },
    start: {
      type: Date,
      required: [true, 'Please provide event start time'],
    },
    end: {
      type: Date,
      required: [true, 'Please provide event end time'],
    },
    visibility: {
      type: String,
      enum: ['private', 'public'],
      default: 'public',
    },
    creator: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    // attendees: [
    //   {
    //     type: mongoose.Types.ObjectId,
    //     ref: 'User',
    //   },
    // ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Event', eventSchema);
