import { combineReducers } from 'redux';
import player from './playerReducer';

const rootReducer = combineReducers({
  player,
});

export default rootReducer;
