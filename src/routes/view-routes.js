const router = require('express').Router();
const viewController = require('../controllers/view-controller');
const authHandler = require('../middlewares/auth-handler');

router.use(authHandler.checkLoggedIn);

router.get('/', viewController.renderHomePage);
router.get('/login', viewController.renderLoginPage);
router.get('/register', viewController.renderRegisterPage);
router.get('/calendars/add-calendar', viewController.renderAddCalendarPage);
router.get(
  '/calendars/:calendarID/share-calendar',
  viewController.renderShareCalendarPage
);
router.get(
  '/calendars/:calendarID/edit-calendar',
  viewController.renderEditCalendarPage
);
router.get('/calendars/:calendarID', viewController.renderSpecificCalendar);
router.get(
  '/calendars/:calendarID/add-event',
  viewController.renderAddEventPage
);
router.get(
  '/calendars/:calendarID/edit-event/:eventID',
  viewController.renderEditEventPage
);
router.get('/share-calendar', viewController.renderAcceptPage);
router.get('/calendars/:calendarID/add-task', viewController.renderAddTaskPage);

module.exports = router;
