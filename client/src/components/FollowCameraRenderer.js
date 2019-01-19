/* global THREE */

import CameraRenderer from './CameraRenderer'

const DEFAULT_FOLLOW_DIST = 45;
const FOLLOW_HEIGHT = 15;
const LOOK_HEIGHT = 8;

class FollowCameraRenderer extends CameraRenderer {

  state = {
    firstPersonMode: false
  }

  constructor( props ) {
    super( props );
    this.vehicle = this.props.scene.vehicles[this.props.vehicleIndex];
    this.$followObject = this.vehicle.$chassis;
    this.followDistance = this.vehicle.followDistance || DEFAULT_FOLLOW_DIST

  }

  stepFollow() {
    this.$followObject.updateMatrixWorld()
    const { position } = this.$followObject;

    const targetPosition = this.$followObject.localToWorld(new THREE.Vector3(-this.followDistance, FOLLOW_HEIGHT, 0))
    this.$camera.position.copy(targetPosition)
    
    const lookPosition = new THREE.Vector3( position.x, position.y + LOOK_HEIGHT, position.z )
    this.$camera.lookAt( lookPosition )
  }

  step() {
    if ( !this.state.firstPersonMode ) {
      this.stepFollow();
    }

    super.step();
  }

  toggleFirstPersonMode() {
    if ( this.state.firstPersonMode ) {
      this.$scene.add( this.$camera );
      this.setState({ firstPersonMode: false });
    } else {
      this.$camera.position.set( this.vehicle.firstPersonPosition[0], this.vehicle.firstPersonPosition[1], this.vehicle.firstPersonPosition[2] );
      this.$camera.rotation.set( 0, -Math.PI / 2, 0 );
      this.vehicle.$body.add( this.$camera );
      this.setState({ firstPersonMode: true });
    }
  }

  onClick = () => {
    this.toggleFirstPersonMode()
  }
}

export default FollowCameraRenderer;