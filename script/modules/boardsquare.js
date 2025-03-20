import Position2D from "./position2d.js";

const SQUARE_CLASS_NAME = "board-square";
const SELECTED_HIGHLIGHT_CLASS_NAME = "board-square-selected-highlight";
const MOVE_HIGHLIGHT_CLASS_NAME = "board-square-move-highlight";
const TAKE_HIGHLIGHT_CLASS_NAME = "board-square-take-highlight";
const PLAYED_HIGHLIGHT_CLASS_NAME = "board-square-played-highlight";

const boardSquareTemplate = document.getElementById("board-square-template");

const highlightEnum = {
    selected: SELECTED_HIGHLIGHT_CLASS_NAME,
    move: MOVE_HIGHLIGHT_CLASS_NAME,
    take: TAKE_HIGHLIGHT_CLASS_NAME,
    played: PLAYED_HIGHLIGHT_CLASS_NAME,
}

function clearSquareHighlight() {
    const element = this.element;

    element.classList.remove(SELECTED_HIGHLIGHT_CLASS_NAME);
    element.classList.remove(MOVE_HIGHLIGHT_CLASS_NAME);
    element.classList.remove(TAKE_HIGHLIGHT_CLASS_NAME);
}

function highlightSquare(highlightType) {
    const element = this.element;

    if (!(Object.values(highlightEnum).includes(highlightType))) {
        console.error(`Unknown highlight type ${highlightType}`);
    }

    this.clearSquareHighlight();

    element.classList.add(highlightType);
}

const getSquareColor = (x, y) => {
    const isBlack = (x % 2 === 0);

    return ((y % 2 === 0) === isBlack) ? "black" : "white";
}

const createSquareElement = () => {
    const clone = boardSquareTemplate.content.cloneNode(true);
    return clone.querySelector(".board-square");
}

function BoardSquare(x, y) {
    const squareElement = createSquareElement();

    squareElement.dataset.squareColor = getSquareColor(x, y);
    squareElement.dataset.x = x;
    squareElement.dataset.y = y;

    this.element = squareElement;
    this.position2d = new Position2D(x, y);
    this.piece =  null;
    this.clearSquareHighlight = clearSquareHighlight;
    this.highlightSquare = highlightSquare;
}

export { BoardSquare, highlightEnum, };