const express = require('express');
const {
  createUserPrimaryCalendar,
} = require('../controllers/user-calendar-controller');
const { register, login, logout } = require('../controllers/auth-controller');

const router = express.Router();

router.post('/register', register, createUserPrimaryCalendar);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;
