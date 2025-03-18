function add(position) {
    const newX = this.x + position.x;
    const newY = this.y + position.y;

    return new Position2D(newX, newY);
}

function sub(position) {
    const newX = this.x - position.x;
    const newY = this.y - position.y;

    return new Position2D(newX, newY);
}

function mult(position) {
    const newX = this.x * position.x;
    const newY = this.y * position.y;

    return new Position2D(newX, newY);
}

function equal(position) {
    return (this.x === position.x && this.y === position.y);
}

function Position2D(x, y) {
    this.x = x;
    this.y = y;
    this.add = add;
    this.sub = sub;
    this.mult = mult;
    this.equal = equal;
}

export default Position2D;