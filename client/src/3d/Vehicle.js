
/* global THREE Physijs */

import { VEHICLE_DEFS } from '../shared/Vehicles'

const SHOW_DEBUG_COLLISION_VOLUMES = false;

const CHASSIS_FRICTION = 0.8;
const CHASSIS_RESTITUTION = 0.4;

export class Vehicle {

  constructor( props ) {
    this.vehicleType = props.vehicleType;
    this.$scene = props.$scene;
    this.vehicleDef = VEHICLE_DEFS[ props.vehicleType ];
    this.keys = props.keys;
    this.loader = new THREE.GLTFLoader();

    this.followDistance = this.vehicleDef.followDistance;
    this.firstPersonPosition = this.vehicleDef.firstPersonPosition;

    this.createChassis();
    this.createBody();
    this.createSuspension();

    this.wheels = this.vehicleDef.wheels.map( this.createWheel );

    /*
      TODO: Move all scene objects ($chassis and wheels) by one single transformation matrix
      and mark all as dirty, to properly set starting position with no object jumps / glitches.
    */
    this.$chassis.rotation.set(props.rotation.x, props.rotation.y, props.rotation.z);
    this.$chassis.position.set(props.position.x, props.position.y, props.position.z);
    this.$chassis.__dirtyPosition = true;
    this.$chassis.__dirtyRotation = true;

    this.$body.rotation.set(props.rotation.x, props.rotation.y, props.rotation.z);
    this.$body.position.set(props.position.x, props.position.y, props.position.z);
    this.$body.__dirtyPosition = true;
    this.$body.__dirtyRotation = true;

    this.wheels.forEach(({ $wheel }) => {
      $wheel.rotation.set(props.rotation.x, props.rotation.y, props.rotation.z);
      $wheel.position.set(props.position.x, props.position.y, props.position.z);
      $wheel.__dirtyPosition = true;
      $wheel.__dirtyRotation = true;
    })
    
    document.addEventListener( 'keydown', this.onKeyDown );
    document.addEventListener( 'keyup', this.onKeyUp );
  }

  createChassis() {
    const { $scene, vehicleDef } = this;
    
    const chassisMaterial = Physijs.createMaterial(
      new THREE.MeshNormalMaterial(), CHASSIS_FRICTION, CHASSIS_RESTITUTION
    );
    chassisMaterial.visible = SHOW_DEBUG_COLLISION_VOLUMES;
    
    const { size, offset } = vehicleDef.chassisShape;
    this.$chassis = new Physijs.BoxMesh(
      new THREE.BoxGeometry( size.x, size.y, size.z ),
      chassisMaterial,
      vehicleDef.chassisMass
    );
    this.$chassis.position.set( offset.x, offset.y, offset.z )
    $scene.add(this.$chassis);
  }

  createBody() {
    const { $scene, vehicleDef } = this;
    const bodyMaterial = Physijs.createMaterial(
      new THREE.MeshNormalMaterial(), CHASSIS_FRICTION, CHASSIS_RESTITUTION
    );
    bodyMaterial.visible = SHOW_DEBUG_COLLISION_VOLUMES;

    /*
      The first shape in the bodyShapes is assumed to be the "main" shape, and gets all of the body mass.
      Each additional shape is given an arbitrary small mass, as they are usually the higher shapes
      and I want to keep the center of gravity low, for stability and realism.
    */

    const { size, offset } = vehicleDef.bodyShapes[0];
    this.$body = new Physijs.BoxMesh(
      new THREE.BoxGeometry( size.x, size.y, size.z ),
      bodyMaterial,
      vehicleDef.bodyMass
    );
    this.$body.position.set( offset.x, offset.y, offset.z )

    for ( let i = 1; i < vehicleDef.bodyShapes.length; i++ ) {
      const someSmallMass = 50;
      const { size, offset } = vehicleDef.bodyShapes[i];

      const $shape = new Physijs.BoxMesh(
        new THREE.BoxGeometry( size.x, size.y, size.z ),
        bodyMaterial,
        someSmallMass
      );
      $shape.position.set( offset.x, offset.y, offset.z )
      this.$body.add($shape);
    }

    //Add $body to the scene *after* adding all shapes to the $body, or PhysiJS won't combine them all into a single rigidBody.
    $scene.add( this.$body );
    this.loadBodyAsset();
  }

  createSuspension() {

    /*
      Create four linear spring constraints to connect the vehicle body to the chassis, to simulate a car suspension.
      This is not a realistic model, but it's a stable model.  A realistic model would be to connect the wheels to the chassis
      using individual springs so they can move up and down independently, and then fix the chassis and body together.
      Instead, all four wheels are fixed (though they can rotate) to the chassis, and the body is loosely connected using these springs.
      This provides a similar visual effect (body roll when turning, the body moving independently of the wheels when colliding), but has some
      limitations: when the car is upside down, the chassis and wheels bounce in the air, and the wheels can't move independently of one another
      and are instead always on the same plane.
      The downside of per-wheel suspension was instability in the physics engine - it's difficult to choose masses, when all of the car mass is applied to the 
      wheels via the springs, which result in stable springs and wheels that can actually turn and have friction against the ground.
    */

    const { $scene, $body } = this;
    const {
      wheelBase,
      trackWidth,
      rideHeight,
      suspensionTravel,
      suspensionStiffness,
      suspensionDamping
    } = this.vehicleDef;

    const springY = rideHeight + suspensionTravel;
    const springLocations = [
      {x: wheelBase / 2, springY, z: trackWidth / 2 },
      {x: -wheelBase / 2, springY, z: trackWidth / 2 },
      {x: wheelBase / 2, springY, z: -trackWidth / 2 },
      {x: -wheelBase / 2, springY, z: -trackWidth / 2 },
    ];

    springLocations.forEach( location => {
      const constraint = new Physijs.DOFSpringConstraint(
        $body, this.$chassis, new THREE.Vector3( location.x, location.y, location.z )
      );
      $scene.addConstraint( constraint, { disableCollision: true } );
      constraint.setAngularLowerLimit({ x: 1, y: 1, z: 1 });
      constraint.setAngularUpperLimit({ x: 0, y: 0, z: 0 });

      constraint.setLinearLowerLimit({ x: 0, y: 0, z: 0 });
      constraint.setLinearUpperLimit({ x: 0, y: suspensionTravel, z: 0 });
      for (let i = 0; i < 3; i++ ) {
        constraint.enableSpring( i );
        constraint.setStiffness( i, suspensionStiffness );
        constraint.setDamping( i, suspensionDamping );
      }
    });
  }

  loadBodyAsset() {
    const { chassisAsset: { uri, scale, position, rotation } } = this.vehicleDef;
    const { $body } = this;

    this.loader.load(
      uri,
      ( { scene: asset } ) => {
        asset.scale.set(scale, scale, scale)
        asset.position.set( position.x, position.y, position.z );
        asset.rotation.set( rotation.x, rotation.y, rotation.z )
        $body.add( asset );
      },
      undefined, //onProgress
      ( error ) => {
        console.error( error, `Error loading body asset: ${ uri }` );
      }
    );
  }

  createWheelMaterialAndGeometry() {
    if ( !this.wheelMaterial ) {
      this.wheelMaterial = Physijs.createMaterial(
        new THREE.MeshNormalMaterial(), this.vehicleDef.tireFriction, 0.5
      );
      this.wheelMaterial.visible = SHOW_DEBUG_COLLISION_VOLUMES;
    }
    
    if ( !this.wheelGeometry ) {
      this.wheelGeometry  = new THREE.CylinderGeometry( this.vehicleDef.wheelDiameter, this.vehicleDef.wheelDiameter, this.vehicleDef.wheelWidth, 50 );
    }
  }

  createWheel = ( wheelDef ) => {
    const { x, z, drive, steer } = wheelDef;
    const y = this.vehicleDef.rideHeight;

    if ( drive && steer ) {
      throw new Error("Drive-and-steer is not yet supported by current ammo bindings");
    }

    this.createWheelMaterialAndGeometry();

    const $wheel = new Physijs.CylinderMesh( this.wheelGeometry, this.wheelMaterial, this.vehicleDef.wheelMass );
    
    $wheel.rotation.x = Math.PI / 2;

    $wheel.position.set( x, y, z );
    
    this.$scene.add( $wheel );

    let constraint;
    if ( steer ) {
      //Steered wheels use un-motorized DOF constraint which can turn freely (Z rotation) and uses limits to steer (Y rotation)
      constraint = new Physijs.DOFConstraint(
        $wheel, this.$chassis, new THREE.Vector3( x, y, z )
      );
      this.$scene.addConstraint( constraint, { disableCollision: true } );
      constraint.setAngularLowerLimit({ x: 0, y: 0, z: 1 });
      constraint.setAngularUpperLimit({ x: 0, y: 0, z: 0 }); 
    }
    else {
      //Drive and unpowered wheels use simple hinge constraint, which has ammo's motor API.
      constraint = new Physijs.HingeConstraint(
        $wheel,
        this.$chassis,
        new THREE.Vector3( x, y, z ),
        new THREE.Vector3( 0, 1, 0 ),
        new THREE.Vector3( 0, 0, 1 )
      );
      this.$scene.addConstraint( constraint, { disableCollision: true } );
    }

    this.disableWheelCollisionWithBody( $wheel );
    this.loadWheelAsset( $wheel, z < 0 );
    
    return { $wheel, constraint, drive, steer }
  }

  disableWheelCollisionWithBody( $wheel ) {

    /*
      Create a dummy DOF constraint between wheel and body for the purpose of disabling collisions between them.
      Dummy means that the constraint has no limits on any angular or linear axes, so it does not actually constrain motion at all.
    */

    const dummyconstraint = new Physijs.DOFConstraint(
      $wheel, this.$body, new THREE.Vector3( 0, 0, 0 ) //Should this still be wheel location (x,y,z)?
    );
    this.$scene.addConstraint( dummyconstraint, { disableCollision: true } );
    dummyconstraint.setAngularLowerLimit({ x: 1, y: 1, z: 1 });
    dummyconstraint.setAngularUpperLimit({ x: 0, y: 0, z: 0 }); 
    dummyconstraint.setLinearLowerLimit({ x: 1, y: 1, z: 1 });
    dummyconstraint.setLinearUpperLimit({ x: 0, y: 0, z: 0 }); 
  }

  loadWheelAsset( $wheel, isLeft ) {
    const { wheelAsset: { uri, scale, position, rotation, flip } } = this.vehicleDef;

    this.loader.load(
      uri,
      ( { scene: asset } ) => {
        asset.scale.set(scale, scale, scale);

        /*
          Different wheel assets need to be mirrored on different axes in order to face the correct direction
          so vehicleDef.wheelAsset.flip is 'x', 'y' or 'z'
        */

        if ( !isLeft ) {
          asset.scale[ flip ] *= -1;
        }
        asset.position.set( position.x, position.y, position.z );
        asset.rotation.set( rotation.x, rotation.y, rotation.z )
        $wheel.add( asset );
      },
      undefined, //onProgress
      ( error ) => {
        console.error( error, `Error wheel chassis asset: ${ uri }` );
      }
    );
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
    this.wheels.forEach(({ constraint, drive }) => {
      if ( drive ) constraint.enableAngularMotor( -maxVel, torque );
    });
  }

  onReverse() {
    const { maxVel, torque } = this.vehicleDef;
    this.wheels.forEach(({ constraint, drive }) => {
      if ( drive ) constraint.enableAngularMotor( maxVel, torque );
    });
  }

  offGas() {
    this.wheels.forEach(({ constraint, drive }) => {
      if ( drive ) constraint.disableMotor();
    });
  }

  onLeft() {
    const { steerAngle } = this.vehicleDef;
    this.wheels.forEach(({ constraint, steer }) => {
      if ( steer ) {
        constraint.setAngularLowerLimit({ x: 0, y: steerAngle, z: 1 });
        constraint.setAngularUpperLimit({ x: 0, y: steerAngle, z: 0 });
      }
    });
  }

  onRight() {
    const { steerAngle } = this.vehicleDef;
    this.wheels.forEach(({ constraint, steer }) => {
      if ( steer ) {
        constraint.setAngularLowerLimit({ x: 0, y: -steerAngle, z: 1 });
        constraint.setAngularUpperLimit({ x: 0, y: -steerAngle, z: 0 });
      }
    });
  }

  offSteer() {
    this.wheels.forEach(({ constraint, steer }) => {
      if ( steer ) {
        constraint.setAngularLowerLimit({ x: 0, y: 0, z: 1 });
        constraint.setAngularUpperLimit({ x: 0, y: 0, z: 0 });
      }
    });
  }
}
