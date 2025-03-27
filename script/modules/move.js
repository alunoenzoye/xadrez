function Move(position2d, canTake, customFunctionality, correspondingPiece) {
    this.position2d = position2d;
    this.canTake = canTake;
    this.customFunctionality = (customFunctionality !== undefined) ? customFunctionality : null;
    this.correspondingPiece = correspondingPiece;
}

export default Move;