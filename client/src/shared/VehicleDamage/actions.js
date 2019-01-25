import getVehicleHealth from '../../selectors/getVehicleHealth';

export const APPLY_DAMAGE = 'APPLY_DAMAGE';
export const VEHICLE_DEAD = 'VEHICLE_DEAD';
export const STARTING_HEALTH = 100;

export const applyDamage = ( vehicleIndex, damage ) => async ( dispatch, getState ) => {
  if ( getVehicleHealth( getState(), vehicleIndex ) > 0 ) {

    await dispatch({
      type: APPLY_DAMAGE,
      vehicleIndex,
      damage
    });

    if ( getVehicleHealth( getState(), vehicleIndex ) === 0 ) {
      console.error(`vehicle ${ vehicleIndex } dead`)
      dispatch({
        type: VEHICLE_DEAD,
        vehicleIndex
      })
    }
  }
}