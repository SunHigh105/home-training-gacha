import * as functions from 'firebase-functions';

import express = require('express');
import cors = require('cors');
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_BASE_URL,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

import * as firestore from './firestore';
import * as createMenu from './createMenu';
import * as constants from './constants';

import { RequestQuery } from './interface';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
app.get('/', (res: any) => {
  res.send('Simple REST API');
});

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
app.get('/training_menus', async (req: RequestQuery, res: any) => {
  try {
    // Request validation
    // TODO: リクエストパラメータmuscle,cardioのバリデーション
    if (!req.query.minute) {
      throw new Error('Request parameter "minute" required.');
    }

    const minutePattern = constants.MINUTE_PATTERN[req.query.minute];

    if (!minutePattern) {
      throw new Error('Request parameter "minute" is invalid value.');
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

    const trainingList = await firestore.getData([
      ...muscleCategories,
      ...cardioCategories,
    ]);

    const muscleTrainings = createMenu.createTrainingMenu(
      trainingList,
      minutePattern['muscle'],
      muscleCategories
    );
    const cardioHiits = createMenu.createTrainingMenu(
      trainingList,
      minutePattern['cardio'],
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
