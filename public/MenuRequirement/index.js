class MenuRequirement {
  constructor(game, idx, type) {
    this.game = game;

    // x position
    let x = idx * MenuWidth + (idx + 1) * 20

    if (type === 'onion') this.sprite = this.game.add.sprite(x, 20, 'OnionSoupRequirement');
  }
}