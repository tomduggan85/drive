
import {
  APPLY_DAMAGE,
  STARTING_HEALTH,
  CLEAR_TAKING_DAMAGE
} from './actions'
import { BEGIN_MATCH } from '../CurrentMatch/actions'

const initialState = {
  vehicles: []
}

export default ( state = initialState, action ) => {
  const vehicles = [ ...state.vehicles ]
  switch ( action.type ) {

    case BEGIN_MATCH:
      return {
        ...state,
        vehicles: action.vehicles.map( vehicle => ({
          health: STARTING_HEALTH,
          takingDamage: false
        }))
      }

    case APPLY_DAMAGE:
      vehicles[ action.vehicleIndex ].health = Math.max(0, state.vehicles[action.vehicleIndex].health - action.damage);
      vehicles[ action.vehicleIndex ].takingDamage = true

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
