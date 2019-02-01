/* global THREE Physijs */

import { Vehicle } from './Vehicle';
import Arena from './Arena';
import store from '../store';
import { beginMatch } from '../shared/CurrentMatch/actions'
import { VEHICLE_TYPES } from '../shared/Vehicles';
import KeyboardControls from '../shared/KeyboardControls';
import shuffle from 'lodash/shuffle'
import without from 'lodash/without'

const VEHICLE_COUNT = 8

const GRAVITY = -100;
const ADD_DUMMY_VEHICLES = true;


class DriveScene {
  
  constructor( props ) {

    //TODO move this elsewhere so that it happens once per app session instead of once per scene
    Physijs.scripts.worker = '/external_js/physijs_worker.js';
    Physijs.scripts.ammo = '/external_js/ammo.js';

    this.socket = props.socket;
    this.vehicles = []

    this.$scene = new Physijs.Scene();
    this.$scene.setGravity(new THREE.Vector3( 0, GRAVITY, 0 ));
    
    const arena = new Arena({ $scene: this.$scene });
    this.createLights();
    this.createVehicles( props.playerVehicles );

    store.dispatch(beginMatch( this.vehicles ))
    
    this.socket.addEventListener('message', this.onSocketMessage );
    this.step();
  }

  buildVehicleList( playerVehicles ) {
    const aiVehicles = without( shuffle( VEHICLE_TYPES ), ...playerVehicles )
    return [ ...playerVehicles, ...aiVehicles ].slice(0, VEHICLE_COUNT)
  }

  createVehicles( playerVehicles ) {
    const positioningRadius = 320;
    const yPos = 3;

    const vehicleList = this.buildVehicleList( playerVehicles )

    this.vehicles = vehicleList.map(( vehicleType, i ) => {
      const angle = 2 * Math.PI * i / vehicleList.length;

      return new Vehicle({
        $scene: this.$scene,
        vehicleType: vehicleType,
        vehicleIndex: i,
        position: {x: positioningRadius * Math.cos( angle ), y: yPos, z: positioningRadius * Math.sin( angle )},
        rotation: {x: 0, y: Math.PI - angle, z: 0},
        keys: KeyboardControls[i % KeyboardControls.length]
      })
    })
  }

  createLights() {    
    this.$scene.add( new THREE.AmbientLight( 0x404040, 17 ));
  }

  onSocketMessage = ( message ) => {
    const { playerId, action } = JSON.parse(message.data);

    //action maps directly to a method on the vehicle object.
    const VALID_ACTIONS = [
      'onLeft', 
      'onRight', 
      'offSteer', 
      'onForward', 
      'onReverse',
      'offGas',
    ];

    if ( VALID_ACTIONS.includes( action )) {
      this.vehicles[ playerId ][ action ]();
    }
  }

  step = () => {
    requestAnimationFrame( this.step );
    this.$scene.simulate();
  }
}

export default DriveScene;