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

function Position2D(x, y) {
    this.x = x;
    this.y = y;
    this.add = add;
    this.sub = sub;
}

export default Position2D;