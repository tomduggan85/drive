
import { APPLY_DAMAGE, STARTING_HEALTH } from './actions'
import { BEGIN_MATCH } from '../CurrentMatch/actions'

const initialState = {
  vehicles: []
}

export default ( state = initialState, action ) => {
  switch ( action.type ) {

    case BEGIN_MATCH:
      return {
        ...state,
        vehicles: action.vehicles.map( vehicle => ({
          health: STARTING_HEALTH
        }))
      }

    case APPLY_DAMAGE:
      const newVehicles = [ ...state.vehicles ]
      newVehicles[ action.vehicleIndex ].health = Math.max(0, state.vehicles[action.vehicleIndex].health - action.damage);
      console.error(`applying damage ${ action.damage } to vehicle ${action.vehicleIndex}, health is now ${newVehicles[ action.vehicleIndex ].health}`)
      console.error(newVehicles)

      return {
        ...state,
        vehicles: newVehicles
      }

    default:
      return state
  }
}
