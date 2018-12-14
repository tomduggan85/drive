import React from 'react';
import './DriveMatchPage.css';
import DriveScene from './DriveScene';
import CameraRenderer from './CameraRenderer';

const WEBSOCKET_PORT = 8080

class DriveMatchPage extends React.Component {

  constructor( props ) {
    super( props );
    this.driveScene = new DriveScene();

    const { matchId } = props.match.params;
    this.socket = new WebSocket(`ws://${ window.location.hostname }:${ WEBSOCKET_PORT }/match/${ matchId }`);
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