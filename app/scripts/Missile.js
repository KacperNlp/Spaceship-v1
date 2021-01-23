const MISSILE_ANIMATION_SPEED = 1;
const MISSILE_CLASS = "missile";
export const MISSILE_HEIGHT = 20;
export const MISSILE_WIDTH = 12;

export class Missile {
  constructor(posX, posY, gameContainer) {
    this.element;
    this.gameContainer = gameContainer;
    this.interval;
    this.posX = posX;
    this.posY = posY;

    this.#renderMissile();
  }

  #renderMissile() {
    this.element = document.createElement("div");
    this.element.style.left = `${this.posX}px`;
    this.element.style.top = `${this.posY}px`;
    this.element.classList.add(MISSILE_CLASS);

    this.gameContainer.appendChild(this.element);
    this.#missileAnimationMove();
  }

  #missileAnimationMove() {
    this.interval = setInterval(() => {
      this.posY -= MISSILE_ANIMATION_SPEED;
      this.element.style.top = `${this.posY}px`;
    }, 5);
  }

  //delete missile
  deleteMissile() {
    this.#removeMissileFromHtml();
    this.#stopAnimate();
  }

  #removeMissileFromHtml() {
    this.element.remove();
  }

  #stopAnimate() {
    clearInterval(this.interval);
  }
}
