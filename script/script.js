import {board} from "./modules/board.js";
import Pawn from "./pieces/pawn.js";
import Position2D from "./modules/position2d.js";

for (let x = 0; x < 8; x++) {
    const basePiece = new Pawn(board, "white");
    const position = new Position2D(x, 0);

    basePiece.moveToPosition(position);
}