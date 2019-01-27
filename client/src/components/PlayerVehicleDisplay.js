import React from 'react';
import { connect } from 'react-redux';
import './PlayerVehicleDisplay.scss';
import FollowCameraRenderer from './FollowCameraRenderer';
import getVehicleHealth from '../selectors/getVehicleHealth';
import isVehicleTakingDamage from '../selectors/isVehicleTakingDamage';
import getVehiclesLeft from '../selectors/getVehiclesLeft';
import classnames from 'classnames';

//TODO move this to a different file
const normalizeToRange = ( min, max, v ) => {
  const clamped = Math.min( max, Math.max( min, v ))
  
  return ( clamped - min ) / ( max - min )
}

class PlayerVehicleDisplay extends React.Component {

  getDamageIndicatorFilter() {
    const { health } = this.props;
    const normalizedhealthForHue = normalizeToRange( 20, 80, health )
    const normalizedhealthForBrightness = normalizeToRange( 0, 20, health )

    const minHue = -120
    const maxHue = -20
    const hue = minHue + normalizedhealthForHue * (maxHue - minHue)
    const brightness = normalizedhealthForBrightness * 100

    return `hue-rotate(${ hue }deg) brightness(${ brightness }%)`
  }

  render() {
    const {
      scene,
      vehicleIndex,
      health,
      vehiclesLeft,
      takingDamage
    } = this.props;

    const damageIndicatorStyles = {
      filter: this.getDamageIndicatorFilter()
    }

    return (
      <div className="player-vehicle-display">
        <FollowCameraRenderer scene={scene} vehicleIndex={vehicleIndex} />
        <div className='hud'>
          <div className='cars-left'>
            <div className='description'>cars left</div>
            <div className='value'>{vehiclesLeft}</div>
          </div>
          <div className={classnames('damage-indicator', { 'taking-damage': takingDamage })}>
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
          </div>

        </div>
      </div>
    );
  }
}

const mapStateToProps = ( state, ownProps ) => {
  return {
    health: getVehicleHealth( ownProps.vehicleIndex )( state ),
    takingDamage: isVehicleTakingDamage( ownProps.vehicleIndex )( state ),
    vehiclesLeft: getVehiclesLeft( state )
  }
}

export default connect(
  mapStateToProps
)( PlayerVehicleDisplay );