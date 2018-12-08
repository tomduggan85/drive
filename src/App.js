/* global THREE Physijs */

import React, { Component } from 'react';
import './App.css';

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

  populateSceneBasic() {
    this.camera.position.z = 5;

    const sphere = new Physijs.SphereMesh(
      new THREE.SphereGeometry(1),
      new THREE.MeshNormalMaterial()
    );
    this.scene.add(sphere);
  }

  populateSceneDrivingSim() {

    this.camera.position.set( 60, 50, 60 );
    this.camera.lookAt( this.scene.position );

    
    let car = {};
    let light, ground_material, ground, car_material, wheel_material, wheel_geometry;

    light = new THREE.DirectionalLight( 0xFFFFFF );
    light.position.set( 20, 40, -15 );
    light.target.position.copy( this.scene.position );
    light.castShadow = true;
    light.shadowCameraLeft = -60;
    light.shadowCameraTop = -60;
    light.shadowCameraRight = 60;
    light.shadowCameraBottom = 60;
    light.shadowCameraNear = 20;
    light.shadowCameraFar = 200;
    light.shadowBias = -.0001
    light.shadowMapWidth = light.shadowMapHeight = 2048;
    light.shadowDarkness = .7;
    this.scene.add( light );
    // Loader
    
    // Materials
    ground_material = Physijs.createMaterial(
      new THREE.MeshNormalMaterial(),
      5, // high friction
      .4 // low restitution
    );
    
    // Ground
    ground = new Physijs.BoxMesh(
      new THREE.BoxGeometry(100, 1, 100),
      ground_material,
      0 // mass
    );
    ground.receiveShadow = true;
    this.scene.add( ground );
    
    
    // Car
    car_material = Physijs.createMaterial(
      new THREE.MeshNormalMaterial(),
      0.8, // high friction
      .2 // low restitution
    );
    
    wheel_material = Physijs.createMaterial(
      new THREE.MeshNormalMaterial(),
      10, // high friction
      .5 // medium restitution
    );
    wheel_geometry = new THREE.CylinderGeometry( 2, 2, 1, 8 );
    
    car.body = new Physijs.BoxMesh(
      new THREE.BoxGeometry( 12, 4, 7 ),
      car_material,
      10000
    );
    car.body.position.y = 8;
    car.body.receiveShadow = car.body.castShadow = true;
    this.scene.add( car.body );
    
    car.wheel_fl = new Physijs.CylinderMesh(
      wheel_geometry,
      wheel_material,
      50
    );
    car.wheel_fl.rotation.x = Math.PI / 2;
    car.wheel_fl.position.set( -3.5, 6.5, 5 );
    car.wheel_fl.receiveShadow = car.wheel_fl.castShadow = true;
    this.scene.add( car.wheel_fl );
    car.wheel_fl_constraint = new Physijs.DOFConstraint(
      car.wheel_fl, car.body, new THREE.Vector3( -3.5, 6.5, 5 )
    );
    this.scene.addConstraint( car.wheel_fl_constraint );
    car.wheel_fl_constraint.setAngularLowerLimit({ x: 0, y: 0, z: 1 });
    car.wheel_fl_constraint.setAngularUpperLimit({ x: 0, y: 0, z: 0 });
    
    car.wheel_fr = new Physijs.CylinderMesh(
      wheel_geometry,
      wheel_material,
      500
    );
    car.wheel_fr.rotation.x = Math.PI / 2;
    car.wheel_fr.position.set( -3.5, 6.5, -5 );
    car.wheel_fr.receiveShadow = car.wheel_fr.castShadow = true;
    this.scene.add( car.wheel_fr );
    car.wheel_fr_constraint = new Physijs.DOFConstraint(
      car.wheel_fr, car.body, new THREE.Vector3( -3.5, 6.5, -5 )
    );
    this.scene.addConstraint( car.wheel_fr_constraint );
    car.wheel_fr_constraint.setAngularLowerLimit({ x: 0, y: 0, z: 1 });
    car.wheel_fr_constraint.setAngularUpperLimit({ x: 0, y: 0, z: 0 });
    
    car.wheel_bl = new Physijs.CylinderMesh(
      wheel_geometry,
      wheel_material,
      500
    );
    car.wheel_bl.rotation.x = Math.PI / 2;
    car.wheel_bl.position.set( 3.5, 6.5, 5 );
    car.wheel_bl.receiveShadow = car.wheel_bl.castShadow = true;
    this.scene.add( car.wheel_bl );
    car.wheel_bl_constraint = new Physijs.DOFConstraint(
      car.wheel_bl, car.body, new THREE.Vector3( 3.5, 6.5, 5 )
    );
    this.scene.addConstraint( car.wheel_bl_constraint );
    car.wheel_bl_constraint.setAngularLowerLimit({ x: 0, y: 0, z: 0 });
    car.wheel_bl_constraint.setAngularUpperLimit({ x: 0, y: 0, z: 0 });
    
    car.wheel_br = new Physijs.CylinderMesh(
      wheel_geometry,
      wheel_material,
      500
    );
    car.wheel_br.rotation.x = Math.PI / 2;
    car.wheel_br.position.set( 3.5, 6.5, -5 );
    car.wheel_br.receiveShadow = car.wheel_br.castShadow = true;
    this.scene.add( car.wheel_br );
    car.wheel_br_constraint = new Physijs.DOFConstraint(
      car.wheel_br, car.body, new THREE.Vector3( 3.5, 6.5, -5 )
    );
    this.scene.addConstraint( car.wheel_br_constraint );
    car.wheel_br_constraint.setAngularLowerLimit({ x: 0, y: 0, z: 0 });
    car.wheel_br_constraint.setAngularUpperLimit({ x: 0, y: 0, z: 0 });
    
    document.addEventListener(
      'keydown',
      function( ev ) {
        switch( ev.keyCode ) {
          case 37:
            // Left
            car.wheel_fl_constraint.setAngularLowerLimit({ x: 0, y: Math.PI / 8, z: 1 });
            car.wheel_fl_constraint.setAngularUpperLimit({ x: 0, y: Math.PI / 8, z: 0 });

            car.wheel_fr_constraint.setAngularLowerLimit({ x: 0, y: Math.PI / 8, z: 1 });
            car.wheel_fr_constraint.setAngularUpperLimit({ x: 0, y: Math.PI / 8, z: 0 });
            break;
          
          case 39:
            // Right
            car.wheel_fl_constraint.setAngularLowerLimit({ x: 0, y: -Math.PI / 8, z: 1 });
            car.wheel_fl_constraint.setAngularUpperLimit({ x: 0, y: -Math.PI / 8, z: 0 });

            car.wheel_fr_constraint.setAngularLowerLimit({ x: 0, y: -Math.PI / 8, z: 1 });
            car.wheel_fr_constraint.setAngularUpperLimit({ x: 0, y: -Math.PI / 8, z: 0 });
            break;
          
          case 38:
            // Up
            car.wheel_bl_constraint.configureAngularMotor( 2, 1, 0, 5, 2000 );
            car.wheel_br_constraint.configureAngularMotor( 2, 1, 0, 5, 2000 );
            car.wheel_bl_constraint.enableAngularMotor( 2 );
            car.wheel_br_constraint.enableAngularMotor( 2 );
            break;
          
          case 40:
            // Down
            car.wheel_bl_constraint.configureAngularMotor( 2, 1, 0, -5, 2000 );
            car.wheel_br_constraint.configureAngularMotor( 2, 1, 0, -5, 2000 );
            car.wheel_bl_constraint.enableAngularMotor( 2 );
            //car.wheel_br_constraint.enableAngularMotor( 2 );
            break;
        }
      }
    );
    
    document.addEventListener(
      'keyup',
      function( ev ) {
        switch( ev.keyCode ) {
          case 37:
            // Left
            car.wheel_fl_constraint.setAngularLowerLimit({ x: 0, y: 0, z: 1 });
            car.wheel_fl_constraint.setAngularUpperLimit({ x: 0, y: 0, z: 0 });

            car.wheel_fr_constraint.setAngularLowerLimit({ x: 0, y: 0, z: 1 });
            car.wheel_fr_constraint.setAngularUpperLimit({ x: 0, y: 0, z: 0 });
            break;
          
          case 39:
            // Right
            car.wheel_fl_constraint.setAngularLowerLimit({ x: 0, y: 0, z: 1 });
            car.wheel_fl_constraint.setAngularUpperLimit({ x: 0, y: 0, z: 0 });

            car.wheel_fr_constraint.setAngularLowerLimit({ x: 0, y: 0, z: 1 });
            car.wheel_fr_constraint.setAngularUpperLimit({ x: 0, y: 0, z: 0 });
            break;
          
          case 38:
            // Up
            car.wheel_bl_constraint.disableAngularMotor( 2 );
            car.wheel_br_constraint.disableAngularMotor( 2 );
            break;
          
          case 40:
            // Down
            car.wheel_bl_constraint.disableAngularMotor( 2 );
            car.wheel_br_constraint.disableAngularMotor( 2 );
            break;
        }
      }
    );

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
    this.populateSceneDrivingSim();    
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
