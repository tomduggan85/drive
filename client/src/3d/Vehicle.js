
/* global THREE Physijs */

import { VEHICLE_DEFS } from '../shared/Vehicles'

const SHOW_DEBUG_COLLISION_VOLUMES = false;

export class Vehicle {

  createChassis() {
    const { $scene, vehicleDef } = this;
    const chassisMaterial = Physijs.createMaterial(
      new THREE.MeshNormalMaterial(), 0.8, 0.4 //restitution
    );
    chassisMaterial.visible = SHOW_DEBUG_COLLISION_VOLUMES;

    //First shape is always the main chassis, additional shapes are added to it.
    this.$chassis = new Physijs.BoxMesh(
      new THREE.BoxGeometry( vehicleDef.chassisShapes[0].size.x, vehicleDef.chassisShapes[0].size.y, vehicleDef.chassisShapes[0].size.z ),
      chassisMaterial,
      vehicleDef.chassisMass
    );
    this.$chassis.position.set( vehicleDef.chassisShapes[0].offset.x, vehicleDef.chassisShapes[0].offset.y, vehicleDef.chassisShapes[0].offset.z )
    
    for ( let i = 1; i < vehicleDef.chassisShapes.length; i++ ) {
      const $shape = new Physijs.BoxMesh(
        new THREE.BoxGeometry( vehicleDef.chassisShapes[i].size.x, vehicleDef.chassisShapes[i].size.y, vehicleDef.chassisShapes[i].size.z ),
        chassisMaterial,
        50 //additional shapes are given an arbitrarily small mass
      );
      $shape.position.set( vehicleDef.chassisShapes[i].offset.x, vehicleDef.chassisShapes[i].offset.y, vehicleDef.chassisShapes[i].offset.z )

      this.$chassis.add($shape);
    }

    $scene.add( this.$chassis );
    this.loadChassisAsset();
  }

  loadChassisAsset() {
    const { chassisAsset: { uri, scale, position, rotation } } = this.vehicleDef;
    const $chassis = this.$chassis;

    this.loader.load(
      uri,
      ( { scene: asset } ) => {
        asset.scale.set(scale, scale, scale)
        asset.position.set( position.x, position.y, position.z );
        asset.rotation.set( rotation.x, rotation.y, rotation.z )
        $chassis.add( asset );
      },
      undefined,
      ( error ) => {
        console.error( error );
      }
    );
  }

  createWheel( isFront, isLeft ) {

    const z = this.vehicleDef.trackWidth / 2 * (isLeft ? -1 : 1);
    const y = this.vehicleDef.rideHeight;
    const x = this.vehicleDef.wheelBase / 2 * (isFront ? 1 : -1);

    if ( !this.wheelMaterial ) {
      this.wheelMaterial = Physijs.createMaterial(
        new THREE.MeshNormalMaterial(), this.vehicleDef.tireFriction, 0.5
      );
      this.wheelMaterial.visible = SHOW_DEBUG_COLLISION_VOLUMES;
    }
    
    if ( !this.wheelGeometry ) {
      this.wheelGeometry  = new THREE.CylinderGeometry( this.vehicleDef.wheelDiameter, this.vehicleDef.wheelDiameter, this.vehicleDef.wheelWidth, 50 );
    }

    const $wheel = new Physijs.CylinderMesh( this.wheelGeometry, this.wheelMaterial, this.vehicleDef.wheelMass );
    $wheel.rotation.x = Math.PI / 2;
    $wheel.position.set( x, y, z );
    
    this.$scene.add( $wheel );
    const constraint = new Physijs.DOFConstraint(
      $wheel, this.$chassis, new THREE.Vector3( x, y, z )
    );
    this.$scene.addConstraint( constraint, { disableCollision: true } );
    constraint.setAngularLowerLimit({ x: 0, y: 0, z: isFront ? 1 : 0 });
    constraint.setAngularUpperLimit({ x: 0, y: 0, z: 0 }); 

    this.loadWheelAsset( $wheel, isFront, isLeft );
    
    return { $wheel, constraint }
  }

  loadWheelAsset( $wheel, isFront, isLeft ) {
    const { wheelAsset: { uri, scale, position, rotation, flip } } = this.vehicleDef;

    this.loader.load(
      uri,
      ( { scene: asset } ) => {
        asset.scale.set(scale, scale, scale);
        if ( !isLeft ) {
          asset.scale[ flip ] *= -1;
        }
        asset.position.set( position.x, position.y, position.z );
        asset.rotation.set( rotation.x, rotation.y, rotation.z )
        $wheel.add( asset );
      },
      undefined,
      ( error ) => {
        console.error( error );
      }
    );
  }
  
  constructor( props ) {
    this.vehicleType = props.vehicleType;

    this.$scene = props.$scene;
    this.vehicleDef = VEHICLE_DEFS[ props.vehicleType ];
    this.keys = props.keys;

    this.loader = new THREE.GLTFLoader();
    this.createChassis();

    this.wheels = {
      'F': {
        'L': this.createWheel(true, true),
        'R': this.createWheel(true, false),
      },
      'R': {
        'L': this.createWheel(false, true),
        'R': this.createWheel(false, false),
      }
    }

    
    
    this.$chassis.rotation.set(props.rotation.x, props.rotation.y, props.rotation.z);
    this.$chassis.position.set(props.position.x, props.position.y, props.position.z);
    this.$chassis.__dirtyPosition = true;
    this.$chassis.__dirtyRotation = true;
    

    document.addEventListener( 'keydown', this.onKeyDown );
    document.addEventListener( 'keyup', this.onKeyUp );
  }

  onKeyDown = (e) => {
    switch( e.keyCode ) {
      case this.keys.left:
        this.onLeft();
        e.preventDefault();
        break;
      
      case this.keys.right:
        this.onRight();
        e.preventDefault();
        break;
      
      case this.keys.forward:
        this.onForward();
        break;
      
      case this.keys.reverse:
        this.onReverse();
        e.preventDefault();
        break;

      default:
        break;
    }
  }

  onKeyUp = (e) => {
    switch( e.keyCode ) {
      case this.keys.left:
      case this.keys.right:
        this.offSteer();
        e.preventDefault();
        break;
      
      case this.keys.forward:
      case this.keys.reverse:
        this.offGas();
        break;

      default:
        break;
    }
  }

  onForward() {
    const { maxVel, torque } = this.vehicleDef;
    Object.values(this.wheels.R).forEach(({ constraint }) => {
      constraint.configureAngularMotor( 2, 1, 0, -maxVel, torque );
      constraint.enableAngularMotor( 2 );
    });
  }

  onReverse() {
    const { maxVel, torque } = this.vehicleDef;
    Object.values(this.wheels.R).forEach(({ constraint }) => {
      constraint.configureAngularMotor( 2, 1, 0, maxVel, torque );
      constraint.enableAngularMotor( 2 );
    });
  }

  offGas() {
    Object.values(this.wheels.R).forEach(({ constraint }) => {
      constraint.disableAngularMotor( 2 );
    });
  }

  onLeft() {
    const { steerAngle } = this.vehicleDef;
    Object.values(this.wheels.F).forEach(({ constraint }) => {
      constraint.setAngularLowerLimit({ x: 0, y: steerAngle, z: 1 });
      constraint.setAngularUpperLimit({ x: 0, y: steerAngle, z: 0 });
    });
  }

  onRight() {
    const { steerAngle } = this.vehicleDef;
    Object.values(this.wheels.F).forEach(({ constraint }) => {
      constraint.setAngularLowerLimit({ x: 0, y: -steerAngle, z: 1 });
      constraint.setAngularUpperLimit({ x: 0, y: -steerAngle, z: 0 });
    });
  }

  offSteer() {
    Object.values(this.wheels.F).forEach(({ constraint }) => {
      constraint.setAngularLowerLimit({ x: 0, y: 0, z: 1 });
      constraint.setAngularUpperLimit({ x: 0, y: 0, z: 0 });
    });
  }
}
