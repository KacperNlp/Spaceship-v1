import {PlayerShip} from './PlayerShip.js';
import {BindToHtml} from './BindToHtml.js';
import {MISSILE_HEIGHT, MISSILE_WIDTH} from './Missile.js';
import {Enemy, TYPES_OF_ENEMIES, PROPORTION_TO_GET_SHIP_TYPE} from './Enemy.js';

const GAME_CONTAINER_ID = 'game-container';
const TIME_TO_GENERATE_NEW_ENEMY = 10000;

class Game extends BindToHtml{
    #playerShip;

    constructor() {
        super();
        this.container = this.bindById(GAME_CONTAINER_ID);
        this.intervalToCreateEnemy = null;
        this.enemies = [];
        this.#init();
    }

    #init() {
        this.#playerShip = new PlayerShip(this.container);
        this.#newGame();
        this.#enemiesGenerator();
    }

    #newGame = () =>{
        this.#checkPositions();

        window.requestAnimationFrame(this.#newGame)
    }

    #enemiesGenerator() {
        this.intervalToCreateEnemy = setInterval(this.#createNewEnemy, TIME_TO_GENERATE_NEW_ENEMY)
    }

    #checkPositions(){
        this.#checkEnemiesPositions();
    }

    #checkEnemiesPositions() {
        this.enemies.forEach((enemy, id, enemiesArray) =>{
            const { innerHeight } = window;
            const positionToDeleteEnemyShip = innerHeight + enemy.shipSize;
            const positions = {
                bottomLeft: enemy.posX,
                bottomRight: enemy.posX + enemy.shipSize,
            }

            if(enemy.posY > positionToDeleteEnemyShip){
                enemy.deleteEnemy();
                enemiesArray.slice(id, 1);
            }

            this.#checkMissilesPositions(enemy, positions, id);
        })
    }

    #checkMissilesPositions(enemy, positions, enemyId){
        this.#playerShip.missiles.forEach((missile, id, missilesArray) =>{
            const positionToDeleteMissile = - (MISSILE_HEIGHT);
            const missilePosition = {
                topLeft: missile.posX,
                topRight: missile.posX + MISSILE_WIDTH,
            }

            if(positions.bottomLeft <= missilePosition.topRight && positions.bottomRight >= missilePosition.topLeft && enemy.posY <= missile.posY && missile.posY <= enemy.posY + enemy.shipSize) {
                enemy.shipExplosion();
                this.enemies.slice(enemyId, 1);
                missile.deleteMissile();
                missilesArray.slice(id, 1);
            }

            if(missile.posY < positionToDeleteMissile) {
                missile.deleteMissile();
                missilesArray.slice(id, 1);
            }
        })
    }



    #createNewEnemy = () => {
        const type = this.#takeType();
        const enemy = new Enemy(type, this.container);
        this.enemies.push(enemy);
    }

    #stopGenerateEnemies() {
        clearInterval(this.intervalToCreateEnemy);
    }

    #takeType() {
        const randomShip = Math.floor(Math.random() * PROPORTION_TO_GET_SHIP_TYPE + 1);
        let type;

        if(randomShip % PROPORTION_TO_GET_SHIP_TYPE){
            type = TYPES_OF_ENEMIES.small;
        }else{
            type = TYPES_OF_ENEMIES.huge;
        }

        return type;
    }

}

export const game = new Game();