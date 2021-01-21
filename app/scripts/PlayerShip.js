import {BindToHtml} from './BindToHtml.js';

const SHIP_ANIMATION_SPEED = 10;
const SHIP_DISTANCE_FROM_THE_BOTTOM = 20;
const SHIP_ID = 'spaceship';
const SHIP_SIZE = 64;

export class PlayerShip extends BindToHtml{
    constructor() {
        super();
        this.ship = this.bindById(SHIP_ID);
        this.typesOfMoves = {
            left:false,
            right:false,
        }
        this.#init();
    }

    #init() {
        this.#startingPositionOfShip();
        this.#addEventListeners();
        this.#shipAnimationByEvent();
    }

    #startingPositionOfShip() {
        const {innerWidth} = window;

        this.ship.style.bottom = `${SHIP_DISTANCE_FROM_THE_BOTTOM}px`;
        this.ship.style.left = `${(innerWidth - SHIP_SIZE)/2}px`;
    }

    #addEventListeners() {
        this.#startMove();
        this.#stopMove();
    }

    #shipAnimationByEvent = () => {
        const {left, right} = this.typesOfMoves;
        const currentPositionOfShip = this.#currentPositionOfShip();
        const {innerWidth} = window;

        if(left && currentPositionOfShip > 0){
            this.ship.style.left = `${this.#currentPositionOfShip() - SHIP_ANIMATION_SPEED}px`;
        }else if(right && currentPositionOfShip < innerWidth - SHIP_SIZE){
            this.ship.style.left = `${this.#currentPositionOfShip() + SHIP_ANIMATION_SPEED}px`;
        }

        window.requestAnimationFrame(this.#shipAnimationByEvent)
    }

    #currentPositionOfShip() {
        return this.ship.offsetLeft;
    }

    //handle moves
    #startMove() {
        window.addEventListener('keydown', ({keyCode}) => {
            switch(keyCode) {
                case(37):
                   this.typesOfMoves.left = true;
                break;

                case(39):
                   this.typesOfMoves.right = true;
                break;
            }
        })
    }

    #stopMove() {
        window.addEventListener('keyup', ({keyCode}) => {
            switch(keyCode) {
                case(37):
                   this.typesOfMoves.left = false;
                break;

                case(39):
                   this.typesOfMoves.right = false;
                break;
            }
        })
    }
}
