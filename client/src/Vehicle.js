
/* global THREE Physijs */

//Todo: rename to VEHICLE_DEFS
const TUNING = {
  

  its_a_volvo: {
    wheelBase: 19,
    trackWidth: 11.5,
    maxVel: 200,
    torque: 3000,
    chassisMass: 5000,
    chassisShapes: [
      { offset: { x: -1, y: 8, z: 0 }, size: { x: 33, y: 3, z: 12} },
      { offset: { x: 0, y: 2, z: 0 }, size: { x: 31, y: 2, z: 11} },
      { offset: { x: -5, y: 4, z: 0 }, size: { x: 18, y: 2, z: 10} },
      { offset: { x: -5, y: 5.5, z: 0 }, size: { x: 15, y: 1, z: 8.5} },
    ],
    wheelMass: 150,
    tireFriction: 3,
    steerAngle: Math.PI / 8,
    chassisAsset: {
      uri: '/assets/3d/wagon_chassis/scene.gltf',
      scale: 7.5,
      position: {x: -1.9, y: -3.5, z: -1.2},
      rotation: {x: 0, y: Math.PI / 2, z: 0},
    },
    wheelAsset: {
      uri: '/assets/3d/wagon_wheel/scene.gltf',
      scale: 4.74,
      position: {x: 0, y: 0, z: 0},
      rotation: {x: 0, y: 0, z: 0},
      flip: 'z',
    },
    wheelDiameter: 2.0,
    wheelWidth: 1.3,
    rideHeight: 6.6,
  },

  lada: {
    wheelBase: 18,
    trackWidth: 11,
    maxVel: 200,
    torque: 3000,
    chassisMass: 5000,
    chassisShapes: [
      { offset: { x: -1, y: 8, z: 0 }, size: { x: 29, y: 3, z: 12} },
      { offset: { x: -0.5, y: 2, z: 0 }, size: { x: 29, y: 2, z: 12} },
      { offset: { x: -1, y: 4, z: 0 }, size: { x: 15, y: 3, z: 10} },
      { offset: { x: -1, y: 6, z: 0 }, size: { x: 12, y: 1.5, z: 8.5} },
    ],
    wheelMass: 150,
    tireFriction: 3,
    steerAngle: Math.PI / 8,
    chassisAsset: {
      uri: '/assets/3d/lada_chassis/scene.gltf',
      scale: 0.069,
      position: {x: -0.3, y: -3.8, z: 0},
      rotation: {x: 0, y: 0, z: 0},
    },
    wheelAsset: {
      uri: '/assets/3d/lada_wheel/scene.gltf',
      scale: 0.061,
      position: {x: 0.05, y: 0.05, z: -0.05},
      rotation: {x: Math.PI / 2, y: 0, z: 0},
      flip: 'z',
    },
    wheelDiameter: 2.0,
    wheelWidth: 1.3,
    rideHeight: 6.7,
  },

  '50s': {
    wheelBase: 19.5,
    trackWidth: 9.8,
    maxVel: 200,
    torque: 3000,
    chassisMass: 5000,
    chassisShapes: [
      { offset: { x: -1, y: 8, z: 0 }, size: { x: 33.5, y: 3, z: 12} },
      { offset: { x: 0, y: 2, z: 0 }, size: { x: 32, y: 2, z: 12} },
      { offset: { x: -1, y: 4, z: 0 }, size: { x: 15, y: 3, z: 10} },
      { offset: { x: -1, y: 6, z: 0 }, size: { x: 12, y: 1.5, z: 8.5} },
    ],
    wheelMass: 150,
    tireFriction: 3,
    steerAngle: Math.PI / 8,
    chassisAsset: {
      uri: '/assets/3d/50s_chassis/scene.gltf',
      scale: 0.048,
      position: {x: 1.5, y: -2, z: 0},
      rotation: {x: 0, y: Math.PI / 2, z: 0},
    },
    wheelAsset: {
      uri: '/assets/3d/lada_wheel/scene.gltf',
      scale: 0.064,
      position: {x: 0.05, y: 0.05, z: -0.05},
      rotation: {x: Math.PI / 2, y: 0, z: 0},
      flip: 'z',
    },
    wheelDiameter: 2.1,
    wheelWidth: 1.3,
    rideHeight: 7,
  },

  'pontiac': {
    wheelBase: 19.0,
    trackWidth: 10.5,
    maxVel: 200,
    torque: 3000,
    chassisMass: 5000,
    chassisShapes: [
      { offset: { x: -1, y: 8, z: 0 }, size: { x: 33.5, y: 3, z: 11.5} },
      { offset: { x: 0, y: 2, z: 0 }, size: { x: 30.8, y: 2, z: 11.5} },
      { offset: { x: -3, y: 3.8, z: 0 }, size: { x: 13, y: 3, z: 10} },
      { offset: { x: -3, y: 5.5, z: 0 }, size: { x: 11, y: 1.5, z: 8.5} },
    ],
    wheelMass: 150,
    tireFriction: 3,
    steerAngle: Math.PI / 8,
    chassisAsset: {
      uri: '/assets/3d/pontiac_chassis/scene.gltf',
      scale: 0.147,
      position: {x: 1, y: -2.9, z: 0.45},
      rotation: {x: 0, y: 0, z: 0},
    },
    wheelAsset: {
      uri: '/assets/3d/pontiac_wheel/scene.gltf',
      scale: 0.145,
      position: {x: 0, y: 0, z: 0},
      rotation: {x: Math.PI / 2, y: 0, z: 0},
      flip: 'z',
    },
    wheelDiameter: 2.2,
    wheelWidth: 1.3,
    rideHeight: 7,
  },

  woodywagon: {
    wheelBase: 19.5,
    trackWidth: 10.5,
    maxVel: 200,
    torque: 3000,
    chassisMass: 5000,
    chassisShapes: [
      { offset: { x: -1, y: 8, z: 0 }, size: { x: 34, y: 3, z: 11.5} },
      { offset: { x: 0, y: 2, z: 0 }, size: { x: 33, y: 1.5, z: 11.5} },
      { offset: { x: -6, y: 4, z: 0 }, size: { x: 20, y: 2, z: 10} },
      { offset: { x: -5, y: 5.5, z: 0 }, size: { x: 15, y: 1, z: 8.5} },
    ],
    wheelMass: 150,
    tireFriction: 3,
    steerAngle: Math.PI / 8,
    chassisAsset: {
      uri: '/assets/3d/woody_wagon_chassis/scene.gltf',
      scale: 4.75,
      position: {x: 12.2, y: -3.4, z: -6.4},
      rotation: {x: 0, y: Math.PI / 2, z: 0},
    },
    wheelAsset: {
      uri: '/assets/3d/woody_wagon_wheel/scene.gltf',
      scale: -4.1,
      position: {x: 0, y: 0, z: 0},
      rotation: {x: 0, y: 0, z: Math.PI / 2},
      flip: 'x',
    },
    wheelDiameter: 2.0,
    wheelWidth: 1.3,
    rideHeight: 6.9,
  },
};

const SHOW_DEBUG_COLLISION_VOLUMES = false;

export const VEHICLE_TYPES = Object.keys( TUNING );

export class Vehicle {

  createChassis() {
    const { scene, tuning } = this;
    const chassisMaterial = Physijs.createMaterial(
      new THREE.MeshNormalMaterial(), 0.8, 0.4 //restitution
    );
    chassisMaterial.visible = SHOW_DEBUG_COLLISION_VOLUMES;

    //First shape is always the main chassis, additional shapes are added to it.
    this.$chassis = new Physijs.BoxMesh(
      new THREE.BoxGeometry( tuning.chassisShapes[0].size.x, tuning.chassisShapes[0].size.y, tuning.chassisShapes[0].size.z ),
      chassisMaterial,
      tuning.chassisMass
    );
    this.$chassis.position.set( tuning.chassisShapes[0].offset.x, tuning.chassisShapes[0].offset.y, tuning.chassisShapes[0].offset.z )
    
    for ( let i = 1; i < tuning.chassisShapes.length; i++ ) {
      const $shape = new Physijs.BoxMesh(
        new THREE.BoxGeometry( tuning.chassisShapes[i].size.x, tuning.chassisShapes[i].size.y, tuning.chassisShapes[i].size.z ),
        chassisMaterial,
        50 //additional shapes are given an arbitrarily small mass
      );
      $shape.position.set( tuning.chassisShapes[i].offset.x, tuning.chassisShapes[i].offset.y, tuning.chassisShapes[i].offset.z )

      this.$chassis.add($shape);
    }

    scene.add( this.$chassis );
    this.loadChassisAsset();
  }

  loadChassisAsset() {
    const { chassisAsset: { uri, scale, position, rotation } } = this.tuning;
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

    const z = this.tuning.trackWidth / 2 * (isLeft ? -1 : 1);
    const y = this.tuning.rideHeight;
    const x = this.tuning.wheelBase / 2 * (isFront ? 1 : -1);

    if ( !this.wheelMaterial ) {
      this.wheelMaterial = Physijs.createMaterial(
        new THREE.MeshNormalMaterial(), this.tuning.tireFriction, 0.5
      );
      this.wheelMaterial.visible = SHOW_DEBUG_COLLISION_VOLUMES;
    }
    
    if ( !this.wheelGeometry ) {
      this.wheelGeometry  = new THREE.CylinderGeometry( this.tuning.wheelDiameter, this.tuning.wheelDiameter, this.tuning.wheelWidth, 50 );
    }

    const $wheel = new Physijs.CylinderMesh( this.wheelGeometry, this.wheelMaterial, this.tuning.wheelMass );
    $wheel.rotation.x = Math.PI / 2;
    $wheel.position.set( x, y, z );
    
    this.scene.add( $wheel );
    const constraint = new Physijs.DOFConstraint(
      $wheel, this.$chassis, new THREE.Vector3( x, y, z )
    );
    this.scene.addConstraint( constraint, { disableCollision: true } );
    constraint.setAngularLowerLimit({ x: 0, y: 0, z: isFront ? 1 : 0 });
    constraint.setAngularUpperLimit({ x: 0, y: 0, z: 0 }); 

    this.loadWheelAsset( $wheel, isFront, isLeft );
    
    return { $wheel, constraint }
  }

  loadWheelAsset( $wheel, isFront, isLeft ) {
    const { wheelAsset: { uri, scale, position, rotation, flip } } = this.tuning;

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

    this.scene = props.scene;
    this.tuning = TUNING[ props.vehicleType ];
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
    const { maxVel, torque } = this.tuning;
    Object.values(this.wheels.R).forEach(({ constraint }) => {
      constraint.configureAngularMotor( 2, 1, 0, -maxVel, torque );
      constraint.enableAngularMotor( 2 );
    });
  }

  onReverse() {
    const { maxVel, torque } = this.tuning;
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
    const { steerAngle } = this.tuning;
    Object.values(this.wheels.F).forEach(({ constraint }) => {
      constraint.setAngularLowerLimit({ x: 0, y: steerAngle, z: 1 });
      constraint.setAngularUpperLimit({ x: 0, y: steerAngle, z: 0 });
    });
  }

  onRight() {
    const { steerAngle } = this.tuning;
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
