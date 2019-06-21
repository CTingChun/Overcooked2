// Window Size
var WindowWidth = 1280;
var WindowHeight = 720;

// Player Initial Postion
// |-------------------------------------|
// |---(450,250)-------------(830,250)---|
// |----Player1---------------Player2----|
// |-------------------------------------|
// |----Player3---------------Player4----|
// |---(450,470)-------------(830,470)---|
// |-------------------------------------|
var PlayerInitXOffset = 450;
var PlayerInitYOffset = 250;

var Player1Pos = { x:PlayerInitXOffset, y:PlayerInitYOffset };
var Player2Pos = { x:WindowWidth - PlayerInitXOffset, y:PlayerInitYOffset };
var Player3Pos = { x:PlayerInitXOffset, y:WindowHeight - PlayerInitYOffset };
var Player4Pos = { x:WindowWidth - PlayerInitXOffset, y:WindowHeight - PlayerInitYOffset };

var PlayerPosition = {
  '0': Player1Pos,
  '1': Player2Pos,
  '2': Player3Pos,
  '3': Player4Pos
};

var MenuWidth = 115;
var MenuHeight = 160;
