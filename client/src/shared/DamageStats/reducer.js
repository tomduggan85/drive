
import {
  APPLY_DAMAGE,
  STARTING_HEALTH,
  CLEAR_TAKING_DAMAGE,
  TALLY_DAMAGE_INFLICTED,
  VEHICLE_DEAD
} from './actions'
import { BEGIN_MATCH } from '../CurrentMatch/actions'

const initialState = {
  vehicles: [],
  matchStartTime: 0,
}

const initialVehicleState = {
  health: STARTING_HEALTH,
  takingDamage: false,
  damageInflicted: 0,
  deadTime: 0,
  placeAtDeath: 0,
}

export default ( state = initialState, action ) => {
  const vehicles = [ ...state.vehicles ]
  switch ( action.type ) {

    case BEGIN_MATCH:
      return {
        ...state,
        vehicles: action.vehicles.map( vehicle => ({ ...initialVehicleState })),
        matchStartTime: performance.now(),
      }

    case APPLY_DAMAGE:
      vehicles[ action.vehicleIndex ].health = Math.max(0, state.vehicles[action.vehicleIndex].health - action.damage);
      vehicles[ action.vehicleIndex ].takingDamage = true

      return {
        ...state,
        vehicles
      }

    case TALLY_DAMAGE_INFLICTED:
      vehicles[ action.vehicleIndex ].damageInflicted += action.damage

      return {
        ...state,
        vehicles
      }

    case VEHICLE_DEAD:
      vehicles[ action.vehicleIndex ].deadTime = performance.now()
      vehicles[ action.vehicleIndex ].placeAtDeath = action.place

      return {
        ...state,
        vehicles
      }

    case CLEAR_TAKING_DAMAGE:
      vehicles[ action.vehicleIndex ].takingDamage = false

      return {
        ...state,
        vehicles
      }    

    default:
      return state
  }
}
