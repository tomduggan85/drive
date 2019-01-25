import { createSelector } from 'reselect'

const getDamageStats = state => state.damageStats

export default createSelector(
  getDamageStats,
  ({ vehicles }) => {
    return vehicles.filter( vehicle => vehicle.health > 0 ).length
  }
)