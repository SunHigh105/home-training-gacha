import admin = require('firebase-admin');
import { getFirestore } from 'firebase-admin/firestore';

// TODO: import serviceAccount from '../serviceAccount.json';
const serviceAccount = require('../serviceAccount.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const getData = async (categories: Array<string>) => {
  const db = getFirestore();
  const snapshot = await db
    .collection('videos')
    .where('category', 'in', categories)
    .get();

  const result: Array<any> = [];
  snapshot.forEach((doc: any) => {
    result.push(doc.data());
  });

  return result;
};
