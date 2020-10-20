// import loginHandlingReducer from './loginHandlingReducer';
import combReducer from './combineReducer';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { createStore, applyMiddleware, compose } from 'redux';

let middleware = [thunk];
if (process.env.NODE_ENV !== 'production') {
  middleware = [...middleware, logger];
}

const composeEnhancers =
  typeof window === 'object' && window._REDUX_DEVTOOLS_EXTENSION_COMPOSE_
    ? window._REDUX_DEVTOOLS_EXTENSION_COMPOSE_({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;

// const enhancer = composeEnhancers(
//   applyMiddleware(...middleware)
//   // other store enhancers if any
// );
// const store = createStore(combReducer, enhancer);

const store = createStore(
  combReducer,
  compose(
    applyMiddleware(...middleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store;
