import boardReducer from  './boardReducer';
import gameReducer from  './gameReducer';
import { combineReducers } from 'redux';

export default combineReducers({
  board : boardReducer,
  game : gameReducer
});
