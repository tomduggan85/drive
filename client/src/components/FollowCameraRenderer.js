/* global THREE Physijs */

import CameraRenderer from './CameraRenderer'

const DEFAULT_FOLLOW_DIST = 45;
const FOLLOW_HEIGHT = 15;

class FollowCameraRenderer extends CameraRenderer {

  constructor( props ) {
    super( props );
    const vehicle = this.props.scene.vehicles[this.props.vehicleIndex];
    this.$followObject = vehicle.$chassis;
    this.followDistance = vehicle.followDistance || DEFAULT_FOLLOW_DIST
  }

  stepFollow() {

    /*
      TODO #1: Rewrite this to use a forward vector from $followObject's world transform, flatten that (zero the Y-component),
      and use that for targetAngle, as $followObject.rotation.y has odd range problems (gimbal lock?).

      TODO #2: Incorporate angular velocity into target rotation, so the camera yaw "lags" a little bit as the vehicle swivels

      TODO #3: Fix the bug where the camera flips to face the front of the vehicle when the vehicle is upside down (relates to #1).
    */
    const { position } = this.$followObject;
    const rotation = this.$followObject.rotation.y;
    let targetRotation = -rotation// - 0.4;

    if ( Math.abs( this.$followObject.rotation.x)  > Math.PI/2 ) {
      //Above-mentioned range issues
      targetRotation = Math.PI + rotation;
    }

    /*const angularVelocity = this.$followObject.getAngularVelocity().y;
    const threshold = 0.5;
    if (angularVelocity > threshold) {
      targetRotation += (angularVelocity-threshold) * 0.25;
    }
    else if (angularVelocity < -threshold) {
      targetRotation += (angularVelocity+threshold) * 0.25; 
    }*/
    
    this.$camera.position.set(
      position.x + Math.cos(targetRotation) * -this.followDistance,
      position.y + FOLLOW_HEIGHT, 
      position.z + Math.sin(targetRotation) * -this.followDistance
    );

    const lookPosition = new THREE.Vector3( position.x, position.y + 8, position.z )
    this.$camera.lookAt( lookPosition )
  }

  step() {
    this.stepFollow();
    super.step();
  }
}

export default FollowCameraRenderer;