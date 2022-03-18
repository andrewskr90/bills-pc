import { combineReducers } from 'redux'
import trainerReducer from './trainerReducer'
import gymLeaderReducer from './gymLeaderReducer'

const rootReducer = combineReducers({
  trainerReducer,
  gymLeaderReducer,
})

export default rootReducer