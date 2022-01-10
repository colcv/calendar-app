const jsStringify = require('js-stringify');
const { StatusCodes } = require('http-status-codes');
const Calendar = require('../models/calendar-model');
const Event = require('../models/event-model');
const User = require('../models/user-model');
// const User = require('../models/user-model');

const renderHomePage = async (req, res) => {
  const { user } = req;
  let calendar;
  if (user) {
    calendar = user.calendarList.find(item => item.isPrimary === true);
    res.redirect(`/calendars/${calendar.calendar._id}`);
  } else {
    calendar = await Calendar.findOne({
      title: 'Default Calendar',
    });
    calendar = await Calendar.findById(String(calendar._id)).populate({
      path: 'events',
    });
  }

  let { events } = calendar;
  events = JSON.parse(JSON.stringify(events));
  events.forEach(event => {
    event.start = event.start.substring(0, 10);
    event.end = event.end.substring(0, 10);
  });

  res.status(StatusCodes.OK).render('calendar', {
    jsStringify,
    title: 'Calendar',
    events,
  });
};

const renderSpecificCalendar = async (req, res) => {
  const { user } = req;
  if (user) {
    const { calendarID } = req.params;
    const calendar = await Calendar.findById(calendarID).populate({
      path: 'events tasks',
    });
    let { events, tasks } = calendar;

    events = JSON.parse(JSON.stringify(events));
    events.forEach(event => {
      event.start = event.start.substring(0, 10);
      event.end = event.end.substring(0, 10);
    });

    tasks = JSON.parse(JSON.stringify(tasks));
    tasks.forEach(task => {
      task.start = task.start.substring(0, 10);
    });

    const { calendarList } = user;

    res.status(StatusCodes.OK).render('calendar', {
      jsStringify,
      title: 'Calendar',
      events,
      tasks,
      calendarList,
      calendarID,
    });
  } else {
    res.redirect('/');
  }
};

const renderLoginPage = async (req, res) => {
  res.status(StatusCodes.OK).render('login', {
    title: 'Log into your account',
  });
};

const renderAddEventPage = async (req, res) => {
  const { calendarID } = req.params;
  res.status(StatusCodes.OK).render('add-event', {
    title: 'Add Event',
    calendarID,
  });
};

const renderEditEventPage = async (req, res) => {
  const { calendarID, eventID } = req.params;
  const event = JSON.parse(JSON.stringify(await Event.findById(eventID)));
  event.start = event.start.substring(0, 10);
  event.end = event.end.substring(0, 10);

  res.status(StatusCodes.OK).render('edit-event', {
    title: 'Edit Event',
    event,
    eventID,
    calendarID,
  });
};

const renderAddCalendarPage = async (req, res) => {
  res.status(StatusCodes.OK).render('add-calendar', {
    title: 'Add Calendar',
  });
};

const renderEditCalendarPage = async (req, res) => {
  const { calendarID } = req.params;
  const calendar = await Calendar.findById(calendarID);
  res.status(StatusCodes.OK).render('edit-calendar', {
    title: 'Edit Calendar',
    calendarID,
    calendar,
  });
};

const renderShareCalendarPage = async (req, res) => {
  const { calendarID } = req.params;
  res.status(StatusCodes.OK).render('share-calendar', {
    title: 'Share Calendar',
    calendarID,
  });
};

const renderAcceptPage = async (req, res) => {
  const { calendarID, from, email } = req.query;
  const userFrom = await User.findOne({ email: from });
  const userTo = await User.findOne({ email });
  const calendar = await Calendar.findById(calendarID);

  if (!userTo.calendarList.find(item => String(item.calendar) === calendarID)) {
    userTo.calendarList.push({
      calendar: calendarID,
      isPrimary: false,
      role: 'reader',
      otherTitle: `${calendar.title} (${userFrom.name})`,
    });
    await userTo.save();
  }

  res.redirect(`/calendars/${calendarID}`);
};

const renderRegisterPage = async (req, res) => {
  res.status(StatusCodes.OK).render('register', {
    title: 'Register',
  });
};

const renderAddTaskPage = async (req, res) => {
  const { calendarID } = req.params;
  res.status(StatusCodes.OK).render('add-task', {
    title: 'Add Task',
    calendarID,
  });
};

module.exports = {
  renderHomePage,
  renderLoginPage,
  renderAddEventPage,
  renderSpecificCalendar,
  renderEditEventPage,
  renderAddCalendarPage,
  renderEditCalendarPage,
  renderShareCalendarPage,
  renderAcceptPage,
  renderRegisterPage,
  renderAddTaskPage,
};
