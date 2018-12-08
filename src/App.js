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

    this.camera.position.set( 180, 100, 180 );
    this.camera.lookAt( this.scene.position );

    this.scene.setGravity(new THREE.Vector3( 0, -50, 0 ));


    const STANCE_L = 16;
    const STANCE_W = 12;

    const MAX_VEL = 200;
    const TORQUE = 2000;

    const CAR_WEIGHT = 5000;
    const WHEEL_WEIGHT = 150;
    const FRICTION = 3;
    
    let car = {};
    let ground_material, ground, car_material, wheel_material, wheel_geometry;
    
    // Materials
    ground_material = Physijs.createMaterial(
      new THREE.MeshNormalMaterial(),
      FRICTION, // high friction
      .4 // low restitution
    );
    
    // Ground
    ground = new Physijs.BoxMesh(
      new THREE.BoxGeometry(2000, 1, 2000),
      ground_material,
      0 // mass
    );
    this.scene.add( ground );

    
    
    // Car
    car_material = Physijs.createMaterial(
      new THREE.MeshNormalMaterial(),
      0.8, // high friction
      .2 // low restitution
    );
    
    wheel_material = Physijs.createMaterial(
      new THREE.MeshNormalMaterial(),
      FRICTION, // high friction
      .5 // medium restitution
    );
    wheel_geometry = new THREE.CylinderGeometry( 2, 2, 1, 8 );
    
    car.body = new Physijs.BoxMesh(
      new THREE.BoxGeometry( STANCE_L + 5, 4, STANCE_W - 3 ),
      car_material,
      CAR_WEIGHT
    );
    car.body.position.y = 8;
    this.scene.add( car.body );
    
    car.wheel_fl = new Physijs.CylinderMesh(
      wheel_geometry,
      wheel_material,
      WHEEL_WEIGHT
    );
    car.wheel_fl.rotation.x = Math.PI / 2;
    car.wheel_fl.position.set( -STANCE_L/2, 6.5, STANCE_W/2 );
    
    this.scene.add( car.wheel_fl );
    car.wheel_fl_constraint = new Physijs.DOFConstraint(
      car.wheel_fl, car.body, new THREE.Vector3( -STANCE_L/2, 6.5, STANCE_W/2 )
    );
    this.scene.addConstraint( car.wheel_fl_constraint );
    car.wheel_fl_constraint.setAngularLowerLimit({ x: 0, y: 0, z: 1 });
    car.wheel_fl_constraint.setAngularUpperLimit({ x: 0, y: 0, z: 0 });
    
    car.wheel_fr = new Physijs.CylinderMesh(
      wheel_geometry,
      wheel_material,
      WHEEL_WEIGHT
    );
    car.wheel_fr.rotation.x = Math.PI / 2;
    car.wheel_fr.position.set( -STANCE_L/2, 6.5, -STANCE_W/2 );
    
    this.scene.add( car.wheel_fr );
    car.wheel_fr_constraint = new Physijs.DOFConstraint(
      car.wheel_fr, car.body, new THREE.Vector3( -STANCE_L/2, 6.5, -STANCE_W/2 )
    );
    this.scene.addConstraint( car.wheel_fr_constraint );
    car.wheel_fr_constraint.setAngularLowerLimit({ x: 0, y: 0, z: 1 });
    car.wheel_fr_constraint.setAngularUpperLimit({ x: 0, y: 0, z: 0 });
    
    car.wheel_bl = new Physijs.CylinderMesh(
      wheel_geometry,
      wheel_material,
      WHEEL_WEIGHT
    );
    car.wheel_bl.rotation.x = Math.PI / 2;
    car.wheel_bl.position.set( STANCE_L/2, 6.5, STANCE_W/2 );
    
    this.scene.add( car.wheel_bl );
    car.wheel_bl_constraint = new Physijs.DOFConstraint(
      car.wheel_bl, car.body, new THREE.Vector3( STANCE_L/2, 6.5, STANCE_W/2 )
    );
    this.scene.addConstraint( car.wheel_bl_constraint );
    car.wheel_bl_constraint.setAngularLowerLimit({ x: 0, y: 0, z: 0 });
    car.wheel_bl_constraint.setAngularUpperLimit({ x: 0, y: 0, z: 0 });
    
    car.wheel_br = new Physijs.CylinderMesh(
      wheel_geometry,
      wheel_material,
      WHEEL_WEIGHT
    );
    car.wheel_br.rotation.x = Math.PI / 2;
    car.wheel_br.position.set( STANCE_L/2, 6.5, -STANCE_W/2 );
    
    this.scene.add( car.wheel_br );
    car.wheel_br_constraint = new Physijs.DOFConstraint(
      car.wheel_br, car.body, new THREE.Vector3( STANCE_L/2, 6.5, -STANCE_W/2 )
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
            car.wheel_bl_constraint.configureAngularMotor( 2, 1, 0, MAX_VEL, TORQUE );
            car.wheel_br_constraint.configureAngularMotor( 2, 1, 0, MAX_VEL, TORQUE );
            car.wheel_bl_constraint.enableAngularMotor( 2 );
            car.wheel_br_constraint.enableAngularMotor( 2 );
            break;
          
          case 40:
            // Down
            car.wheel_bl_constraint.configureAngularMotor( 2, 1, 0, -MAX_VEL, TORQUE );
            car.wheel_br_constraint.configureAngularMotor( 2, 1, 0, -MAX_VEL, TORQUE );
            car.wheel_bl_constraint.enableAngularMotor( 2 );
            car.wheel_br_constraint.enableAngularMotor( 2 );
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
