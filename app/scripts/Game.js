import {PlayerShip} from './PlayerShip.js';
import {BindToHtml} from './BindToHtml.js';
import {MISSILE_HEIGHT, MISSILE_WIDTH} from './Missile.js';
import {Enemy, TYPES_OF_ENEMIES, PROPORTION_TO_GET_SHIP_TYPE} from './Enemy.js';

const GAME_CONTAINER_ID = 'game-container';
const TIME_TO_GENERATE_NEW_ENEMY = 800;

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

    #checkPositions = () => {
        this.#checkEnemiesPositions();
    }

    #checkEnemiesPositions() {
        this.enemies.forEach((enemy, id, enemiesArray) =>{
            const { innerHeight } = window;
            const positionToDeleteEnemyShip = innerHeight + enemy.shipSize;
            const {element} = enemy;
            const positions = {
                top:element.offsetTop,
                bottom:element.offsetTop + enemy.shipSize,
                left:element.offsetLeft,
                right:element.offsetLeft + enemy.shipSize,
            }

            if(enemy.posY > positionToDeleteEnemyShip){
                enemy.deleteEnemy();
                enemiesArray.splice(id, 1);
            }

            this.#checkMissilesPositions(enemy, positions, id);
        })
    }

    #checkMissilesPositions(enemy, positions, enemyId){
        this.#playerShip.missiles.forEach((missile, id, missilesArray) => {
            const positionToDeleteMissile = - (MISSILE_HEIGHT);
            const {element} = missile;
            const missilePosition = {
                top:element.offsetTop,
                bottom:element.offsetTop + MISSILE_HEIGHT,
                left:element.offsetLeft,
                right:element.offsetLeft + MISSILE_WIDTH,
            }

            const {top, left, bottom, right} = missilePosition;
            
            if(left <= positions.right && right >= positions.left && bottom <= positions.bottom && top >= positions.top) {
                enemy.hp--;

                if(!enemy.hp){
                    enemy.shipExplosion();
                    this.enemies.splice(enemyId, 1);
                }
                missile.deleteMissile();
                missilesArray.splice(id, 1);
            }

            if(missile.posY < positionToDeleteMissile) {
                missile.deleteMissile();
                missilesArray.splice(id, 1);
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