/* global THREE */

import CameraRenderer from './CameraRenderer'

const DEFAULT_FOLLOW_DIST = 45;
const FOLLOW_HEIGHT = 15;
const LOOK_HEIGHT = 8;

const ANGULAR_VELOCITY_HISTORY_LENGTH = 10
const SMOOTHED_CAM_STRENGTH = 0.1

const ORBIT_START_DELAY = 3300
const ORBIT_DISTANCE = 60
const ORBIT_RATE = 1 / 2000

const CAMERA_MODES = {
  FIRST_PERSON: 'FIRST_PERSON',
  FOLLOW: 'FOLLOW',
  ORBIT: 'ORBIT',
}

class FollowCameraRenderer extends CameraRenderer {

  state = {
    cameraMode: CAMERA_MODES.FOLLOW
  }

  constructor( props ) {
    super( props );
    this.vehicle = this.props.scene.vehicles[this.props.vehicleIndex];
    this.$followObject = this.vehicle.$chassis;
    this.followDistance = this.vehicle.followDistance || DEFAULT_FOLLOW_DIST;

    this.angularVelHistory = [];
  }

  componentDidUpdate( prevProps ) {
    if ( this.props.vehicleFinished && this.props.vehicleFinished !== prevProps.vehicleFinished ) {
      // Switch to orbit after a short delay
      setTimeout( this.startOrbit, ORBIT_START_DELAY )
    }
  }

  startOrbit = () => {
    this.$scene.add( this.$camera );
    this.setState({ cameraMode: CAMERA_MODES.ORBIT });
  }

  shouldComponentUpdate( nextProps ) {
    //Only update if vehicleFinished changes
    return this.props.vehicleFinished !== nextProps.vehicleFinished;
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
    const targetRotation = Math.atan2(camTargetPosition.z - position.z, camTargetPosition.x - position.x) + this.getCamSmoothingFactor()
    
    this.$camera.position.set(
      position.x + Math.cos(targetRotation) * -this.followDistance,
      position.y + FOLLOW_HEIGHT, 
      position.z + Math.sin(targetRotation) * -this.followDistance
    );

    const lookPosition = new THREE.Vector3( position.x, position.y + LOOK_HEIGHT, position.z )
    this.$camera.lookAt( lookPosition )
  }

  stepOrbit() {
    const { position } = this.$followObject;
    const rotation = performance.now() * ORBIT_RATE; //Drive rotation based on system timer

    this.$camera.position.set(
      position.x + Math.cos(rotation) * -ORBIT_DISTANCE,
      position.y + FOLLOW_HEIGHT, 
      position.z + Math.sin(rotation) * -ORBIT_DISTANCE
    );

    const lookPosition = new THREE.Vector3( position.x, position.y + LOOK_HEIGHT, position.z )
    this.$camera.lookAt( lookPosition )
  }

  step() {
    switch( this.state.cameraMode ) {
      case CAMERA_MODES.FOLLOW:
        this.stepFollowSmoothed();
        break;

      case CAMERA_MODES.ORBIT:
        this.stepOrbit();
        break;

      default:
        break;
    }
    
    super.step();
  }

  toggleFirstPersonMode() {
    if ( this.state.cameraMode === CAMERA_MODES.FIRST_PERSON ) {
      this.$scene.add( this.$camera );
      this.setState({ cameraMode: CAMERA_MODES.FIRST_PERSON });
    } else if ( this.state.cameraMode === CAMERA_MODES.FOLLOW ){
      this.$camera.position.set( this.vehicle.firstPersonPosition[0], this.vehicle.firstPersonPosition[1], this.vehicle.firstPersonPosition[2] );
      this.$camera.rotation.set( 0, -Math.PI / 2, 0 );
      this.vehicle.$body.add( this.$camera );
      this.setState({ cameraMode: CAMERA_MODES.FIRST_PERSON });
    }
  }

  onClick = () => {
    this.toggleFirstPersonMode()
  }
}

export default FollowCameraRenderer;