import React from 'react';
import './PlayerVehicleDisplay.scss';
import FollowCameraRenderer from './FollowCameraRenderer';

class PlayerVehicleDisplay extends React.Component {

  render() {
    const { scene, vehicleIndex } = this.props;
    const CARS_LEFT = 2;

    return (
      <div className="player-vehicle-display">
        <FollowCameraRenderer scene={scene} vehicleIndex={vehicleIndex} />
        <div className='hud'>
          <div className='cars-left'>
            <div className='description'>cars left</div>
            <div className='value'>{CARS_LEFT}</div>
          </div>
          <div className='damage-indicator'>
            <img src='/assets/images/damage_indicator_engine.png' className='engine' />
            <img src='/assets/images/damage_indicator_car.png' className='car' />
          </div>

        </div>
      </div>
    );
  }
}

export default PlayerVehicleDisplay;