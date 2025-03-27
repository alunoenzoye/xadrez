import board from "./modules/board.js";
import Position2D from "./modules/position2d.js";

board.startGame();

const pos1 = new Position2D(1, 1);
const pos2 = new Position2D(-2, -2);

const unit1 = pos1.unit();
const unit2 = pos2.unit();

console.log(unit1.equal(unit2));