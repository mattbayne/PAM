import * as firebase from 'firebase/app';
import 'firebase/auth';

const firebaseApp = firebase.initializeApp({
    apiKey: process.envREACT_APP_FIREBASE_KEY,
    authDomain: process.envREACT_APP_FIREBASE_DOMAIN,
    databaseURL: process.envREACT_APP_FIREBASE_DATABASE,
    projectId: process.envREACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.envREACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.envREACT_APP_FIREBASE_SENDER_ID,
    appId: process.envREACT_APP_FIREBASE_APP_ID,
})

export default firebaseApp;