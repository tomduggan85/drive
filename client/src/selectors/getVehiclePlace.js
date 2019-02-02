import { createSelector } from 'reselect'

const getDamageStats = state => state.damageStats

export default ( vehicleIndex ) => createSelector(
  getDamageStats,
  ({ vehicles }) => {
    const vehicle = vehicles[ vehicleIndex ];
    if ( !vehicle ) {
      return 0
    }

    return vehicle.placeAtDeath || 1
  }
)