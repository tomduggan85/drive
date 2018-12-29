import React from 'react';
import uuid from 'uuid';
import {
  VEHICLE_TYPES,
  VEHICLE_DEFS
} from '../shared/Vehicles';
import './SelectVehiclePage.scss';
import classnames from 'classnames'
import StaticVehicleScene, { ANIMATION_TYPES } from '../3d/StaticVehicleScene';
import CameraRenderer from './CameraRenderer';

const PLAYER_COUNT = 2;

class SelectVehiclePage extends React.Component {

  state = {
    matchId: uuid().substr(0, 5), //hacky way to generate a random matchId on each splash page mount.
    currentPlayer: 0,
    previewedVehicle: VEHICLE_TYPES[0],
    selections: [],
  }

  constructor( props ) {
    super( props );

    const animationType = ANIMATION_TYPES.CONTINUOUS_SPIN
    this.scenes = VEHICLE_TYPES.reduce(( accum, vehicleType ) => {
      return {
        ...accum,
        [vehicleType]: new StaticVehicleScene({ vehicleType, animationType })
      }
    }, {});
  }

  startMatch = () => {
    const { selections, matchId } = this.state;
    this.props.history.push( `/match/${ matchId }?v1=${ selections[0] }&v2=${ selections[1] }` );
  }

  selectVehicle = async ( vehicleType ) => {
    const selections = [...this.state.selections, vehicleType];
    await this.setState({ selections });
    
    if ( selections.length === PLAYER_COUNT ) {
      this.startMatch();
    } else {
      this.setState({ currentPlayer: this.state.currentPlayer + 1 });
    }
  }

  previewVehicle = ( vehicleType ) => {
    this.setState({ previewedVehicle: vehicleType })
  }

  getTileTypes() {
    //For visual effect, pad out the vehicle type list with some duplicates
    const desiredTileCount = 9;
    return [ ...VEHICLE_TYPES, ...VEHICLE_TYPES.slice(0, desiredTileCount - VEHICLE_TYPES.length)];
  }

  render() {
    const displayedPlayer = this.state.currentPlayer + 1;
    const { scenes } = this;
    const { previewedVehicle } = this.state;

    return (
      <div className={`SelectVehiclePage player-${ displayedPlayer }`}>
        <div className='title'>Player {displayedPlayer} choose your vehicle</div>
        <div className='flex-container'>
          <div className='vehicle-info'>
            <div className='previews'>
              {VEHICLE_TYPES.map( vehicleType => (
                <div
                  className={classnames('preview', {'is-active': vehicleType === previewedVehicle })}
                  key={vehicleType}
                >
                  <CameraRenderer
                    scene={scenes[ vehicleType ]}
                    transparent={true}
                    position={[ 0, 15, -35 ]}
                  />
                </div>
              ))}
            </div>
            <div className='stats'>
              Stats<br/>
              Stats<br/>
              Stats<br/>
              Stats<br/>
              Stats<br/>
            </div>
          </div>
          <div className='vehicle-tiles'>
            {this.getTileTypes().map(( vehicleType, i ) => (
              <div
                key={i}
                className='vehicle-tile'
                onMouseEnter={() => this.previewVehicle( vehicleType )}
                onClick={() => this.selectVehicle( vehicleType )}
              >
                <img src={`/assets/images/vehicles/${ vehicleType }.png`} alt={vehicleType} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default SelectVehiclePage;