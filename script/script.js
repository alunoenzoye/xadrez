import {board} from "./modules/board.js";
import Pawn from "./pieces/pawn.js";
import Bishop from "./pieces/bishop.js";
import Queen from "./pieces/queen.js";
import Knight from "./pieces/knight.js";
import Position2D from "./modules/position2d.js";
import Team from "./modules/team.js";
import position2d from "./modules/position2d.js";

const whiteTeam = new Team("white");
const blackTeam = new Team("black");

const createPieceInPosition = (Piece, position2d, team) => {
    const piece = new Piece(board, team);
    piece.moveToPosition(position2d);
}

const createSymmetrically = (Piece, offset, y, team) => {
    createPieceInPosition(Piece, new Position2D(0 + offset, y), team);
    createPieceInPosition(Piece, new Position2D(7 - offset, y), team);
}

const createPieces = () => {
    for (let y = 1; y <= 6; y+=5) {
        const team = (y === 1) ? whiteTeam : blackTeam;
        const secondRowY = (y === 1) ? 0 : 7;

        for (let x = 0; x < 8; x++) {
            createPieceInPosition(Pawn, new Position2D(x, y), team);
        }

        createSymmetrically(Bishop, 2, secondRowY, team);
        createSymmetrically(Knight, 1, secondRowY, team);
        createPieceInPosition(Queen, new Position2D(3, secondRowY), team);
    }
}

createPieces();