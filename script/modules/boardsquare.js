import Position2D from "./position2d.js";

const SQUARE_CLASS_NAME = "board-square";
const SELECTED_HIGHLIGHT_CLASS_NAME = "board-square-selected-highlight";
const MOVE_HIGHLIGHT_CLASS_NAME = "board-square-move-highlight";
const TAKE_HIGHLIGHT_CLASS_NAME = "board-square-take-highlight";

const boardSquareTemplate = document.getElementById("board-square-template");

const highlightEnum = {
    selected: SELECTED_HIGHLIGHT_CLASS_NAME,
    move: MOVE_HIGHLIGHT_CLASS_NAME,
    take: TAKE_HIGHLIGHT_CLASS_NAME,
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
    element.classList.add(SELECTED_HIGHLIGHT_CLASS_NAME);
}

const getSquareColor = (x, y) => {
    const isWhite = (x % 2 === 0);

    return ((y % 2 === 0) === isWhite) ? "white" : "black";
}

const createSquareElement = () => {
    const clone = boardSquareTemplate.content.cloneNode(true);
    return clone.querySelector(".board-square");
}

function BoardSquare(x, y) {
    const squareElement = createSquareElement();

    squareElement.dataset.squareColor = getSquareColor(x, y);
    squareElement.dataset.x = y;
    squareElement.dataset.y = x;

    this.element = squareElement;
    this.piece =  null;
    this.clearSquareHighlight = clearSquareHighlight;
    this.highlightSquare = highlightSquare;
}

export { BoardSquare, highlightEnum, };