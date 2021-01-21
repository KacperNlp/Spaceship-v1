import {PlayerShip} from './PlayerShip.js'
import {BindToHtml} from './BindToHtml.js'

const GAME_CONTAINER_ID = 'game-container';

class Game extends BindToHtml{
    #playerShip;

    constructor() {
        super();
        this.container = this.bindById(GAME_CONTAINER_ID);
        this.#init();
    }

    #init() {
        this.#playerShip = new PlayerShip(this.container);
        this.#newGame();
    }

    #newGame = () =>{
        this.#checkPositions();

        window.requestAnimationFrame(this.#newGame)
    }

    #checkPositions(){
        this.#checkMissilesPositions();
    }

    #checkMissilesPositions(){
        this.#playerShip.m
    }
}

export const game = new Game();