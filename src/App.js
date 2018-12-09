/* global THREE Physijs */

import React, { Component } from 'react';
import './App.css';
import Vehicle from './Vehicle';
import Arena from './Arena';

class App extends Component {

  initScene() {
    const { width, height } = this.$sceneContainer.getBoundingClientRect();

    Physijs.scripts.worker = '/js/physijs_worker.js';
    Physijs.scripts.ammo = '/js/ammo.js';

    this.scene = new Physijs.Scene();
    this.camera = new THREE.PerspectiveCamera(
      40,
      width/height,
      0.1,
      1000
    );

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);
    this.$sceneContainer.appendChild(this.renderer.domElement);
  }

  populateScene() {

    this.camera.position.set( 80, 50, 80 );
    this.camera.lookAt( this.scene.position );
    this.scene.setGravity(new THREE.Vector3( 0, -50, 0 ));

    this.scene.add( new THREE.AmbientLight( 0x404040, 5 ));
    
    const pointLight = new THREE.PointLight( 0x404040, 20 );
    pointLight.position.set(20, 20, 0);
    this.scene.add( pointLight );

    const arena = new Arena({
      scene: this.scene,
    })


    const car1 = new Vehicle({
      scene: this.scene,
      keys: {
        left: 37,
        right: 39,
        forward: 38,
        reverse: 40,
      }
    })

    //const car2 = new Vehicle({
    //  scene: this.scene,
    //});

  }

  stepScene = () => {
    requestAnimationFrame( this.stepScene );
    this.scene.simulate();
    this.renderer.render(
      this.scene,
      this.camera
    );
  }

  componentDidMount() {
    this.initScene();
    this.populateScene();    
    this.stepScene();
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
