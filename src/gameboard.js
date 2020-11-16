class GameTile {
    static get STATUS_NOT_ATTACKED() { return 'NOT_ATTACKED'; }
    static get STATUS_MISSED() { return 'MISSED'; }
    static get STATUS_HIT() { return 'HIT'; }

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.status = GameTile.STATUS_NOT_ATTACKED;
    }

    reset() {
        this.status = GameTile.STATUS_NOT_ATTACKED;
    }

    setMissed() {
        this.status = GameTile.STATUS_MISSED;
    }

    setHit() {
        this.status = GameTile.STATUS_HIT;
    }
}

class Gameboard {
    constructor() {
        this.tiles = [];
        for (var y = 0; y < 10; y++) {
            this.tiles[y] = [];
            for (var x = 0; x < 10; x++) {
                this.tiles[y][x] = new GameTile(x, y);
            }
        }
    }

    reset() {
        for (var row of this.tiles) {
            for (var t of row) {
                t.reset();
            }
        }
    }

    attackTile(x, y) {
        var ship = this.player.getShipAt(x, y);

        if (ship) {
            this.tiles[y][x].setHit();
            ship.damage();
        } else {
            this.tiles[y][x].setMissed();
        }

        return ship;
    }

    setPlayer(newPlayer) {
        this.player = newPlayer;
    }
}

export {
    Gameboard,
    GameTile
}