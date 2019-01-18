/* global THREE */

import React from 'react';
import './CameraRenderer.css';

const DOWNSAMPLE_RATIO = 4; // Reduce all camera screen resolutions by 4, effectively bringing a 1280px laptop down to 320px wide, the most common N64 resolution

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
      1500 //Far plane
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

    return {
      screenWidth: width / DOWNSAMPLE_RATIO,
      screenHeight: height / DOWNSAMPLE_RATIO,
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

  onClick = () => {

  }

  render() {
    return (
      <div
        className='camera-renderer'
        ref={(el) => { this.$el = el; }}
        onClick={this.onClick}
      />
    );
  }
}


CameraRenderer.defaultProps = {
  position: [180, 100, 180],
};

export default CameraRenderer;