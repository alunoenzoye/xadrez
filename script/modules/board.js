import {BoardSquare, highlightEnum} from "./boardsquare.js";
import Position2D from "./position2d.js";
import King from "../pieces/king.js";
import Pawn from "../pieces/pawn.js";
import Bishop from "../pieces/bishop.js";
import Queen from "../pieces/queen.js";
import Knight from "../pieces/knight.js";
import Rook from "../pieces/rook.js";
import Team from "../modules/team.js";

let whiteTeam = new Team("white", null);
let blackTeam = new Team("black", null);

whiteTeam.opponent = blackTeam;
blackTeam.opponent = whiteTeam;

const HORIZONTAL_POSITION_CHARS = ["a", "b", "c", "d", "e", "f", "g", "h"];

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

function updateBoard() {
    console.time("updateBoard");
    this.currentTurn = (this.currentTurn === whiteTeam) ? blackTeam : whiteTeam;

    whiteTeam.updateAttackingMoves();
    blackTeam.updateAttackingMoves();

    whiteTeam.king.onGameUpdate();
    blackTeam.king.onGameUpdate();
    console.timeEnd("updateBoard");
}

async function onSquareSelected(square) {
    const selectedPiece = this._selectedPiece;
    const piece = square.piece;

    if (selectedPiece !== null) {
        // Avoid firing any logic if we just select the currently selected piece
        if (selectedPiece === piece) {
            this._removeSelection();

            return;
        }

        const oldSquare = selectedPiece.currentSquare;
        const moved = await selectedPiece.onSquareSelected(square);

        this._removeSelection()

        if (moved) {
            this._updateBoard();

            this.element.querySelectorAll(`.${highlightEnum.played}`).forEach((square) => {
                square.classList.remove(highlightEnum.played);
            })

            oldSquare.highlightSquare(highlightEnum.played);
            square.highlightSquare(highlightEnum.played);
        }


        return;
    }

    if (piece === null) {
        return;
    }

    if (piece.team !== this.currentTurn) {
        return;
    }

    // Prevent selecting another piece if we are in check.
    if (piece.team.king.check && piece.constructor.name !== "King") {
        return;
    }

    this._removeSelection();

    this._selectedPiece = piece;
    piece.onSelect();
    square.highlightSquare(highlightEnum.selected);
}

function createPieceInPosition(Piece, position2d, team) {
    const piece = new Piece(this, team);
    piece.moveToPosition(position2d);
}

function createSymmetrically(Piece, offset, y, team) {
    this.createPieceInPosition(Piece, new Position2D(0 + offset, y), team);
    this.createPieceInPosition(Piece, new Position2D(7 - offset, y), team);
}

function startGame() {
    this.currentTurn = whiteTeam;

    for (let y = 1; y <= 6; y+=5) {
        const team = (y === 1) ? whiteTeam : blackTeam;
        const secondRowY = (y === 1) ? 0 : 7;

        for (let x = 0; x < 8; x++) {
            this.createPieceInPosition(Pawn, new Position2D(x, y), team);
        }

        this._createSymmetrically(Bishop, 2, secondRowY, team);
        this._createSymmetrically(Knight, 1, secondRowY, team);
        this._createSymmetrically(Rook, 0, secondRowY, team);
        this.createPieceInPosition(Queen, new Position2D(3, secondRowY), team);
        this.createPieceInPosition(King, new Position2D(4, secondRowY), team);
    }
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
    this.currentTurn = null;
    this.element = element;
    this.getSquare = getSquare;
    this.startGame = startGame;
    this.createPieceInPosition = createPieceInPosition;
    this._updateBoard = updateBoard;
    this._createSymmetrically = createSymmetrically;
    this._clearHighlightedSquares = clearHighlightedSquares;
    this._removeSelection = removeSelection;
    this._onSquareSelected = onSquareSelected;
}

const board = new Board();

for (let y = 0; y < 8; y++) {
    // Creates the columns
    const column = []

    for (let x = 0; x < 8; x++) {
        const square = new BoardSquare(x, y);
        const squareElement = square.element;

        column[x] = square;
        board.element.appendChild(square.element);
    }

    board._squares[y] = column;
}

export default board;