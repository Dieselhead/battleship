import ShipType from './shiptype';

class Ship {
    constructor(shipType) {
        this.x = 0;
        this.y = 0;
        this.rotation = 0;
        this.hitsTaken = 0;

        this.shipType = shipType;
    }

    reset() {
        this.x = 0;
        this.y = 0;
        this.rotation = 0;
        this.hitsTaken = 0;
    }

    getReadableName() {
        switch (this.shipType) {
            case ShipType.AIRCRAFT_CARRIER:
                return 'Aircraft Carrier';
            case ShipType.BATTLESHIP:
                return 'Battleship';
            case ShipType.CRUISER:
                return 'Cruiser';
            case ShipType.SUBMARINE:
                return 'Submarine';
            case ShipType.PATROL_BOAT:
                return 'Patrol Boat';
            default:
                return 'Unknown ship';
        }
    }

    damage() {
        this.hitsTaken += 1;
        return this.isDestroyed();
    }

    isDestroyed() {
        return this.hitsTaken >= this.getSize();
    }

    getSize() {
        switch (this.shipType) {
            case ShipType.AIRCRAFT_CARRIER:
                return 5;
            case ShipType.BATTLESHIP:
                return 4;
            case ShipType.CRUISER:
            case ShipType.SUBMARINE:
                return 3;
            case ShipType.PATROL_BOAT:
                return 2;
            default:
                return -1;
        }
    }

    move(direction) {
        switch (direction) {
            case 'up':
                this.y = Math.max(this.y - 1, 0);
                break;
            case 'down':
                this.y = Math.min(this.y + 1, 9);
                break;
            case 'left':
                this.x = Math.max(this.x - 1, 0);
                break;
            case 'right':
                this.x = Math.min(this.x + 1, 9);
                break;
        }
    }

    rotate(direction) {
        // +360 % 360 to keep rotations between 0 and 360
        if (direction === 'left') {
            this.rotation = (Math.floor(this.rotation - 90) + 360) % 360;
        } else if (direction === 'right') {
            this.rotation = (Math.floor(this.rotation + 90) + 360) % 360;
        }
    }

    getXCoords() {
        var baseArray = [...Array(this.getSize()).keys()];

        switch (this.rotation) {
            case 90:
            case 270:
                return [ this.x ];
            case 0:
                return baseArray.map(value => value + this.x);
            case 180:
                return baseArray.map(value => this.x - value);
            default:
                return [];
            
        }
    }

    getYCoords() {
        var baseArray = [...Array(this.getSize()).keys()];

        switch (this.rotation) {
            case 0:
            case 180:
                return [ this.y ];
            case 90:
                return baseArray.map(value => value + this.y);
            case 270:
                return baseArray.map(value => this.y - value);
            default:
                return [];
            
        }
    }

    isOnCoords(x, y) {
        return this.getXCoords().includes(x) && this.getYCoords().includes(y);
    }

    isInsideBoard() {
        var x = this.getXCoords();
        var y = this.getYCoords();
        var allCoords = x.concat(y);

        for (var coord of allCoords) {
            if (coord > 9 || coord < 0) {
                return false;
            }
        }

        return true;
    }
}

export default Ship;