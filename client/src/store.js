
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import VehicleDamage from './shared/VehicleDamage/reducer'

const combinedReducers = combineReducers({
  vehicleDamage: VehicleDamage,
})

const initialState = {}

export default createStore(
  combinedReducers,
  initialState,
  applyMiddleware(thunk)
);