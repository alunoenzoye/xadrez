import Position2D from "./position2d.js";
import {highlightEnum} from "./boardsquare.js";

function moveToPosition(position2d) {
    const square = this._board.getSquare(position2d);

    if (square === null) {
        console.error(`There is no square at ${position2d.x}, ${position2d.y}`);
    }

    if (square.piece !== null) {
        console.error(`There is a piece occupying the square at ${position2d.x}, ${position2d.y}`);
    }

    this._removeFromCurrentSquare()

    this.currentSquare = square;
    this.position2d = new Position2D(position2d.x, position2d.y);
    square.element.appendChild(this.element);
    square.piece = this;
}

function take() {
    this._removeFromCurrentSquare()
    this.team.onPieceTaken(this);
    this.element.remove();
    this.position2d = null;
    this._board.movesTilDraw = 0;
}

function canTakePiece(piece) {
    return (piece.team !== this.team);
}

function move(e) {
    const {clientX, clientY} = e;

    this.element.style.left = `${clientX}px`;
    this.element.style.top = `${clientY}px`;
}

function followCursor() {
    const element = this.element;
    element.style.position = "absolute";
    element.style.transform = "translate(-50%, -50%)";

    const onMove = (e) => {
        this._move(e);
    }

    document.addEventListener("mousemove", onMove);
    this._currentListener = onMove;
}

function unfollowCursor() {
    const element = this.element;
    element.style.position = "static";
    element.style.transform = "";

    document.removeEventListener('mousemove', this._currentListener);
}

function getCorrespondingMove(position2d, moves) {
    let correspondingMove = null;

    for (let i = 0; i < moves.length; i++) {
        const Move = moves[i];

        if (Move.position2d.equal(position2d)) {
            correspondingMove = Move;

            break
        }
    }

    return correspondingMove;
}

function highlightPossibleMoves(possibleMoves) {
    for (let i = 0; i < possibleMoves.length; i++) {
        const move = possibleMoves[i];
        const square = this._board.getSquare(move.position2d);

        if (square === null) {
            continue;
        }

        const piece = square.piece;

        if (piece !== null) {
            continue;
        }

        square.highlightSquare(highlightEnum.move);
    }
}

function removeFromCurrentSquare() {
    if (this.currentSquare !== null) {
        this.currentSquare.piece = null;
    }

    this.currentSquare = null;
}

function addAbsolutePinDirection(position2d) {
    const formattedDirection = position2d.unit().abs();

    this._absolutePinDirections.push(formattedDirection);
}

function isPositionAbsolutePinValid(position2d) {
    const positionUnit = (position2d.sub(this.position2d)).unit().abs();

    let isValid = true
    
    for (const direction of this._absolutePinDirections) {
        if (!positionUnit.equal(direction)) {
            console.log("whyyyy");
            isValid = false;

            break;
        }
    }

    return isValid;
}

function clearAbsolutePins() {
    this._absolutePinDirections = [];
}

function cleanup() {
    this._removeFromCurrentSquare();
    this.unfollowCursor();
}

function BasePiece(board, team) {
    team.alivePieces.push(this);

    this._board = board;
    this.team = team;
    this.element = null;
    this.position2d = null;
    this.moveToPosition = moveToPosition;
    this.followCursor = followCursor;
    this.unfollowCursor = unfollowCursor;
    this.take = take;
    this.canTakePiece = canTakePiece;
    this.getCorrespondingMove = getCorrespondingMove;
    this.currentSquare = null;
    this.highlightPossibleMoves = highlightPossibleMoves;
    this.addAbsolutePinDirection = addAbsolutePinDirection;
    this.isPositionAbsolutePinValid = isPositionAbsolutePinValid;
    this.clearAbsolutePins = clearAbsolutePins;
    this._absolutePinDirections = [];
    this._removeFromCurrentSquare = removeFromCurrentSquare;
    this._currentListener = null;
    this.cleanup = cleanup;
    this._move = move;
}

export default BasePiece;