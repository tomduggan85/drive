/* global THREE e*/

import React, { Component } from 'react';
import './App.css';

class App extends Component {
  
  componentDidMount() {
    const { width, height } = this.$sceneContainer.getBoundingClientRect();

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      40,
      width/height,
      0.1,
      1000
    );

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);
    this.$sceneContainer.appendChild(this.renderer.domElement);

    this.camera.position.z = 5;

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(1),
      new THREE.MeshNormalMaterial()
    );
    this.scene.add(sphere);
    
    this.stepScene();
  }

  stepScene = () => {
    requestAnimationFrame( this.stepScene );
    this.renderer.render(
      this.scene,
      this.camera
    );
  }

  render() {
    return (
      <div className="App">
        <div
          className='scene-container'
          ref={(el) => this.$sceneContainer = el} 
        /> 
      </div>
    );
  }
}

export default App;
