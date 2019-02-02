import getVehicleHealth from '../../selectors/getVehicleHealth';
import isVehicleTakingDamage from '../../selectors/isVehicleTakingDamage';
import getVehiclesLeft from '../../selectors/getVehiclesLeft';

export const APPLY_DAMAGE = 'APPLY_DAMAGE';
export const VEHICLE_DEAD = 'VEHICLE_DEAD';
export const CLEAR_TAKING_DAMAGE = 'CLEAR_TAKING_DAMAGE';
export const TALLY_DAMAGE_INFLICTED = 'TALLY_DAMAGE_INFLICTED';
export const STARTING_HEALTH = 100;

const TAKING_DAMAGE_TIMEOUT = 400;

export const applyDamage = ( vehicleIndex, damage, inflictingVehicleIndex ) => async ( dispatch, getState ) => {
  if ( getVehicleHealth( vehicleIndex )( getState() ) > 0 ) {

    const alreadyTakingDamage = isVehicleTakingDamage( vehicleIndex )( getState() )

    await dispatch({
      type: APPLY_DAMAGE,
      vehicleIndex,
      damage
    });

    if ( inflictingVehicleIndex !== undefined && getVehicleHealth( inflictingVehicleIndex )( getState() ) > 0 ) {
      await dispatch({
        type: TALLY_DAMAGE_INFLICTED,
        vehicleIndex: inflictingVehicleIndex,
        damage
      });
    }

    if ( getVehicleHealth( vehicleIndex )(getState()) === 0 ) {
      dispatch({
        type: VEHICLE_DEAD,
        vehicleIndex,
        place: getVehiclesLeft( getState()) + 1
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