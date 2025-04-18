import "server-only"; 

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const decodeKey = Buffer.from(process.env.FIREBASE_PRIVATE_KEY!, 'base64').toString('utf8');

export const firebaseCert = cert({
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: decodeKey,
})

if(!getApps().length) {
  initializeApp({
    credential: firebaseCert,
    databaseURL: process.env.FIREBASE_BUCKET,
  });
}


export const db = getFirestore();