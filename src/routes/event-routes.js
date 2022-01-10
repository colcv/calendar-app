const router = require('express').Router();
const eventController = require('../controllers/event-controller');
const authHandler = require('../middlewares/auth-handler');

router.use(authHandler.authenticateUser);
router
  .route('/')
  .get(eventController.getAllEvents)
  .post(eventController.createEvent);

router
  .route('/:eventID')
  .get(eventController.getSingleEvent)
  .patch(eventController.updateEvent)
  .delete(eventController.deleteEvent);

module.exports = router;
