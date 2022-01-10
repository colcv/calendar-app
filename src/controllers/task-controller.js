const { StatusCodes } = require('http-status-codes');
const Calendar = require('../models/calendar-model');
const User = require('../models/user-model');
const Task = require('../models/task-model');
const customError = require('../errors');

const createTask = async (req, res) => {
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

  const { title, description, start } = req.body;

  const task = await Task.create({
    title,
    description,
    start,
    creator: req.user.userID,
  });

  calendar.tasks.push(task._id);
  await calendar.save();

  res.status(StatusCodes.OK).json({ status: 'success', task });
};

module.exports = {
  createTask,
};
