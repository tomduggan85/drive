/* global THREE */

import React from 'react';

class CameraRenderer extends React.Component {

  constructor( props ) {
    super( props );
    this.$scene = props.driveScene.$scene;
  }

  shouldComponentUpdate() {
    //Do not render() when props change, as props.driveScene changes should not result in DOM changes.
    return false;
  }

  componentDidMount() {
    const { width, height } = this.$el.getBoundingClientRect();

    this.$camera = new THREE.PerspectiveCamera(
      40,
      width/height,
      0.1,
      1000
    );

    this.$renderer = new THREE.WebGLRenderer();
    this.$renderer.setSize(width, height);
    this.$el.appendChild(this.$renderer.domElement);

    //Default view
    this.$camera.position.set( 180, 100, 180 );
    this.$camera.lookAt( this.$scene.position );

    //Zoom view
    //this.$camera.position.set( 20, 20, 50 );
    //this.$camera.lookAt( 40, 5, 0 );

    window.addEventListener( 'resize', this.onResize );

    if ( this.props.followCarIndex !== undefined ) {
      this.follow( this.props.driveScene.cars[this.props.followCarIndex].$chassis );
    }

    this.$scene.addEventListener('update', this.step);
  }

  follow( $sceneObject ) {
    this.$followObject = $sceneObject;
  }

  componentWillUnmount() {
    window.removeEventListener( 'resize', this.onResize );
  }

  onResize = () => {
    const { width, height } = this.$el.getBoundingClientRect();
    this.$camera.aspect = width / height;
    this.$camera.updateProjectionMatrix();

    this.$renderer.setSize( width, height );
  }

  stepFollow() {

    const { position } = this.$followObject;
    const rotation = this.$followObject.rotation.y;
    let targetRotation = -rotation;

    const angularVelocity = this.$followObject.getAngularVelocity().y;

    if ( Math.abs( this.$followObject.rotation.x)  > Math.PI/2 ) {
      //Gimbal lock / euler angles
      targetRotation = Math.PI + rotation;
    }

    //targetRotation += angularVelocity * 0.15;

    const DIST = -45;
    const HEIGHT = 15;
    
    this.$camera.position.set(
      position.x + Math.cos(targetRotation) * DIST,
      position.y + HEIGHT, 
      position.z + Math.sin(targetRotation) * DIST
    );

    this.$camera.lookAt(position )
  }

  step = () => {
    if ( this.$followObject ) {
      this.stepFollow();
    }

    this.$renderer.render(
      this.$scene,
      this.$camera
    );
  }

  render() {
    return (
      <div
        className='camera-renderer'
        ref={(el) => { this.$el = el; }}
      />
    );
  }
}

export default CameraRenderer;