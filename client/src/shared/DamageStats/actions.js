import getVehicleHealth from '../../selectors/getVehicleHealth';
import isVehicleTakingDamage from '../../selectors/isVehicleTakingDamage';

export const APPLY_DAMAGE = 'APPLY_DAMAGE';
export const VEHICLE_DEAD = 'VEHICLE_DEAD';
export const CLEAR_TAKING_DAMAGE = 'CLEAR_TAKING_DAMAGE';
export const STARTING_HEALTH = 100;

const TAKING_DAMAGE_TIMEOUT = 400

export const applyDamage = ( vehicleIndex, damage ) => async ( dispatch, getState ) => {
  if ( getVehicleHealth( vehicleIndex )( getState() ) > 0 ) {

    const alreadyTakingDamage = isVehicleTakingDamage( vehicleIndex )( getState() )

    await dispatch({
      type: APPLY_DAMAGE,
      vehicleIndex,
      damage
    });

    if ( getVehicleHealth( vehicleIndex )(getState()) === 0 ) {
      console.error(`vehicle ${ vehicleIndex } dead`)
      dispatch({
        type: VEHICLE_DEAD,
        vehicleIndex
      })
    }

    if (!alreadyTakingDamage) {
      setTimeout(() => {
        dispatch({
          type: CLEAR_TAKING_DAMAGE,
          vehicleIndex
        })
      }, TAKING_DAMAGE_TIMEOUT)
    }
  }
}