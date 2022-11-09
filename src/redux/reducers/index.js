import { combineReducers } from 'redux';
import tokenReducer from './tokenReducer';

const rootReducer = combineReducers({
  tokenReducer,
});

export default rootReducer;
