// Init Firebase
// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyC8C60Q_leY46MeZDOEqurrOAvK0pUcB8M",
  authDomain: "team31-finalproject.firebaseapp.com",
  databaseURL: "https://team31-finalproject.firebaseio.com",
  projectId: "team31-finalproject",
  storageBucket: "team31-finalproject.appspot.com",
  messagingSenderId: "1054701344101",
  appId: "1:1054701344101:web:6c05d13497ea57d5"
});

var connector = new Connector('OQvkPJXO27NJMUVY6SO4', '1');

var test = {
  body: {
    a: 1,
    b: 2,
    f: 32
  },
  c: 2,
  d: 4,
  e: 0
}