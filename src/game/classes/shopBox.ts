import Phaser from 'phaser';
import Item from './item';
import { ItemGradeType, KeybindType, PowerupType } from '../types';
import Player from './playerTower';
import { getArrayRandomElement } from '../../utils';

interface ShopBoxConfig {
  scene: Phaser.Scene;
  x: number;
  y: number;
  key: string;
  keybind: KeybindType;
}

export default class ShopBox extends Phaser.GameObjects.Sprite {
  private currentItem: Item | null = null;
  private itemImage: Phaser.Physics.Arcade.Sprite | null = null;
  private keybind: KeybindType = 'Z';
  private keybindText: Phaser.GameObjects.Text;
  private priceText: Phaser.GameObjects.Text | null = null;

  constructor({ scene, x, y, key, keybind }: ShopBoxConfig) {
    super(scene, x, y, key);
    this.keybind = keybind;
    scene.add.existing(this);
    this.keybindText = scene.add.text(x - 35, y + 20, keybind, {
      font: '16px Arial',
      color: '#FFFFFF',
    });
    scene.add.existing(this.keybindText);
  }

  public addItem = (item: Item | null = null): void => {
    item = item || this.generateRandomItem();
    this.currentItem = item;
    this.priceText?.destroy();
    this.itemImage?.destroy();
    this.priceText = this.scene.add.text(
      this.x - 35,
      this.y - 35,
      item.cost.toString(),
      { font: '16px Arial', color: '#000000' },
    );
    this.itemImage = this.scene.physics.add.sprite(
      this.x,
      this.y,
      item.powerup,
    );
  };

  public buyItem = (player: Player): Item | null => {
    if (this.currentItem && player.currentGold >= this.currentItem.cost) {
      const boughtItem = this.currentItem;
      this.currentItem = null;
      this.priceText && this.priceText.destroy();
      this.itemImage && this.itemImage.destroy();
      this.addItem();
      player.currentGold -= boughtItem.cost;
      return boughtItem;
    }
    return null;
  };

  public removeItem = (): void => {
    this.currentItem = null;
  };

  public getItem = (): Item | null => {
    return this.currentItem;
  };

  generateRandomItem(): Item {
    const gradeCost = {
      D: 20,
      C: 40,
      B: 60,
      A: 80,
      S: 120,
    };

    const randomNum = Math.random() * 100;
    let grade: ItemGradeType = 'D';
    if (randomNum > 40 && randomNum <= 70) grade = 'C';
    if (randomNum > 70 && randomNum <= 90) grade = 'B';
    if (randomNum > 90 && randomNum <= 98) grade = 'A';
    if (randomNum > 98 && randomNum <= 100) grade = 'S';

    const itemCost =
      Math.floor(gradeCost[grade] * Math.random() * 0.6 + 0.7) + 1;

    const itemArray: Array<PowerupType> = ['arrowRate', 'tornado'];
    const randomItem = getArrayRandomElement(itemArray);

    return new Item(this.scene, 0, 0, 'item0', randomItem, grade, itemCost);
  }

  public getKeybind = (): KeybindType => {
    return this.keybind;
  };
}
