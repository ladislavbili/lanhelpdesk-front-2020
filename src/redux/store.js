import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import ReduxThunk from 'redux-thunk';

import expenditureReducer from './reducers/expenditureReducer';
import passReducer from './reducers/passReducer';
import cmdbReducer from './reducers/cmdbReducer';
import wikiReducer from './reducers/wikiReducer';
import reportReducer from './reducers/reportReducer';


import allReducers from './reducers';



const reducers = combineReducers({
    ...allReducers,
    expenditureReducer,
    passReducer,
    cmdbReducer,
    wikiReducer,
    reportReducer,
  });

const enhancers = compose(
  applyMiddleware(ReduxThunk)
);


export default () => createStore(reducers, {}, enhancers);
