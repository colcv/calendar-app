const { StatusCodes } = require('http-status-codes');
const Calendar = require('../models/calendar-model');
const User = require('../models/user-model');
const Event = require('../models/event-model');
const customError = require('../errors');

const createEvent = async (req, res) => {
  const { calendarID } = req.params;
  const calendar = await Calendar.findById(calendarID);

  if (calendar) {
    const user = await User.findById(req.user.userID);
    if (!user.calendarList.some(item => String(item.calendar) === calendarID)) {
      throw new customError.NotFoundError(
        `No calendar with ID: ${calendarID} in your calendar list`
      );
    }
  } else {
    throw new customError.NotFoundError(`No calendar with ID: ${calendarID}`);
  }

  const { title, description, location, organizer, start, end } = req.body;

  const event = await Event.create({
    title,
    description,
    location,
    organizer,
    start,
    end,
    creator: req.user.userID,
  });

  calendar.events.push(event._id);
  await calendar.save();

  res.status(StatusCodes.OK).json({ status: 'success', event });
};

const getAllEvents = async (req, res) => {
  res.send('create event');
};

const getSingleEvent = async (req, res) => {
  res.send('create event');
};

const updateEvent = async (req, res) => {
  const { eventID } = req.params;

  const event = await Event.findByIdAndUpdate(eventID, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(StatusCodes.OK).json({
    status: 'success',
    event,
  });
};

const deleteEvent = async (req, res) => {
  const { eventID } = req.params;
  await Event.findByIdAndDelete(eventID);
  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Event deleted',
  });
};

module.exports = {
  createEvent,
  getAllEvents,
  getSingleEvent,
  updateEvent,
  deleteEvent,
};
