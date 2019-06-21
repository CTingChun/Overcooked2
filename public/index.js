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

// Init Game
var game = new Phaser.Game(WindowWidth, WindowHeight, Phaser.AUTO);

// Add Socket to Game
game.socket = io('http://localhost:80/Hall');

// Add Game State
game.state.add('Menu', new Menu());
game.state.add('Tutorial', new Tutorial());
game.state.add('Room', new Room());
game.state.add('MainGame', new MainGame());
game.state.add('EndGameMenu', new EndGameMenu());

// Start Game State, 這邊測試的時候可以自己改掉
game.state.start('EndGameMenu');