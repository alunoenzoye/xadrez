import Position2D from "./position2d.js";

function moveToPosition(position2d) {
    const square = this._board.getSquare(position2d);

    if (square === null) {
        console.error(`There is no square at ${position2d.x}, ${position2d.y}`);
    }

    if (square.piece !== null) {
        console.error(`There is a piece occupying the square at ${position2d.x}, ${position2d.y}`);
    }

    this.position2d = new Position2D(position2d.x, position2d.y);
    square.element.appendChild(this.element);
    square.piece = this;
}

function take() {
    this.element?.remove();
    this.position2d = null;
}

function move(e) {
    const {clientX, clientY} = e;

    this.element.style.left = `${clientX}px`;
    this.element.style.top = `${clientY}px`;
}

function followCursor() {
    const element = this.element;
    element.style.position = "absolute";
    element.style.left = `50%`;
    element.style.top = `50%`;
    element.style.transform = "translate(-50%, -50%)";

    document.addEventListener("mousemove", (e) => {
        this._move(e);
    });
}

function unfollowCursor() {
    const element = this.element;
    element.style.position = "static";
    element.style.transform = "";
    document.removeEventListener('mousedown', this._move);
}

function BasePiece(board, team) {
    this._board = board;
    this.team = team;
    this.element = null;
    this.position2d = null;
    this.moveToPosition = moveToPosition;
    this.followCursor = followCursor;
    this.unfollowCursor = unfollowCursor;
    this.take = take;
    this._move = move;
}

export default BasePiece;