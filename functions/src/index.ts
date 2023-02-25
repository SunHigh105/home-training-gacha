import * as functions from 'firebase-functions';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_BASE_URL,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

const firestore = require('./firestore');
const createMenu = require('./createMenu');
const constants = require('./constants');

app.get('/', (res: any) => {
  res.send('Simple REST API');
});

app.get('/training_menus', async (req: any, res: any) => {
  try {
    // Request validation
    // TODO: リクエストパラメータmuscle,cardioのバリデーション
    if (!req.query.minute) {
      throw new Error('Request parameter "minute" required.');
    }
    if (!constants.MINUTE_PATTERN[req.query.minute]) {
      throw new Error(
        `Request parameter "minute" is invalid value. Valid values: ${Object.keys(
          constants.MINUTE_PATTERN
        ).join(', ')}`
      );
    }

    const muscleCategories = req.query.muscle
      ? createMenu.getFilterdCategories(
          constants.CATEGORY_MUSCLE_TRAININGS,
          req.query.muscle
        )
      : Object.values(constants.CATEGORY_MUSCLE_TRAININGS);
    const cardioCategories = req.query.cardio
      ? createMenu.getFilterdCategories(
          constants.CATEGORY_CARDIO_HIIT,
          req.query.cardio
        )
      : Object.values(constants.CATEGORY_CARDIO_HIIT);

    const minutePattern = constants.MINUTE_PATTERN[req.query.minute];

    const trainingList = await firestore.getData([
      ...muscleCategories,
      ...cardioCategories,
    ]);

    const muscleTrainings = createMenu.createTrainingMenu(
      trainingList,
      minutePattern.muscle,
      muscleCategories
    );
    const cardioHiits = createMenu.createTrainingMenu(
      trainingList,
      minutePattern.cardio,
      cardioCategories
    );

    res.json({
      totalMinute: muscleTrainings.totalMinute + cardioHiits.totalMinute,
      trainings: [...muscleTrainings.trainings, ...cardioHiits.trainings],
    });
  } catch (e) {
    if (e instanceof Error) {
      res.status(400);
      res.json({ error: e.message });
      return;
    }
    res.status(500);
    res.json({ error: 'Unexpected error occured.' });
  }
});

exports.app = functions.https.onRequest(app);
