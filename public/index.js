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

var connector = new Connector('roomId', 'playerId');

// var test = {
//   body: {
//     a: 1,
//     b: 2
//   },
//   c: 2,
//   d: 4
// }

// var validator = {
//   set(target, property, value) {
//     console.log('value: ' + value);
//     target[property] = value;
//     return true;
//   }
// }
// test.body.customTestProxy = Proxy.revocable(test.body, validator);
// test.customTestProxy = Proxy.revocable(test, validator);
// var bodyProxy = test.body.customTestProxy.proxy;
// var testProxy = test.customTestProxy.proxy;