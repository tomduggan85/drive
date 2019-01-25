import React from 'react';
import { connect } from 'react-redux';
import './PlayerVehicleDisplay.scss';
import FollowCameraRenderer from './FollowCameraRenderer';

//TODO move this to a different file
const normalizeToRange = ( min, max, v ) => {
  const clamped = Math.min( max, Math.max( min, v ))
  
  return ( clamped - min ) / ( max - min )
}

class PlayerVehicleDisplay extends React.Component {

  getDamageIndicatorFilter() {
    const { health } = this.props;
    const normalizedhealthForHue = normalizeToRange( 20, 100, health )
    const normalizedhealthForBrightness = normalizeToRange( 0, 30, health )

    const minHue = -50
    const maxHue = 30
    const hue = minHue + normalizedhealthForHue * (maxHue - minHue)
    const brightness = normalizedhealthForBrightness * 100

    return `sepia() saturate(10000%) hue-rotate(${ hue }deg) brightness(${ brightness }%)`
  }

  render() {
    const {
      scene,
      vehicleIndex,
      health
    } = this.props;

    const CARS_LEFT = 2;
    const damageIndicatorStyles = {
      filter: this.getDamageIndicatorFilter()
    }

    return (
      <div className="player-vehicle-display">
        <FollowCameraRenderer scene={scene} vehicleIndex={vehicleIndex} />
        <div className='hud'>
          <div className='cars-left'>
            <div className='description'>cars left</div>
            <div className='value'>{CARS_LEFT}</div>
          </div>
          <div className='damage-indicator'>
            <img
              style={ damageIndicatorStyles }
              src='/assets/images/damage_indicator_engine.png'
              className='engine'
            />
            <img
              style={damageIndicatorStyles}
              src='/assets/images/damage_indicator_car.png'
              className='car'
            />
            { health }
          </div>

        </div>
      </div>
    );
  }
}

const mapStateToProps = ( state, ownProps ) => {
  return {
    health: state.vehicleDamage.vehicles[ownProps.vehicleIndex] ? state.vehicleDamage.vehicles[ownProps.vehicleIndex].health : 0
  }
}

export default connect(
  mapStateToProps
)( PlayerVehicleDisplay );