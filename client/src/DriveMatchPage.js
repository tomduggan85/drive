import React from 'react';
import './DriveMatchPage.css';
import DriveScene from './DriveScene';
import CameraRenderer from './CameraRenderer';
import { getSocket } from './shared/DriveMatchSocket';

class DriveMatchPage extends React.Component {

  constructor( props ) {
    super( props );
    
    const { matchId } = props.match.params;
    this.socket = getSocket( matchId );

    this.driveScene = new DriveScene({
      socket: this.socket
    });
  }

  componentWillUnmount() {
    this.socket.close();
  }

  render() {
    return (
      <div className="drive-match-page">
        <CameraRenderer driveScene={this.driveScene} followCarIndex={0} />
        <CameraRenderer driveScene={this.driveScene} followCarIndex={undefined} />
      </div>
    );
  }
}

export default DriveMatchPage;