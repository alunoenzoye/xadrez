import BasePiece from "../modules/basepiece.js";
import Position2D from "../modules/position2d.js";
import Move from "../modules/move.js";
import {highlightEnum} from "../modules/boardsquare.js";

const MOVE_OFFSETS = [
    new Position2D(1, -2),
    new Position2D(-1, -2),
    new Position2D(1, 2),
    new Position2D(-1, 2),
    new Position2D(2, 1),
    new Position2D(2, -1),
    new Position2D(-2, 1),
    new Position2D(-2, -1),
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
            return false;
        }

        piece.take();
    }

    this.moveToPosition(squarePosition2D);
    this._firstMove = false;

    return true;
}

function createImageFromTeam(team) {
    const img = document.createElement("img");
    img.classList.add("piece");

    const prefix = (team === "white") ? "w" : "b";
    img.src = `/assets/pieces/01_classic/${prefix}-knight.png`;

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

    for (let i = 0; i < MOVE_OFFSETS.length; i++) {
        const moveOffset = MOVE_OFFSETS[i];
        const movePosition = currentPosition2D.add(moveOffset);
        const currentSquare = board.getSquare(movePosition);

        if (!this.isPositionAbsolutePinValid(movePosition)) {
            continue;
        }

        if (currentSquare === null) {
            continue;
        }

        moves.push(new Move(
            movePosition,
            true,
            null,
            this,
        ));
    }

    return moves;
}

function Knight(board, team) {
    const teamName = team.name;

    BasePiece.call(this, board, team);

    this.onSelect = onSelect;
    this.onUnselect = onUnselect;
    this.onSquareSelected = onSquareSelected;
    this.element = createImageFromTeam(teamName);
    this.getPossibleMoves = getPossibleMoves;
}

export default Knight;