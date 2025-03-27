function getAttackingMoves() {
    return this._attackingMoves;
}

function updateAttackingMoves() {
let attackingMoves = []

    for (const piece of this.alivePieces) {
        const moves = piece.getPossibleMoves();

        for (const move of moves) {
            if (!move.canTake) {
                continue;
            }

            attackingMoves.push(move);
        }
    }

    this.clearAttackingMoves();
    this._attackingMoves = attackingMoves;
}

function clearAttackingMoves() {
    this._attackingMoves = [];
}

function addAttackingMove(move) {
    this._attackingMoves.push(move);
}

function onPieceTaken(piece) {
    const index = this.alivePieces.indexOf(piece);
    this.alivePieces.splice(index, 1);
    this.takenPieces.push(piece);
}

function clearTakenPieces() {
    this.takenPieces = [];
}

function cleanPieces() {
    for (const piece of this.alivePieces) {
        piece.cleanup();
    }

    for (const piece of this.takenPieces) {
        piece.cleanup();
    }

    this.alivePieces = [];
    this.takenPieces = [];
}

function Team(name, opponent) {
    this.name = name;
    this.opponent = opponent;
    this.king = null;
    this._attackingMoves = [];
    this.alivePieces = [];
    this.takenPieces = [];
    this.cleanPieces = cleanPieces;
    this.getAttackingMoves = getAttackingMoves;
    this.updateAttackingMoves = updateAttackingMoves;
    this.clearAttackingMoves = clearAttackingMoves;
    this.clearTakenPieces = clearTakenPieces;
    this.addAttackingMove = addAttackingMove;
    this.onPieceTaken = onPieceTaken;
}

export default Team;