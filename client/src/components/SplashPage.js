import React from 'react';
import uuid from 'uuid';
import { VEHICLE_TYPES } from '../shared/Vehicles';
import './SplashPage.css';
import classnames from 'classnames'

class SplashPage extends React.Component {

  state = {
    matchId: uuid().substr(0, 5), //hacky way to generate a random matchId on each splash page mount.
    selectedVehiclePlayer1: VEHICLE_TYPES[0], 
    selectedVehiclePlayer2: VEHICLE_TYPES[1],
    showVehicleSelection: false,
  }

  startMatch = () => {
    const { selectedVehiclePlayer1, selectedVehiclePlayer2, matchId } = this.state;
    this.props.history.push( `/match/${ matchId }?v1=${ selectedVehiclePlayer1 }&v2=${ selectedVehiclePlayer2 }` );
  }

  selectVehicle = ( playerIndex, vehicleType ) => {
    this.setState({
      [ `selectedVehiclePlayer${ playerIndex }` ]: vehicleType
    })
  }

  startSelection = () => {
    this.setState({ showVehicleSelection: true })
  }

  renderVehicleSelector( playerIndex ) {
    const currentSelection = this.state[`selectedVehiclePlayer${ playerIndex }`];

    return (
      <div className='vehicle-selector'>
        Player { playerIndex } vehicle:
        {VEHICLE_TYPES.map( vehicleType => (
          <div
            key={vehicleType}
            className={classnames('vehicle-type', {selected: currentSelection === vehicleType})}
            onClick={() => this.selectVehicle( playerIndex, vehicleType )}
          >
            {vehicleType}
          </div>
        ))}
      </div>
    )
  }

  render() {
    const { showVehicleSelection } = this.state;
    return (
      <div className='SplashPage'>
        {showVehicleSelection ? (
          <>
            {this.renderVehicleSelector(1)}
            {this.renderVehicleSelector(2)}
            <div
              className='start-match'
              onClick={this.startMatch}
            >
                Start
            </div>
          </>
        ) : (
          <>
            <div className='title'>
              <div className='title-row'>DUMB</div>
              <div className='title-row'>RACER</div>
            </div>
            <div
              className='start-selection'
              onClick={this.startSelection}
            >
              • press start •
            </div>
        </>
      )}
      </div>
    );
  }
}

export default SplashPage;