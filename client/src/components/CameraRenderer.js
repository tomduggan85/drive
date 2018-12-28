/* global THREE */

import React from 'react';
import './CameraRenderer.css';

const RETRO_SCREEN_WIDTH = 320; //Most common Nintendo 64 resolution

class CameraRenderer extends React.Component {

  constructor( props ) {
    super( props );
    this.$scene = props.scene.$scene;
  }

  shouldComponentUpdate() {
    //Do not render() when props change, as props.scene changes should not result in DOM changes.
    return false;
  }

  componentDidMount() {
    const {
      screenWidth,
      screenHeight,
      aspectRatio
    } = this.getScreenDims();
    const { position } = this.props;

    this.$camera = new THREE.PerspectiveCamera(
      40, //Field of view
      aspectRatio, //Aspect ratio
      0.1, //Near plane
      1000 //Far plane
    );

    this.$renderer = new THREE.WebGLRenderer({ alpha: !!this.props.transparent });
    this.$renderer.setSize(screenWidth, screenHeight);
    this.$el.appendChild(this.$renderer.domElement);


    if ( this.props.transparent) {
      this.$renderer.setClearColor( 0xffffff, 0);
    }

    //Default birds-eye view
    this.$camera.position.set( position[0], position[1], position[2] );
    this.$camera.lookAt( this.$scene.position );

    window.addEventListener( 'resize', this.onResize );
    this.step = this.step.bind(this);
    this.step();
  }

  getScreenDims() {
    const { width, height } = this.$el.getBoundingClientRect();
    const aspectRatio = width/height;
    const screenWidth = Math.min(RETRO_SCREEN_WIDTH, width);
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
    requestAnimationFrame(this.step)
    
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


CameraRenderer.defaultProps = {
  position: [180, 100, 180],
};

export default CameraRenderer;