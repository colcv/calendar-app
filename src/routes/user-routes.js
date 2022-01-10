const express = require('express');
const {
  createUserPrimaryCalendar,
} = require('../controllers/user-calendar-controller');
const userController = require('../controllers/user-controller');
const authHandler = require('../middlewares/auth-handler');

const router = express.Router();

// protect all routes after this middleware
router.use(authHandler.authenticateUser);
router
  .route('/me')
  .get(userController.getCurrentUser)
  .patch(userController.updateCurrentUser);
router.route('/me/password').patch(userController.updateCurrentUserPassword);

// only admin can access the following routes
router.use(authHandler.authorizePermissions('admin'));
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser, createUserPrimaryCalendar);
router
  .route('/:id')
  .get(userController.getSingleUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
