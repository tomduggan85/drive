import React from 'react';
import './DriveMatchPage.css';
import DriveScene from './DriveScene';
import CameraRenderer from './CameraRenderer';

class DriveMatchPage extends React.Component {

  constructor( props ) {
    super( props );
    this.driveScene = new DriveScene();
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