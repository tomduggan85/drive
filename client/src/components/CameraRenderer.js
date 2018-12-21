/* global THREE */

import React from 'react';
import './CameraRenderer.css';

const RETRO_SCREEN_RESOLUTION = 320; //Most common Nintendo 64 resolution

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
    const {
      screenWidth,
      screenHeight,
      aspectRatio
    } = this.getScreenDims();

    this.$camera = new THREE.PerspectiveCamera(
      40, //Field of view
      aspectRatio, //Aspect ratio
      0.1, //Near plane
      1000 //Far plane
    );

    console.error(screenWidth, screenHeight);

    this.$renderer = new THREE.WebGLRenderer();
    this.$renderer.setSize(screenWidth, screenHeight);
    this.$el.appendChild(this.$renderer.domElement);

    //Default birds-eye view
    this.$camera.position.set( 180, 100, 180 );
    this.$camera.lookAt( this.$scene.position );

    window.addEventListener( 'resize', this.onResize );
    this.$scene.addEventListener('update', this.step.bind( this ));
  }

  getScreenDims() {
    const { width, height } = this.$el.getBoundingClientRect();
    const aspectRatio = width/height;
    const screenWidth = Math.min(RETRO_SCREEN_RESOLUTION, width);
    const screenHeight = screenWidth / aspectRatio;

    return {
      screenWidth,
      screenHeight,
      aspectRatio
    }
  }

  componentWillUnmount() {
    window.removeEventListener( 'resize', this.onResize );
  }

  onResize = () => {
    const {
      screenWidth,
      screenHeight,
      aspectRatio
    } = this.getScreenDims();

    this.$camera.aspect = aspectRatio;
    this.$camera.updateProjectionMatrix();
    this.$renderer.setSize( screenWidth, screenHeight );
  }

  step() {
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