export class GameState {
  #playerLifes = 3;
  #score = 0;
  #timeToRenderNewEnemy = 1000;
  #numberOfTimeToDecrease = 50;
  #requiredScoreToIncreaseDifficulty = 50;

  get playerLifes() {
    return this.#playerLifes;
  }

  decreasePlayerLifes() {
    this.#playerLifes--;
  }

  get score() {
    return this.#score;
  }

  increaseScore(score) {
    this.#score += score;
  }

  get timeToRenderNewEnemy() {
    return this.#timeToRenderNewEnemy;
  }

  decreaseTimeToRenderEnemy() {
    this.#requiredScoreToIncreaseDifficulty += this.#score;
    this.#timeToRenderNewEnemy -= this.#numberOfTimeToDecrease;
  }

  get requiredScoreToIncreaseDifficulty() {
    return this.#requiredScoreToIncreaseDifficulty;
  }
}
