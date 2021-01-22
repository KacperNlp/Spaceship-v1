const EXPLOSION_ANIMATION_TIMER = 800;
const NUMBER_OF_PIXELS_PER_MOVE = 1;
export const PROPORTION_TO_GET_SHIP_TYPE = 5;
export const TYPES_OF_ENEMIES = {
    small:{
        shipType: 'enemy-ship',
        explosion: 'enemy-ship--explosion',
        hp: 1,
        animationSpeed: 30,
        size: 64,
    },
    huge:{
        shipType: 'enemy-ship-huge',
        explosion: 'enemy-ship-huge--explosion',
        hp: 3,
        animationSpeed: 50,
        size: 128,
    }
};

export class Enemy{
    constructor({shipType, explosion, hp, animationSpeed, size}, container){
        this.animationInterval = null;
        this.animationSpeed = animationSpeed;
        this.element = null;
        this.explosion = explosion;
        this.gameContainer = container;
        this.hp = hp;
        this.posX = null;
        this.posY = null;
        this.shipSize = size;
        this.shipType = shipType;
        
        this.#setStartingPosition();
    }

    #setStartingPosition() {
        const randomPosition = this.#randomPositionX();

        this.posY = -(this.shipSize);
        this.posX = randomPosition;

        this.#init();
    }

    #randomPositionX() {
        const { innerWidth } = window;
        const randomPosition = Math.floor(Math.random() * (innerWidth - this.shipSize));
        return randomPosition;
    }

    #init() {
        this.element = document.createElement('div');
        this.element.classList.add(this.shipType);
        this.element.style.left = `${this.posX}px`;
        this.element.style.top = `${this.posY}px`;

        this.gameContainer.appendChild(this.element);
        this.#shipAnimationMove()
    }

    #shipAnimationMove() {
        this.animationInterval = setInterval(()=>{
            this.posY += NUMBER_OF_PIXELS_PER_MOVE;
            this.element.style.top = `${this.posY}px`;
        }, this.animationSpeed)
    }

    //delete ship if he's going out of map
    deleteEnemy() {
        this.#stopAnimationMove();
        this.#removeEnemyFromHtml();
    }

    shipExplosion() {
        this.element.classList.remove(this.shipType);
        this.element.classList.add(this.explosion);
        this.#stopAnimationMove();
        setTimeout(() => this.#removeEnemyFromHtml(), EXPLOSION_ANIMATION_TIMER)
    }

    #stopAnimationMove() {
        clearInterval(this.animationInterval);
    }

    #removeEnemyFromHtml() {
        this.element.remove();
    }
} 