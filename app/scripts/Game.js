import {PlayerShip} from './PlayerShip.js'
import {BindToHtml} from './BindToHtml.js'
import {MISSILE_HEIGHT} from './Missile.js'

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
        this.#playerShip.missiles.forEach((missile, id, missilesArray) =>{
            const positionToDeleteMissile = - (MISSILE_HEIGHT);

            if(missile.posY < positionToDeleteMissile){
                missile.deleteMissile();
                missilesArray.slice(id, 1);
            }
        })
    }
}

export const game = new Game();