
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import DamageStats from './shared/DamageStats/reducer'

const combinedReducers = combineReducers({
  damageStats: DamageStats,
})

const initialState = {}

export default createStore(
  combinedReducers,
  initialState,
  applyMiddleware(thunk)
);