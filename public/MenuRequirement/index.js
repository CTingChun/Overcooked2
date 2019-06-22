class MenuRequirement {
  constructor(game, idx, type, hash) {
    this.game = game;
    this.hash = hash;
    this.idx = idx;
    this.type = type;

    // x position
    let x = idx * MenuWidth + (idx + 1) * 20

    if (type === 'onion') this.sprite = this.game.add.sprite(x, 20, 'OnionSoupRequirement');
    else if (type === 'tomato') this.sprite = this.game.add.sprite(x, 15, 'TomatoSoupRequirement');
    else if (type === 'mashroom') this.sprite = this.game.add.sprite(x, 16, 'MashroomSoupRequirement');
  }

  delete() {
    this.sprite.destroy();
  }
}