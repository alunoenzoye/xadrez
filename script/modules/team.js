function getAttackingMoves() {
    return this._attackingMoves;
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

function Team(name) {
    this.name = name;
    this._attackingMoves = [];
    this.alivePieces = [];
    this.takenPieces = [];
    this.getAttackingMoves = getAttackingMoves;
    this.clearAttackingMoves = clearAttackingMoves;
    this.addAttackingMove = addAttackingMove;
    this.onPieceTaken = onPieceTaken;
}

export default Team;