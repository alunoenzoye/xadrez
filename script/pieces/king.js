import BasePiece from "../modules/basepiece.js";
import Position2D from "../modules/position2d.js";
import Move from "../modules/move.js";
import {highlightEnum} from "../modules/boardsquare.js";
import position2d from "../modules/position2d.js";

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

const CASTLING_SEARCH_DIRECTIONS = [
    new Position2D(1, 0),
    new Position2D(-1, 0),
];

const PIN_DIRECTIONS = [
    {
        direction: new Position2D(0, 1),
        threats: ["Queen", "Rook"]
    },
    {
        direction: new Position2D(0, -1),
        threats: ["Queen", "Rook"]
    },
    {
        direction: new Position2D(1, 0),
        threats: ["Queen", "Rook"]
    },
    {
        direction: new Position2D(-1, 0),
        threats: ["Queen", "Rook"]
    },
    {
        direction: new Position2D(1, 1),
        threats: ["Queen", "Bishop"]
    },
    {
        direction: new Position2D(1, -1),
        threats: ["Queen", "Bishop"]
    },
    {
        direction: new Position2D(-1, -1),
        threats: ["Queen", "Bishop"]
    },
    {
        direction: new Position2D(-1, 1),
        threats: ["Queen", "Bishop"]
    },
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

    if (correspondingMove.customFunctionality !== null) {
        correspondingMove.customFunctionality();
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
            true,
            null,
            this,
        ));
    }

    // CHECK FOR CASTLING

    if (this._firstMove && !this.check) {
        for (const castlingDirection of CASTLING_SEARCH_DIRECTIONS) {
            let currentSquare = board.getSquare(this.position2d.add(castlingDirection));

            while (currentSquare !== null) {
                const piece = currentSquare.piece;

                currentSquare = board.getSquare(currentSquare.position2d.add(castlingDirection));

                if (piece === null) {
                    continue;
                }

                if (piece.constructor.name === "Rook" && piece.firstMove === true) {
                    const movePosition = this.position2d.add(castlingDirection.mult(new Position2D(2, 1)));

                    if (!this.isPositionSafe(movePosition)) {
                        break;
                    }

                    moves.push(new Move(
                        movePosition,
                        false,
                        () => {
                            piece.moveToPosition(movePosition.sub(castlingDirection));
                            piece.firstMove = false;
                        }
                    ));
                }

                break;
            }
        }
    }

    return moves;
}

function isPositionSafe(position2d) {
    const board = this._board;
    const opponentAttackingMoves = this.team.opponent.getAttackingMoves();
    const oppositePosition = this.position2d.add(position2d.sub(this.position2d).mult(new Position2D(-1, -1)));

    const pawnThreats = [
        position2d.add(this._pawnTakeDirection.add(new Position2D(1, 0))),
        position2d.add(this._pawnTakeDirection.add(new Position2D(-1, 0))),
    ]

    let safe = true;

    for (const threateningPosition of pawnThreats) {
        const squareInPosition = board.getSquare(threateningPosition);

        if (squareInPosition !== null) {
            const pieceInPosition = squareInPosition.piece;

            if (pieceInPosition !== null) {
                if (pieceInPosition.constructor.name === "Pawn" && pieceInPosition.team !== this.team) {
                    safe = false

                    return safe;
                }
            }
        }
    }

    for (const move of opponentAttackingMoves) {
        const pieceConstructor = move.correspondingPiece.constructor.name
        const isPiercingPiece = (pieceConstructor === "Bishop" || pieceConstructor === "Queen" || pieceConstructor === "Rook")

        if (move.position2d.equal(position2d) || (move.position2d.equal(oppositePosition) && isPiercingPiece)) {
            safe = false;

            break
        }
    }

    return safe;
}

function onGameUpdate() {
    const team = this.team;

    this.check = !this.isPositionSafe(this.position2d);

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

function evaluatePins() {
    for (const piece of this.team.alivePieces) {
        piece.clearAbsolutePins();
    }

    const currentPosition2D = this.position2d;
    const board = this._board;

    for (const pinDirection of PIN_DIRECTIONS) {
        const direction = pinDirection.direction;

        let currentSquare = board.getSquare(currentPosition2D.add(direction));
        let possiblePinnedPiece = null;
        let pinnedPiece = null;

        while (currentSquare !== null) {
            const piece = currentSquare.piece;

            currentSquare = board.getSquare(currentSquare.position2d.add(direction));

            if (piece === null) {
                continue;
            }

            if (possiblePinnedPiece === null) {
                // First step of the algorithm is to find a piece that could be pinned

                // A pinned piece must be of the same team as the king. if it isn't, then we don't have a pin in this direction.
                if (piece.team === this.team) {
                    possiblePinnedPiece = piece;
                } else {
                    break;
                }
            } else {
                // We have a valid pin if there's a valid threat in the same direction.
                if (piece.team !== this.team && pinDirection.threats.includes(piece.constructor.name)) {
                    pinnedPiece = possiblePinnedPiece;
                    possiblePinnedPiece.addAbsolutePinDirection(pinDirection.direction);
                    possiblePinnedPiece.addAbsolutePinDirection(pinDirection.direction.mult(new Position2D(-1, -1)));
                }

                break;
            }
        }
    }
}

function King(board, team) {
    const teamName = team.name;
    const direction = teamName === "white" ? new Position2D(0, 1) : new Position2D(0, -1);
    team.king = this;

    BasePiece.call(this, board, team);

    this._pawnTakeDirection = direction;
    this.check = false;
    this._firstMove = true;
    this.take = take;
    this.onSelect = onSelect;
    this.onUnselect = onUnselect;
    this.onGameUpdate = onGameUpdate;
    this.onSquareSelected = onSquareSelected;
    this.element = createImageFromTeam(teamName);
    this.getPossibleMoves = getPossibleMoves;
    this.isPositionSafe = isPositionSafe;
    this.evaluatePins = evaluatePins;
}

export default King;
