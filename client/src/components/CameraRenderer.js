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
      40, //Field of view
      width/height, //Aspect ratio
      0.1, //Near plane
      1000 //Far plane
    );

    this.$renderer = new THREE.WebGLRenderer();
    this.$renderer.setSize(width, height);
    this.$el.appendChild(this.$renderer.domElement);

    //Default birds-eye view
    this.$camera.position.set( 180, 100, 180 );
    this.$camera.lookAt( this.$scene.position );

    window.addEventListener( 'resize', this.onResize );
    this.$scene.addEventListener('update', this.step.bind( this ));
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