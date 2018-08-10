import boardReducer from  './boardReducer';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  board : boardReducer
});

export default rootReducer
