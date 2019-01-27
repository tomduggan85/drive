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
import PalmSilhouette from './PalmSilhouette';

const PLAYER_COUNT = 2;

const waitFor = ( time ) => {
  return new Promise( resolve => {
    setTimeout( resolve, time )
  });
};

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

  selectVehicle = async ( vehicleType, e ) => {
    const selections = [...this.state.selections, vehicleType];
    e.persist();
    const { currentTarget } = e;
    currentTarget.classList.add('selected');
    await this.setState({ selections });
    
    
    await waitFor( 300 );
    currentTarget.classList.remove('selected');

    if ( selections.length === PLAYER_COUNT ) {
      this.startMatch();
    } else {
      this.setState({ currentPlayer: this.state.currentPlayer + 1 });
    }
  }

  previewVehicle = ( vehicleType ) => {
    this.setState({ previewedVehicle: vehicleType })
  }

  render() {
    const displayedPlayer = this.state.currentPlayer + 1;
    const { scenes } = this;
    const { previewedVehicle } = this.state;
    const previewedVehicleDef = VEHICLE_DEFS[ previewedVehicle ];

    return (
      <div className={`SelectVehiclePage player-${ displayedPlayer }`}>
        <PalmSilhouette />
        <div className='title'>
          <div className='player'>Player {displayedPlayer}</div>
          <div className='directive'>choose your car</div>
        </div>
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
              <div className='vehicle-name'>{ previewedVehicle }</div>
              <div>HP: {previewedVehicleDef.stats.hp}</div>
              <div>Top speed: {previewedVehicleDef.stats.topSpeed} mph</div>
              <div>0-60: {previewedVehicleDef.stats.zero60} s</div>
              <div>Weight: {previewedVehicleDef.stats.weight} lbs.</div>
            </div>
          </div>
          <div className='vehicle-tiles'>
            {VEHICLE_TYPES.map(( vehicleType, i ) => (
              <div
                key={i}
                className='vehicle-tile'
                onMouseEnter={() => this.previewVehicle( vehicleType )}
                onClick={(e) => this.selectVehicle( vehicleType, e )}
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