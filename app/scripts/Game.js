import {PlayerShip} from './PlayerShip.js'

class Game{
    #playerShip;

    constructor() {
        this.#init();
    }

    #init() {
        this.#playerShip = new PlayerShip();
    }
}

export const game = new Game();