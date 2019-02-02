import { createSelector } from 'reselect'

const getDamageStats = state => state.damageStats

export default ( vehicleIndex ) => createSelector(
  getDamageStats,
  ({ vehicles, matchStartTime }) => {
    const vehicle = vehicles[ vehicleIndex ];
    if ( !vehicle ) {
      return 0
    }

    return Math.floor((( vehicle.deadTime || performance.now() ) - matchStartTime) / 1000 )
  }
)