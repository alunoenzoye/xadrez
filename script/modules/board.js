import {BoardSquare, highlightEnum} from "./boardsquare.js";
import Position2D from "./position2d.js";

function getSquare(position2d) {
    const x = position2d.x;
    const y = position2d.y;

    const column = this._squares[y]

    if (column === undefined) {
        return null
    }

    const square = column[x];

    return (square === undefined) ? null : square;
}

function clearHighlightedSquares() {
    const selectHighlight = highlightEnum.selected;
    const moveHighlight = highlightEnum.move;
    const takeHighlight = highlightEnum.take;

    const highlightedSquares = board.element.querySelectorAll(`.${selectHighlight}, .${moveHighlight}, .${takeHighlight}`);

    highlightedSquares.forEach((square) => {
        square.classList.remove(selectHighlight);
        square.classList.remove(moveHighlight);
        square.classList.remove(takeHighlight);
    })
}

function removeSelection() {
    if (this._selectedPiece !== null) {
        this._selectedPiece.onUnselect();
    }

    this._selectedPiece = null;
    this._clearHighlightedSquares();
}

function onSquareSelected(square) {
    const selectedPiece = this._selectedPiece;
    const piece = square.piece;

    if (selectedPiece !== null) {
        // Avoid firing any logic if we just select the currently selected piece
        if (selectedPiece === piece) {
            this._removeSelection();

            return;
        }

        selectedPiece.onSquareSelected(square);

        this._removeSelection()

        return;
    }

    // If we are selecting a new piece without having a selected piece
    if (piece === null) {
        return;
    }

    this._removeSelection();

    this._selectedPiece = piece;
    piece.onSelect();
    square.highlightSquare(highlightEnum.selected);
}

function Board() {
    const element = document.getElementById("board");

    element.addEventListener("click", (e) => {
        const target = event.target;

        const x = target.dataset.x;
        const y = target.dataset.y;

        const square = this.getSquare(new Position2D(x, y));

        if (square === null) {
            return;
        }

        this._onSquareSelected(square);
    });

    this._squares = [];
    this._selectedPiece = null;
    this.element = element;
    this.getSquare = getSquare;
    this._clearHighlightedSquares = clearHighlightedSquares;
    this._removeSelection = removeSelection;
    this._onSquareSelected = onSquareSelected;
}

const board = new Board();

for (let x = 0; x < 8; x++) {
    // Creates the columns
    const column = []

    for (let y = 0; y < 8; y++) {
        const square = new BoardSquare(y, x);

        column[y] = square;
        board.element.appendChild(square.element);
    }

    board._squares[x] = column;
}

export {board, highlightEnum};