import BasePiece from "../modules/basepiece.js";
import Position2D from "../modules/position2d.js";
import Move from "../modules/move.js";
import {highlightEnum} from "../modules/boardsquare.js";

const SEARCH_DIRECTIONS = [
    new Position2D(1, 1),
    new Position2D(-1, 1),
    new Position2D(1, -1),
    new Position2D(-1, -1),
    new Position2D(0, -1),
    new Position2D(0, 1),
    new Position2D(1, 0),
    new Position2D(-1, 0),
]

function onSelect() {
    this.followCursor();

    const possibleMoves = this.getPossibleMoves();

    this.highlightPossibleMoves(possibleMoves);
}

function onUnselect() {
    this.unfollowCursor();
}

function onSquareSelected(square) {
    const possibleMoves = this.getPossibleMoves();
    const squarePosition2D = square.position2d;
    const piece = square.piece;
    const correspondingMove = this.getCorrespondingMove(square.position2d, possibleMoves);

    if (correspondingMove === null) {
        return false;
    }

    if (!correspondingMove.canTake && piece !== null) {
        return false;
    } else if (correspondingMove.canTake && piece !== null) {
        if (!this.canTakePiece(piece)) {
            return;
        }

    piece.take();
    }

    this.removeAbsolutePin();
    this.moveToPosition(squarePosition2D);

    return true;
}

function createImageFromTeam(team) {
    const img = document.createElement("img");
    img.classList.add("piece");

    const prefix = (team === "white") ? "w" : "b";
    img.src = `/assets/pieces/01_classic/${prefix}-queen.png`;

    return img;
}

function getPossibleMoves() {
    const board = this._board;
    const currentPosition2D = this.position2d;
    const direction = this._direction;

    if (currentPosition2D === null) {
        console.error("Piece isn't on the board.")
    }

    let moves = [];

    for (let i = 0; i < SEARCH_DIRECTIONS.length; i++) {
        const searchDirection = SEARCH_DIRECTIONS[i];
        let blockingPiece = null;
        let currentSquare = board.getSquare(currentPosition2D.add(searchDirection));
        while (currentSquare !== null) {
            if (currentSquare.piece !== null) {
                blockingPiece = currentSquare.piece;
                break;
            }

            const piece = currentSquare.piece;

            if (piece.constructor.name !== "King") {
                this.absolutePinPiece(piece);
            }

            if (blockingPiece !== null) {
                continue;
            }

            moves.push(new Move(
                currentSquare.position2d,
                true
            ));

            currentSquare = board.getSquare(currentSquare.position2d.add(searchDirection));
        }
    }

  return moves;
}

function Queen(board, team) {
    const teamName = team.name;

    BasePiece.call(this, board, team);

    this.absolutePinnedPiece = null;
    this.onSelect = onSelect;
    this.onUnselect = onUnselect;
    this.onSquareSelected = onSquareSelected;
    this.element = createImageFromTeam(teamName);
    this.getPossibleMoves = getPossibleMoves;
}

export default Queen;