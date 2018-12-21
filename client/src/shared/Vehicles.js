
export const VEHICLE_DEFS = {
  its_a_volvo: {
    wheelBase: 19,
    trackWidth: 11.5,
    maxVel: 200,
    torque: 4000,
    chassisMass: 4000,
    chassisShape: { offset: { x: -1, y: 1.6, z: 0 }, size: { x: 25, y: 3, z: 11} },
    bodyShapes: [
      { offset: { x: -1, y: 3.15, z: 0 }, size: { x: 32, y: 3, z: 12} },
      { offset: { x: 0, y: 2, z: 0 }, size: { x: 31, y: 2, z: 11} },
      { offset: { x: -5, y: 4, z: 0 }, size: { x: 18, y: 2, z: 10} },
      { offset: { x: -5, y: 5.5, z: 0 }, size: { x: 15, y: 1, z: 8.5} },
    ],
    bodyMass: 4000,
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
    rideHeight: 1,
    suspensionTravel: 3,
    suspensionStiffness: 200000,
    suspensionDamping: 0.000002,
  },

  lada: {
    wheelBase: 18,
    trackWidth: 11,
    maxVel: 200,
    torque: 4000,
    chassisShape: { offset: { x: -1, y: 1.8, z: 0 }, size: { x: 25, y: 3, z: 11} },
    chassisMass: 4000,
    bodyShapes: [
      { offset: { x: -1, y: 3, z: 0 }, size: { x: 29, y: 3, z: 12} },
      { offset: { x: -0.5, y: 2, z: 0 }, size: { x: 29, y: 2, z: 12} },
      { offset: { x: -1, y: 4, z: 0 }, size: { x: 15, y: 3, z: 10} },
      { offset: { x: -1, y: 6, z: 0 }, size: { x: 12, y: 1.5, z: 8.5} },
    ],
    bodyMass: 4000,
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
    rideHeight: 1,
    suspensionTravel: 3,
    suspensionStiffness: 180000,
    suspensionDamping: 0.0000022,
  },

  '50s': {
    wheelBase: 19.5,
    trackWidth: 9.8,
    maxVel: 200,
    torque: 4000,
    chassisMass: 4000,
    chassisShape: { offset: { x: -1, y: 1.4, z: 0 }, size: { x: 30, y: 3, z: 10} },
    bodyShapes:  [
      { offset: { x: -1, y: 2, z: 0 }, size: { x: 33.5, y: 3, z: 12} },
      { offset: { x: 0, y: 2, z: 0 }, size: { x: 32, y: 2, z: 12} },
      { offset: { x: -1, y: 4, z: 0 }, size: { x: 15, y: 3, z: 10} },
      { offset: { x: -1, y: 6, z: 0 }, size: { x: 12, y: 1.5, z: 8.5} },
    ],
    bodyMass: 4000,
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
    rideHeight: 1,
    suspensionTravel: 3,
    suspensionStiffness: 180000,
    suspensionDamping: 0.0000022,
  },

  'pontiac': {
    wheelBase: 19.0,
    trackWidth: 10.5,
    maxVel: 200,
    torque: 4000,
    chassisMass: 4000,
    chassisShape: { offset: { x: -1, y: 1.5, z: 0 }, size: { x: 25, y: 3, z: 10} },
    bodyShapes: [
      { offset: { x: -1, y: 2.6, z: 0 }, size: { x: 33.5, y: 3, z: 11.5} },
      { offset: { x: 0, y: 2, z: 0 }, size: { x: 30.8, y: 2, z: 11.5} },
      { offset: { x: -3, y: 3.8, z: 0 }, size: { x: 13, y: 3, z: 10} },
      { offset: { x: -3, y: 5.5, z: 0 }, size: { x: 11, y: 1.5, z: 8.5} },
    ],
    bodyMass: 4000,
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
      scale: 0.142,
      position: {x: 0, y: 0, z: 0},
      rotation: {x: Math.PI / 2, y: 0, z: 0},
      flip: 'z',
    },
    wheelDiameter: 2.1,
    wheelWidth: 1.3,
    rideHeight: 1,
    suspensionTravel: 3,
    suspensionStiffness: 180000,
    suspensionDamping: 0.0000022,
  },

  woodywagon: {
    wheelBase: 19.5,
    trackWidth: 10.5,
    maxVel: 200,
    torque: 4000,
    chassisMass: 4000,
    chassisShape: { offset: { x: -1, y: 1.5, z: 0 }, size: { x: 30, y: 3, z: 10} },
    bodyShapes: [
      { offset: { x: -1, y: 2.5, z: 0 }, size: { x: 34, y: 3, z: 11.5} },
      { offset: { x: 0, y: 2, z: 0 }, size: { x: 33, y: 1.5, z: 11.5} },
      { offset: { x: -6, y: 4, z: 0 }, size: { x: 20, y: 2, z: 10} },
      { offset: { x: -5, y: 5.5, z: 0 }, size: { x: 15, y: 1, z: 8.5} },
    ],
    bodyMass: 4000,
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
    rideHeight: 1,
    suspensionTravel: 3,
    suspensionStiffness: 180000,
    suspensionDamping: 0.0000022,
  },
};

export const VEHICLE_TYPES = Object.keys( VEHICLE_DEFS );