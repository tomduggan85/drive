import React from 'react';
import './DriveMatchPage.css';
import { getSocket } from './shared/DriveMatchSocket';

const playerId = 0;

class DriveRemoteControlPage extends React.Component {

  constructor( props ) {
    super( props );

    const { matchId } = props.match.params;
    this.socket = getSocket( matchId );
  }

  componentWillUnmount() {
    this.socket.close();
  }

  //For now, these all assume that a socket connection has already been established.

  sendAction( action ) {
    console.error(`sending ${action}`)
    this.socket.send(JSON.stringify({
      playerId,
      action
    }));
  }

  onLeft = () => {
    this.sendAction( 'onLeft' );
  }

  onRight = () => {
    this.sendAction( 'onRight' );
  }

  offSteer = () => {
    this.sendAction( 'offSteer' );
  }

  mouseOutSteer = (e) => {
    if ( e.nativeEvent.which === 1 ) {
      //mouse was down
      this.sendAction( 'offSteer' );
    }
  }

  onForward = () => {
    this.sendAction( 'onForward' );
  }

  onReverse = () => {
    this.sendAction( 'onReverse' );
  }

  offGas = () => {
    this.sendAction( 'offGas' );
  }

  mouseOutGas = (e) => {
    if ( e.nativeEvent.which === 1 ) {
      //mouse was down
      this.sendAction( 'offGas' );
    }
  }

  render() {
    return (
      <div className="drive-remote-control-page">
        remote control page
        <div
          onMouseDown={this.onLeft}
          onMouseUp={this.offSteer}
          onMouseOut={this.mouseOutSteer}
        >
          Left
        </div>
        <div
          onMouseDown={this.onRight}
          onMouseUp={this.offSteer}
          onMouseOut={this.mouseOutSteer}
        >
          Right
        </div>

        <div
          onMouseDown={this.onForward}
          onMouseUp={this.offGas}
          onMouseOut={this.mouseOutGas}
        >
          Forward
        </div>
        <div
          onMouseDown={this.onReverse}
          onMouseUp={this.offGas}
          onMouseOut={this.mouseOutGas}
        >
          Reverse
        </div>
      </div>
    );
  }
}

export default DriveRemoteControlPage;