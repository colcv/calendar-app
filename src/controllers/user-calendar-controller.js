const nodemailer = require('nodemailer');
const { StatusCodes } = require('http-status-codes');
const customError = require('../errors');
const Calendar = require('../models/calendar-model');
const Event = require('../models/event-model');
const User = require('../models/user-model');
const data = require('../data/events');

const createUserPrimaryCalendar = async (req, res) => {
  const { user } = req;
  const events = [];
  for (let i = 0; i < data.length; ++i) {
    const event = await Event.create({ creator: user._id, ...data[i] });
    events.push(event);
  }

  const calendar = await Calendar.create({
    title: 'User Default Calendar',
    description: 'User primary calendar',
    creator: user._id,
    accessingUsers: [{ user: user._id, role: 'owner' }],
    events,
  });

  user.calendarList.push({
    calendar: calendar._id,
    isPrimary: true,
    role: 'owner',
  });
  await user.save();

  user.password = undefined;
  user.calendarList = undefined;
  res.status(StatusCodes.OK).json({ status: 'success', user });
};

const getAllUserCalendars = async (req, res) => {
  const user = await User.findById(req.user.userID).populate({
    path: 'calendarList.calendar',
    select: 'title',
  });
  const calendars = user.calendarList;
  res
    .status(StatusCodes.OK)
    .json({ status: 'success', results: calendars.length, calendars });
};

const getSingleUserCalendar = async (req, res) => {
  const { id: calendarID } = req.params;
  const calendar = await Calendar.findById(calendarID)
    .populate({ path: 'creator', select: 'title email' })
    .populate({ path: 'accessingUsers.user', select: 'title email' });

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

  res.status(StatusCodes.OK).json({ status: 'success', calendar });
};

const createUserCalendar = async (req, res) => {
  const { title, description } = req.body;
  const user = await User.findById(req.user.userID);
  let calendar = await Calendar.create({
    title,
    description,
    creator: user._id,
    accessingUsers: [{ user: user._id, role: 'owner' }],
  });

  user.calendarList.push({
    calendar: calendar._id,
    isPrimary: false,
    role: 'owner',
  });
  await user.save();

  calendar = await Calendar.findById(String(calendar._id))
    .populate({ path: 'creator', select: 'title email' })
    .populate({ path: 'accessingUsers.user', select: 'title email' });

  res.status(StatusCodes.CREATED).json({ status: 'success', calendar });
};

const updateUserCalendar = async (req, res) => {
  const { id: calendarID } = req.params;
  const calendar = await Calendar.findByIdAndUpdate(calendarID, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(StatusCodes.OK).json({
    status: 'success',
    calendar,
  });
};

const deleteUserCalendar = async (req, res) => {
  res.send('delete calendar');
};

const shareCalendar = async (req, res) => {
  const { calendarID, email } = req.params;
  const { user } = req;
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'alaina.fahey17@ethereal.email',
      pass: 'BcVFZZT88HhY6eTDXC',
    },
  });
  const link = `http://127.0.0.1:5000/share-calendar?calendarID=${calendarID}&email=${email}&from=${user.email}`;
  await transporter.sendMail({
    from: 'calendarapp@gmail.com', // sender address
    to: email, // list of receivers
    subject: 'Calendar sharing invitation', // Subject line
    // text: 'Hello world?', // plain text body
    html: `${user.name} just invite you to access his calendar, click here to accept <a href=${link}>Accept</a>`, // html body
  });
  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Email sent',
  });
};

const importCalendar = async (req, res) => {
  const { calendarID } = req.body;
  const calendar = await Calendar.findById(calendarID).populate({
    path: 'creator',
  });
  let { user } = req;
  user = await User.findById(user.userID);
  if (!user.calendarList.find(item => String(item.calendar) === calendarID)) {
    user.calendarList.push({
      calendar: calendarID,
      isPrimary: false,
      role: 'reader',
      otherTitle: `${calendar.title} (${calendar.creator.name})`,
    });
    await user.save();
  }
  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Calendar imported',
  });
};

module.exports = {
  getAllUserCalendars,
  getSingleUserCalendar,
  createUserCalendar,
  updateUserCalendar,
  deleteUserCalendar,
  createUserPrimaryCalendar,
  shareCalendar,
  importCalendar,
};
