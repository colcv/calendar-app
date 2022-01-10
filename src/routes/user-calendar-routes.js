const express = require('express');
const userCalendarController = require('../controllers/user-calendar-controller');
const eventController = require('../controllers/event-controller');
const taskController = require('../controllers/task-controller');
const authHandler = require('../middlewares/auth-handler');

const router = express.Router();

// protect all routes after this middleware
router.use(authHandler.authenticateUser);
router
  .route('/')
  .get(userCalendarController.getAllUserCalendars)
  .post(userCalendarController.createUserCalendar);

router
  .route('/:id')
  .get(userCalendarController.getSingleUserCalendar)
  .patch(userCalendarController.updateUserCalendar)
  .delete(userCalendarController.deleteUserCalendar);

router.get('/:calendarID/share/:email', userCalendarController.shareCalendar);

router
  .route('/:calendarID/events')
  .get(eventController.getAllEvents)
  .post(eventController.createEvent);

router
  .route('/:calendarID/events/:eventID')
  .get(eventController.getSingleEvent)
  .patch(eventController.updateEvent)
  .delete(eventController.deleteEvent);

router.route('/import-calendar').post(userCalendarController.importCalendar);

router.route('/:calendarID/tasks').post(taskController.createTask);

module.exports = router;
