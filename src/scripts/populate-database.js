/* eslint-disable */
require('dotenv').config();
const data = require('../data/events');
const connectDB = require('../../db/connect-mongodb');
const Calendar = require('../models/calendar-model');
const Event = require('../models/event-model');

const db = process.env.MONGO_URL.replace(
  '<PASSWORD>',
  process.env.MONGO_PASSWORD
);

const populateDatabase = async () => {
  try {
    await connectDB(db);
    const events = [];
    for (let i = 0; i < data.length; ++i) {
      const event = await Event.create(data[i]);
      events.push(event);
    }

    const calendar = await Calendar.create({
      title: 'Default Calendar',
      description: 'Default Calendar XXX',
      events,
    });
    console.log('success');
  } catch (err) {
    console.log(err);
  }
};

populateDatabase();
