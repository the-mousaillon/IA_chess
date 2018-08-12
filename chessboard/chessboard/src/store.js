import { applyMiddleware, createStore } from 'redux';
import rootReducer from './reducers';
import thunk from 'redux-thunk';

const middeware = applyMiddleware(thunk)

const store = createStore(rootReducer, middeware);

export default store;
