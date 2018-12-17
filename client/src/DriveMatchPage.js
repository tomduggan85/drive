import React from 'react';
import './DriveMatchPage.css';
import DriveScene from './DriveScene';
import CameraRenderer from './CameraRenderer';
import { getSocket } from './shared/DriveMatchSocket';
import { VEHICLE_TYPES } from './Vehicle';

class DriveMatchPage extends React.Component {

  constructor( props ) {
    super( props );
    
    const { matchId } = props.match.params;
    this.socket = getSocket( matchId );

    const params = new URLSearchParams(window.location.search);
    this.driveScene = new DriveScene({
      socket: this.socket,
      vehicles: [
        params.get('v1') || VEHICLE_TYPES[0],
        params.get('v2') || VEHICLE_TYPES[1],
      ]
    });
  }

  componentWillUnmount() {
    this.socket.close();
  }

  render() {
    return (
      <div className="drive-match-page">
        <CameraRenderer driveScene={this.driveScene} followCarIndex={0} />
        <CameraRenderer driveScene={this.driveScene} followCarIndex={1} />
      </div>
    );
  }
}

export default DriveMatchPage;