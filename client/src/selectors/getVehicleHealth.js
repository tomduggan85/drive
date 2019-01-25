import { createSelector } from 'reselect'

const getVehicleDamage = ( state, vehicleIndex ) => state.vehicleDamage.vehicles[ vehicleIndex ];

export default createSelector(
  getVehicleDamage,
  ( vehicleDamage ) => {
    return vehicleDamage ? vehicleDamage.health : 0
  }
)