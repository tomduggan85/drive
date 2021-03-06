import { createSelector } from 'reselect'

const getDamageStats = state => state.damageStats

export default ( vehicleIndex ) => createSelector(
  getDamageStats,
  ({ vehicles }) => {
    const vehicle = vehicles[ vehicleIndex ];
    return vehicle ? vehicle.damageInflicted : 0
  }
)