import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import ReduxThunk from 'redux-thunk';

import reportReducer from './reducers/reportReducer';


import allReducers from './reducers';


const reducers = combineReducers({
    ...allReducers,
    reportReducer,
  });

const enhancers = compose(
  applyMiddleware(ReduxThunk)
);


export default () => createStore(reducers, {}, enhancers);
