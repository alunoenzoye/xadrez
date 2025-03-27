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

function abs() {
    return new Position2D(Math.abs(this.x), Math.abs(this.y));
}

function unit() {
    const magnitude = Math.sqrt(this.x * this.x + this.y * this.y);

    return new Position2D(this.x / magnitude, this.y / magnitude);
}

function Position2D(x, y) {
    this.x = x;
    this.y = y;
    this.add = add;
    this.sub = sub;
    this.mult = mult;
    this.equal = equal;
    this.unit = unit;
    this.abs = abs;
}

export default Position2D;