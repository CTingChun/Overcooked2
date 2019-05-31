var menuState = {
    preload : function () {
        game.load.image('bg', '../assets/.png');
        game.load.image('word', '../assets/overcooked.png');

    },

    create : function () {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        this.bg = game.add.tileSprite(0, 0, 1280, 720, 'bg');
        this.word = game.add.image(0, 0, 'word');
    },

    update : function () {
        //  Scroll the background
        this.bg.tilePosition.x -= 2;
    },
}

var game = new Phaser.Game(1280, 720, Phaser.AUTO, 'canvas');
game.state.add('menu', menuState);
game.state.start('menu');