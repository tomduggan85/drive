import React from 'react';
import './DriveMatchPage.css';
import DriveScene from '../3d/DriveScene';
import FollowCameraRenderer from './FollowCameraRenderer';
import { getSocket } from '../shared/DriveMatchSocket';
import { VEHICLE_TYPES } from '../shared/Vehicles';

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
        <FollowCameraRenderer driveScene={this.driveScene} vehicleIndex={0} />
        <FollowCameraRenderer driveScene={this.driveScene} vehicleIndex={1} />
      </div>
    );
  }
}

export default DriveMatchPage;