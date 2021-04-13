import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import authReducer from './reducers/authReducer';
const reducer = combineReducers({
  auth: authReducer
});
const userToken =  localStorage.getItem('jwtToken') ? localStorage.getItem('jwtToken') : false;
const initialState = {
  token: userToken
};

const middlerware = [thunk];

const store = createStore(
  reducer, initialState, composeWithDevTools(applyMiddleware(...middlerware))
)

export default store;