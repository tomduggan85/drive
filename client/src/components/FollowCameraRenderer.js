/* global THREE */

import CameraRenderer from './CameraRenderer'

const DEFAULT_FOLLOW_DIST = 45;
const FOLLOW_HEIGHT = 15;
const LOOK_HEIGHT = 8;

const ANGULAR_VELOCITY_HISTORY_LENGTH = 10
const SMOOTHED_CAM_STRENGTH = 0.1

class FollowCameraRenderer extends CameraRenderer {

  state = {
    firstPersonMode: false
  }

  constructor( props ) {
    super( props );
    this.vehicle = this.props.scene.vehicles[this.props.vehicleIndex];
    this.$followObject = this.vehicle.$chassis;
    this.followDistance = this.vehicle.followDistance || DEFAULT_FOLLOW_DIST;

    this.angularVelHistory = [];
  }

  stepFollowFixed() {
    this.$followObject.updateMatrixWorld()
    const { position } = this.$followObject;

    const targetPosition = this.$followObject.localToWorld(new THREE.Vector3(-this.followDistance, FOLLOW_HEIGHT, 0))
    this.$camera.position.copy(targetPosition)
    
    const lookPosition = new THREE.Vector3( position.x, position.y + LOOK_HEIGHT, position.z )
    this.$camera.lookAt( lookPosition )
  }

  getAveragedAngularVelocity() {
    this.angularVelHistory = [ 
      ...this.angularVelHistory.slice(-ANGULAR_VELOCITY_HISTORY_LENGTH + 1),
      this.$followObject.getAngularVelocity().y
    ];
    const { length } = this.angularVelHistory;
    
    return this.angularVelHistory.reduce((accum, v) => accum + v / length, 0);
  }

  getCamSmoothingFactor() {
    const angularVelocity = this.getAveragedAngularVelocity()
    const threshold = 0.1;

    if (angularVelocity > threshold) {
      return (angularVelocity-threshold) * SMOOTHED_CAM_STRENGTH;
    }
    else if (angularVelocity < -threshold) {
      return (angularVelocity+threshold) * SMOOTHED_CAM_STRENGTH; 
    }
    else {
      return 0
    }
  }

  stepFollowSmoothed() {
    this.$followObject.updateMatrixWorld()
    const { position } = this.$followObject;

    const camTargetPosition = this.$followObject.localToWorld(new THREE.Vector3(this.followDistance, FOLLOW_HEIGHT, 0))
    const targetRotation = Math.atan2(camTargetPosition.z - position.z, camTargetPosition.x - position.x) + this.getCamSmoothingFactor() + 2.5 //DO NOT COMMIT
    
    this.$camera.position.set(
      position.x + Math.cos(targetRotation) * -this.followDistance,
      position.y + FOLLOW_HEIGHT, 
      position.z + Math.sin(targetRotation) * -this.followDistance
    );

    const lookPosition = new THREE.Vector3( position.x, position.y + LOOK_HEIGHT, position.z )
    this.$camera.lookAt( lookPosition )
  }

  step() {
    if ( !this.state.firstPersonMode ) {
      this.stepFollowSmoothed();
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