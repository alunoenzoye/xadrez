import BasePiece from "../modules/basepiece.js";

function onSelect() {
    this.followCursor();
}

function onUnselect() {
    this.unfollowCursor();
}

function onSquareSelected(square) {
    return true;
}

function createImageFromTeam(team) {
    const img = document.createElement("img");
    img.classList.add("piece");

    const prefix = (team === "white") ? "w" : "b";
    img.src = `/assets/pieces/01_classic/${prefix}-pawn.png`;

    return img;
}

function Pawn(board, team) {
    BasePiece.call(this, board, team);
    this.onSelect = onSelect;
    this.onUnselect = onUnselect;
    this.onSquareSelected = onSquareSelected;
    this.element = createImageFromTeam(team);
}

export default Pawn;