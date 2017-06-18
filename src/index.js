import thunkMiddleware from 'redux-thunk'
import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { Provider } from 'react-redux'
import App from './components/App'
import reducer from './reducers'
import { refreshPlanets, searchPlanets } from './actions'

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunkMiddleware)));

window.Papa.parse('./exoplanets.1436203548.csv', {
	download: true,
	header: true,
	complete: function(results) {
		const planets = {};
		results.data.forEach(planet => {
			planet.BMV = planet.BMV ? parseFloat(planet.BMV) : null;
			planets[planet.NAME] = planet;
		});
		store.dispatch(refreshPlanets(planets));
		store.dispatch(searchPlanets(''));
	}
});

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
