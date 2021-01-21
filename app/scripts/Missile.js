const MISSILE_ANIMATION_SPEED = 1;
const MISSILE_CLASS = 'missile'
export const MISSILE_HEIGHT = 20;
export const MISSILE_WIDTH = 12;

export class Missile{
    constructor(posX, posY){
        this.posX = posX;
        this.posY = posY;
        this.element;
        this.interval;
    }

    renderMissile(){
        this.element = document.createElement('div');
        this.element.style.left = `${this.posX}px`;
        this.element.style.top = `${this.posY}px`;
        this.element.classList.add(MISSILE_CLASS);

        this.#missileAnimationMove();

        return this.element;
    }

    #missileAnimationMove(){
        this.interval = setInterval(() => {
            this.posX -= MISSILE_ANIMATION_SPEED;
            this.element.style.top = `${this.posX}px`;
        }, 5)
    }
}