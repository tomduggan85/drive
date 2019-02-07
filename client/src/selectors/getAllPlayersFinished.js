import { createSelector } from 'reselect'
import getVehiclesLeft from './getVehiclesLeft'

const getDamageStats = state => state.damageStats

export default createSelector(
  getDamageStats,
  getVehiclesLeft,
  ({ vehicles }, vehiclesLeft ) => {

    if ( !vehicles.length ) {
      return false
    }

    // This selector assumes that there are always two player-controlled vehicles, and they are at index 0 and 1
    return ( vehicles[ 0 ].health === 0 && vehicles[ 1 ].health === 0 ) || vehiclesLeft === 1
  }
)