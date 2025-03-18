import BasePiece from "../modules/basepiece.js";
import Position2D from "../modules/position2d.js";
import Move from "../modules/move.js";
import {highlightEnum} from "../modules/boardsquare.js";

function onSelect() {
    this.followCursor();

    const possibleMoves = this._getPossibleMoves();

    this.highlightPossibleMoves(possibleMoves);
}

function onUnselect() {
    this.unfollowCursor();
}

function onSquareSelected(square) {
    const possibleMoves = this._getPossibleMoves();
    const squarePosition2D = square.position2d;
    const piece = square.piece;
    const correspondingMove = this.getCorrespondingMove(square.position2d, possibleMoves);

    if (correspondingMove === null) {
        return;
    }

    if (!correspondingMove.canTake && piece !== null) {
        return;
    } else if (correspondingMove.canTake && piece !== null) {
        if (!this.canTakePiece(piece)) {
            return;
        }

        piece.take();
    }

    this.moveToPosition(squarePosition2D);
    this._firstMove = false;
}

function createImageFromTeam(team) {
    const img = document.createElement("img");
    img.classList.add("piece");

    const prefix = (team === "white") ? "w" : "b";
    img.src = `/assets/pieces/01_classic/${prefix}-pawn.png`;

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
    let forwardLength = (this._firstMove) ? 2 : 1;

    for (let i = 1; i <= forwardLength; i++) {
        const position2d = currentPosition2D.add(direction.mult(new Position2D(0, i)));
        const square = board.getSquare(position2d);

        if (square === null) {
            continue;
        }

        if (square.piece !== null) {
            break
        }

        moves.push(new Move(
            currentPosition2D.add(direction.mult(new Position2D(0, i))),
            false
        ))
    }

    const leftSquare = board.getSquare(currentPosition2D.add(direction.add(new Position2D(1, 0))));
    const rightSquare = board.getSquare(currentPosition2D.add(direction.add(new Position2D(-1, 0))));

    if (leftSquare !== null) {
        if (leftSquare.piece !== null) {
            moves.push(new Move(
                leftSquare.position2d,
                true
            ))
        }
    }

    if (rightSquare !== null) {
        if (rightSquare.piece !== null) {
            moves.push(new Move(
                rightSquare.position2d,
                true
            ))
        }
    }

    return moves;
}

function onGameUpdate() {

}

function Pawn(board, team) {
    const teamName = team.name;
    const direction = teamName === "white" ? new Position2D(0, 1) : new Position2D(0, -1);

    BasePiece.call(this, board, team);

    this._firstMove = true;
    this._direction = direction;
    this.onSelect = onSelect;
    this.onUnselect = onUnselect;
    this.onSquareSelected = onSquareSelected;
    this.element = createImageFromTeam(teamName);
    this._getPossibleMoves = getPossibleMoves;
}

export default Pawn;