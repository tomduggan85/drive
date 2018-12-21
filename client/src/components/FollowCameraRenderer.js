
import CameraRenderer from './CameraRenderer'

const FOLLOW_DIST = -45;
const FOLLOW_HEIGHT = 15;

class FollowCameraRenderer extends CameraRenderer {

  constructor( props ) {
    super( props );
    this.$followObject = this.props.driveScene.vehicles[this.props.vehicleIndex].$chassis;
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
    let targetRotation = -rotation - 0.4;

    if ( Math.abs( this.$followObject.rotation.x)  > Math.PI/2 ) {
      //Above-mentioned range issues
      targetRotation = Math.PI + rotation;
    }

    //const angularVelocity = this.$followObject.getAngularVelocity().y;
    //targetRotation += angularVelocity * 0.15;
    
    this.$camera.position.set(
      position.x + Math.cos(targetRotation) * FOLLOW_DIST,
      position.y + FOLLOW_HEIGHT, 
      position.z + Math.sin(targetRotation) * FOLLOW_DIST
    );

    this.$camera.lookAt(position )
  }

  step() {
    this.stepFollow();
    super.step();
  }
}

export default FollowCameraRenderer;