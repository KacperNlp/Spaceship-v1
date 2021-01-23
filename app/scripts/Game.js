import { PlayerShip } from "./PlayerShip.js";
import { BindToHtml } from "./BindToHtml.js";
import { MISSILE_HEIGHT, MISSILE_WIDTH } from "./Missile.js";
import {
  Enemy,
  TYPES_OF_ENEMIES,
  PROPORTION_TO_GET_SHIP_TYPE,
} from "./Enemy.js";
import { GameState } from "./GameState.js";

const CLASS_FOR_SCREEN_WHEN_PLAYER_LOST_LIFE = "hit";
const CLASS_TO_HIDDEN_LAYER = "hidden";
const CONTAINER_FOR_SCORE_AT_END_OF_GAME = "score-at-end-of-game";
const GAME_CONTAINER_ID = "game-container";
const MODAL_LAYER_ID = "modal";
const NEW_GAME_BUTTON_ID = "button-new-game";
const PLAYER_LIFES_CONTAINER_ID = "lives";
const PLAYER_SCORE_CONTAINER_ID = "score";
const TIME_FOR_BACKGROUND_OF_LOST_LIFE = 500;

class Game extends BindToHtml {
  #playerShip;
  #gameState;

  constructor() {
    super();
    this.container = this.bindById(GAME_CONTAINER_ID);
    this.enemies = [];
    this.intervalToCreateEnemy = null;
    this.lifesContainer = this.bindById(PLAYER_LIFES_CONTAINER_ID);
    this.scoreContainer = this.bindById(PLAYER_SCORE_CONTAINER_ID);

    this.#init();
  }

  #init() {
    this.#playerShip = new PlayerShip(this.container);
    this.#gameState = new GameState();
    this.#newGame();
    this.#enemiesGenerator();
  }

  #newGame = () => {
    this.#checkPositions();
    this.#updatePlayerStats();
    window.requestAnimationFrame(this.#newGame);
  };

  #enemiesGenerator() {
    const timeToRender = this.#gameState.timeToRenderNewEnemy;
    console.log(timeToRender);

    this.intervalToCreateEnemy = setInterval(
      this.#createNewEnemy,
      timeToRender
    );
  }

  #checkPositions = () => {
    this.#checkEnemiesPositions();
  };

  #checkEnemiesPositions() {
    this.enemies.forEach((enemy, id, enemiesArray) => {
      const { innerHeight } = window;
      const positionToDeleteEnemyShip = innerHeight + enemy.shipSize;
      const { element } = enemy;
      const positions = {
        top: element.offsetTop,
        bottom: element.offsetTop + enemy.shipSize,
        left: element.offsetLeft,
        right: element.offsetLeft + enemy.shipSize,
      };

      //if enemy is outsite the map
      if (enemy.posY > positionToDeleteEnemyShip) {
        enemy.deleteEnemy();
        enemiesArray.splice(id, 1);
        this.#playerLostLife();
      }

      this.#checkMissilesPositions(enemy, positions, id);
    });
  }

  #checkMissilesPositions(enemy, positions, enemyId) {
    this.#playerShip.missiles.forEach((missile, id, missilesArray) => {
      const positionToDeleteMissile = -MISSILE_HEIGHT;
      const { element } = missile;
      const missilePosition = {
        top: element.offsetTop,
        bottom: element.offsetTop + MISSILE_HEIGHT,
        left: element.offsetLeft,
        right: element.offsetLeft + MISSILE_WIDTH,
      };

      const { top, left, bottom, right } = missilePosition;

      if (
        left <= positions.right &&
        right >= positions.left &&
        bottom <= positions.bottom &&
        top >= positions.top
      ) {
        enemy.hp--;

        if (!enemy.hp) {
          enemy.shipExplosion();
          this.enemies.splice(enemyId, 1);
          this.#increasePlayerScore(enemy.shipType);
        }
        missile.deleteMissile();
        missilesArray.splice(id, 1);
      }

      //if missile is outsite the map
      if (missile.posY < positionToDeleteMissile) {
        missile.deleteMissile();
        missilesArray.splice(id, 1);
      }
    });
  }

  #createNewEnemy = () => {
    const type = this.#takeTypeOfEnemy();
    const enemy = new Enemy(type, this.container);
    this.enemies.push(enemy);
  };

  #stopGenerateEnemies() {
    clearInterval(this.intervalToCreateEnemy);
  }

  #takeTypeOfEnemy() {
    const randomShip = Math.floor(
      Math.random() * PROPORTION_TO_GET_SHIP_TYPE + 1
    );
    let type;

    if (randomShip % PROPORTION_TO_GET_SHIP_TYPE) {
      type = TYPES_OF_ENEMIES.small;
    } else {
      type = TYPES_OF_ENEMIES.huge;
    }

    return type;
  }

  #playerLostLife() {
    this.#gameState.decreasePlayerLifes();
    this.#changeScreenBackground();

    if (!this.#gameState.playerLifes) {
      this.#endOfGame();
    }
  }

  #increasePlayerScore(enemyType) {
    const { huge } = TYPES_OF_ENEMIES;
    let score;

    if (enemyType === huge.shipType) {
      score = 3;
    } else {
      score = 1;
    }

    this.#increaseGameDifficulty();
    this.#gameState.increaseScore(score);
  }

  #updatePlayerStats() {
    this.scoreContainer.textContent = this.#gameState.score;
    this.lifesContainer.textContent = this.#gameState.playerLifes;
  }
  #changeScreenBackground() {
    this.container.classList.add(CLASS_FOR_SCREEN_WHEN_PLAYER_LOST_LIFE);
    setTimeout(() => {
      this.container.classList.remove(CLASS_FOR_SCREEN_WHEN_PLAYER_LOST_LIFE);
    }, TIME_FOR_BACKGROUND_OF_LOST_LIFE);
  }

  #increaseGameDifficulty() {
    const score = this.#gameState.score;
    const requiredScore = this.#gameState.requiredScoreToIncreaseDifficulty;
    const time = this.#gameState.timeToRenderNewEnemy;

    if (score > requiredScore && time > 400) {
      this.#stopGenerateEnemies();
      this.#gameState.decreaseTimeToRenderEnemy();
      this.#enemiesGenerator();
    }
  }

  #endOfGame() {
    this.#clearArraysOfMissilesAndEnemies();
    this.#stopGenerateEnemies();
    this.#handleOfModalLayer();
  }

  #clearArraysOfMissilesAndEnemies() {
    this.enemies.forEach((enemy) => enemy.shipExplosion());
    this.#playerShip.missiles.forEach((missile) => missile.deleteMissile());
    this.enemies.length = 0;
    this.#playerShip.missiles.length = 0;
  }

  #handleOfModalLayer() {
    const modalLayer = this.bindById(MODAL_LAYER_ID);
    const scoreContainer = this.bindById(CONTAINER_FOR_SCORE_AT_END_OF_GAME);
    const button = this.bindById(NEW_GAME_BUTTON_ID);

    modalLayer.classList.remove(CLASS_TO_HIDDEN_LAYER);
    scoreContainer.textContent = this.#gameState.score;

    button.addEventListener("click", () => {
      modalLayer.classList.add(CLASS_TO_HIDDEN_LAYER);
      this.#init();
    });
  }
}

export const game = new Game();
