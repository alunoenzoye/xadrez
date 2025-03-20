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
    img.src = `/assets/pieces/01_classic/${prefix}-king.png`;

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
        const opponentAttackingMoves = this.team.opponent.getAttackingMoves();

        let currentSquare = board.getSquare(currentPosition2D.add(searchDirection));
        let isMoveValid = true

        if (currentSquare === null) {
            continue;
        }

        const squarePiece = currentSquare.piece;

        if (squarePiece !== null) {
            if (squarePiece.team === this.team) {
                continue;
            }
        }

        if (!this.isPositionSafe(currentSquare.position2d)) {
            continue;
        }

        if (!isMoveValid) {
            continue;
        }

        moves.push(new Move(
            currentSquare.position2d,
            true
        ));
    }

    return moves;
}

function isPositionSafe(position2d) {
    const opponentAttackingMoves = this.team.opponent.getAttackingMoves();

    let safe = true;
    for (const move of opponentAttackingMoves) {
        if (move.position2d.equal(position2d)) {
            safe = false;
            break
        }
    }

    return safe;
}

function onGameUpdate() {
    const team = this.team;

    this.check = !this.isPositionSafe(this.position2d);

    console.log(this.getPossibleMoves().length);
    if (this.getPossibleMoves().length === 0) {
        if (this.check) {
            console.log("checkmate")
        } else {
            let totalMoves = 0;
            for (const piece of team.alivePieces) {
                if (piece === this) {
                    continue;
                }
                totalMoves += piece.getPossibleMoves().length;
            }
            if (totalMoves === 0) {
                console.log("stalemate")
            }
        }
    }
}

function take() {
    console.error("You can't take the king!");
}

function King(board, team) {
    const teamName = team.name;
    team.king = this;

    BasePiece.call(this, board, team);

    this.check = false;
    this.firstMove = true;
    this.take = take;
    this.onSelect = onSelect;
    this.onUnselect = onUnselect;
    this.onGameUpdate = onGameUpdate;
    this.onSquareSelected = onSquareSelected;
    this.element = createImageFromTeam(teamName);
    this.getPossibleMoves = getPossibleMoves;
    this.isPositionSafe = isPositionSafe;
}

export default King;
