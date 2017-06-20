import thunkMiddleware from 'redux-thunk'
import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { Provider } from 'react-redux'
import App from './components/App'
import reducer from './reducers'
import { loadPlanets } from './actions'

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunkMiddleware)));

store.dispatch(loadPlanets('./exoplanet.eu_catalog.csv'));

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
