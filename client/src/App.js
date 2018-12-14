
import React, { Component } from 'react';
import './App.css';
import DriveScene from './DriveScene';
import CameraRenderer from './CameraRenderer';

class App extends Component {

  constructor( props ) {
    super( props );
    this.driveScene = new DriveScene();
  }

  render() {
    return (
      <div className="App">
        <CameraRenderer driveScene={this.driveScene} followCarIndex={0} />
        <CameraRenderer driveScene={this.driveScene} followCarIndex={1} />
      </div>
    );
  }
}

export default App;
