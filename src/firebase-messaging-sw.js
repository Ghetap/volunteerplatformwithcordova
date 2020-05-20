// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/7.14.4/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.14.4/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: "AIzaSyAxm9vyjSJVNO-pxfoYfZaF1PPOIhmQQwY",
    authDomain: "firestorevolunteerplatform.firebaseapp.com",
    databaseURL: "https://firestorevolunteerplatform.firebaseio.com",
    projectId: "firestorevolunteerplatform",
    storageBucket: "firestorevolunteerplatform.appspot.com",
    messagingSenderId: "533507517952",
    appId: "1:533507517952:web:e6c42580b93562f9d9b2e5",
    measurementId: "G-17FCVDF70N"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();