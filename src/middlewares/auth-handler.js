const jwt = require('jsonwebtoken');
const customError = require('../errors');
const User = require('../models/user-model');

const authenticateUser = async (req, res, next) => {
  // 1. Check if token (via cookie) exists
  const { token } = req.signedCookies;
  if (!token) {
    throw new customError.UnauthenticatedError(
      'You are not logged in. Please log in to get access'
    );
  }

  // 2. Verify token
  // jwt.verify() throws error if signature is invalid (catched in global error handler)
  const { name, email, userID, role, iat } = jwt.verify(
    token,
    process.env.JWT_SECRET
  );

  // 3. Check if user still exist
  const currentUser = await User.findById(userID);
  if (!currentUser) {
    throw new customError.UnauthenticatedError(
      'The user belonging to this token does no longer exist'
    );
  }

  // 4. Check if user changed password AFTER the token was issued
  if (currentUser.isPasswordChanged(iat)) {
    throw new customError.UnauthenticatedError(
      'Password has been changed. Please log in again'
    );
  }

  // 5. Grant access to protected routes
  req.user = { name, email, userID, role };
  next();
};

const authorizePermissions =
  (...roles) =>
  async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new customError.UnauthorizedError(
        'Unauthorized to access this route'
      );
    }
    next();
  };

// Only for rendered pages, no errors!
const checkLoggedIn = async (req, res, next) => {
  const { token } = req.signedCookies;
  if (token) {
    // Verify token
    // jwt.verify() throws error if signature is invalid (catched in global error handler)
    const { userID, iat } = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exist
    const currentUser = await User.findById(userID).populate({
      path: 'calendarList.calendar',
    });

    if (!currentUser) {
      return next();
    }

    // 4. Check if user changed password AFTER the token was issued
    if (currentUser.isPasswordChanged(iat)) {
      return next();
    }

    // There is a logged in user
    res.locals.user = currentUser;
    req.user = currentUser;
    return next();
  }
  next();
};

module.exports = {
  authenticateUser,
  authorizePermissions,
  checkLoggedIn,
};
