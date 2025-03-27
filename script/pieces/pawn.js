import Queen from "./Queen.js";
import Knight from "./Knight.js";
import Rook from "./Rook.js";
import Bishop from "./Bishop.js";
import BasePiece from "../modules/basepiece.js";
import Position2D from "../modules/position2d.js";
import Move from "../modules/move.js";

const PROMOTION_PIECES = [
    {
        name: "rook",
        constructor: Rook,
    },
    {
        name: "bishop",
        constructor: Bishop,
    },
    {
        name: "knight",
        constructor: Knight,
    },
    {
        name: "queen",
        constructor: Queen,
    },
]
const promoteDialogElement = document.getElementById("pawn-promote-dialog");

function onSelect() {
    this.followCursor();

    const possibleMoves = this.getPossibleMoves();

    this.highlightPossibleMoves(possibleMoves);
}

function onUnselect() {
    this.unfollowCursor();
}

async function promoteDialog() {
    return new Promise((resolve, reject) => {
        const images = promoteDialogElement.querySelectorAll(".pawn-promote-piece")
        const prefix = (this.team.name === "white") ? "w" : "b";
        promoteDialogElement.classList.add("pawn-promote-dialog-active");

        for (let i = 0; i < images.length; i++) {
            const image = images[i];
            const correspondingPiece = PROMOTION_PIECES[i];
            image.src = `/assets/pieces/01_classic/${prefix}-${correspondingPiece.name}.png`;
            image.dataset.piece = correspondingPiece.name;
        }

        function listener(e) {
            const target = e.target;

            if (target === null) {
                return;
            }

            resolve(target.dataset.piece);

            promoteDialogElement.classList.remove("pawn-promote-dialog-active");
            promoteDialogElement.removeEventListener("click", this);
        }

        promoteDialogElement.addEventListener("click", listener)
    })
}

async function onSquareSelected(square) {
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

    if (correspondingMove.customFunctionality !== null) {
        correspondingMove.customFunctionality();
    }

    this._board.movesTilDraw = 0;
    this.moveToPosition(squarePosition2D);
    this.moveCount++;

    if (this.position2d.y === this._promotionHeight) {
        this.unfollowCursor();

        const team = this.team;
        const selectedPiece = await this._promoteDialog();
        const currentPosition = this.position2d;

        this.take();

        let Constructor = null;

        for (let i = 0; PROMOTION_PIECES.length > 0; i++) {
            const piece = PROMOTION_PIECES[i];

            if (piece.name === selectedPiece) {
                Constructor = piece.constructor;
                break;
            }
        }

        this._board.createPieceInPosition(Constructor, currentPosition, this.team);
    }

    return true;
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
    const team = this.team;
    const lastMovedPiece = board.lastMovedPiece;
    const currentPosition2D = this.position2d;
    const direction = this._direction;

    if (currentPosition2D === null) {
        console.error("Piece isn't on the board.")
    }

    let moves = [];
    let forwardLength = (this.moveCount === 0) ? 2 : 1;

    if (lastMovedPiece !== null && !this._didEnPassant) {
        const opponentPiecePosition = lastMovedPiece.position2d;
        const isPieceOpponent = (this.team !== lastMovedPiece.team);
        const isPawn = (lastMovedPiece.constructor.name === "Pawn");
        const isOnSecondSquare = (lastMovedPiece.didTwoSquareMove);
        const isAdjacent = (Math.abs(currentPosition2D.x - opponentPiecePosition.x) === 1 && currentPosition2D.y === opponentPiecePosition.y);
        const isPawnFirstMove = (lastMovedPiece.moveCount === 1);

        if (isPawn && isOnSecondSquare && isAdjacent && isPawnFirstMove && isPieceOpponent) {
            const movePosition = new Position2D(opponentPiecePosition.x, this.position2d.y + this._direction.y);

            if (this.isPositionAbsolutePinValid(movePosition)) {
                moves.push(new Move(
                    movePosition,
                    true,
                    () => {
                        lastMovedPiece.take();
                    },
                    this,
                ))
            }
        }
    }

    for (let i = 1; i <= forwardLength; i++) {
        // Can't move the piece in this direction if it means hanging the king.

        const position2d = currentPosition2D.add(direction.mult(new Position2D(0, i)));
        const square = board.getSquare(position2d);

        if (!this.isPositionAbsolutePinValid(position2d)) {
            continue;
        }

        if (square === null) {
            continue;
        }

        if (square.piece !== null) {
            break
        }

        let customFunctionality = null

        if (i === 2) {
            customFunctionality = () => {
                this.didTwoSquareMove = true;
            }
        }

        moves.push(new Move(
            currentPosition2D.add(direction.mult(new Position2D(0, i))),
            false,
            customFunctionality,
            this,
        ))
    }

    const leftSquare = board.getSquare(currentPosition2D.add(direction.add(new Position2D(1, 0))));
    const rightSquare = board.getSquare(currentPosition2D.add(direction.add(new Position2D(-1, 0))));

    if (leftSquare !== null) {
        const squarePiece = leftSquare.piece;
        if (squarePiece !== null && this.isPositionAbsolutePinValid(leftSquare.position2d)) {
            if (squarePiece.team !== team) {
                moves.push(new Move(
                    leftSquare.position2d,
                    true,
                    null,
                    this,
                ))
            }
        }
    }

    if (rightSquare !== null) {
        const squarePiece = rightSquare.piece;
        if (squarePiece !== null && this.isPositionAbsolutePinValid(rightSquare.position2d)) {
            if (squarePiece.team !== team) {
                moves.push(new Move(
                    rightSquare.position2d,
                    true,
                    null,
                    this,
                ))
            }
        }
    }

    return moves;
}

function Pawn(board, team) {
    const teamName = team.name;
    const direction = teamName === "white" ? new Position2D(0, 1) : new Position2D(0, -1);

    BasePiece.call(this, board, team);

    this.moveCount = 0;
    this.didTwoSquareMove = false;
    this._didEnPassant = false;
    this._direction = direction;
    this._promotionHeight = (teamName === "white") ? 7 : 0;
    this.onSelect = onSelect;
    this.onUnselect = onUnselect;
    this.onSquareSelected = onSquareSelected;
    this.element = createImageFromTeam(teamName);
    this.getPossibleMoves = getPossibleMoves;
    this._promoteDialog = promoteDialog;
}

export default Pawn;