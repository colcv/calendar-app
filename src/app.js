const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

// Errors Handlers
const errorHandler = require('./middlewares/error-handler');
const notFoundHandler = require('./middlewares/not-found-handler');

// Routers
const viewRouter = require('./routes/view-routes');
const authRouter = require('./routes/auth-routes');
const userRouter = require('./routes/user-routes');
const userCalendarRouter = require('./routes/user-calendar-routes');

// Initilize App
const app = express();

// Serving Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Set View Template Engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Global Middlewares
// enable cors
app.use(cors());

// development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// body parser, reading data from body into req.body
app.use(express.json());

// cookie parser, writing cookie into req.signedCookies
app.use(cookieParser(process.env.JWT_SECRET));

// Routes
app.use('/', viewRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users/me/calendars', userCalendarRouter);
app.use('/api/v1/users', userRouter);
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
