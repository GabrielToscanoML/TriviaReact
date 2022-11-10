import { combineReducers } from 'redux';
import tokenReducer from './tokenReducer';
import player from './playerReducer';

const rootReducer = combineReducers({
  player,
  tokenReducer,
});

export default rootReducer;
