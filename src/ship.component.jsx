import React from 'react';
import ShipType from './shiptype.js';

class ShipComponent extends React.Component {
    getShipClass() {
        switch (this.props.ship.shipType) {
            case ShipType.AIRCRAFT_CARRIER:
                return 'ship-aircraft-carrier';
            case ShipType.BATTLESHIP:
                return 'ship-battleship';
            case ShipType.CRUISER:
                return 'ship-cruiser';
            case ShipType.PATROL_BOAT:
                return 'ship-patrol-boat';
            case ShipType.SUBMARINE:
                return 'ship-submarine';
            default:
                return '';
        }
    }

    render() {
        if (!this.props.ship.shipType) {
            return null;
        }

        var style = {
            top: (this.props.ship.y * 32) + 'px',
            left: (this.props.ship.x * 32) + 'px',
            transform: `rotate(${this.props.ship.rotation}deg)`
        };

        return (<div className={this.getShipClass()} style={style}></div>);
    }
}

export default ShipComponent;