const DEFAULT_RESULT_SIZE = 200;
const INTERESTING_DEFAULT_QUERY = 'k0';

var index = window.elasticlunr(function () {
	this.addField('name');
	this.setRef('name');
});
window.elasticlunr.clearStopWords();

export const refreshPlanets = (planets) => {
	Object.keys(planets).forEach(planetName => index.addDoc({ name: planetName }));

	return {
		type: 'REFRESH_PLANETS',
		planets
	}
};

function getDefaultPlanets() {
	return [
		{ name: 'Mercury', radius: 0.03488721374, temp_calculated: 700, mass: null, discovered: '-', planet_status: 'Confirmed' },
		{ name: 'Venus', radius: 0.08463884071, temp_calculated: 753, mass: null, discovered: '-', planet_status: 'Confirmed' },
		{ name: 'Earth', radius: 0.08921277905, temp_calculated: 287, mass: null, discovered: '-', planet_status: 'Confirmed' },
		{ name: 'Mars', radius: 0.04750181839, temp_calculated: 210, mass: null, discovered: '-', planet_status: 'Confirmed' },
		{ name: 'Jupiter', radius: 1, temp_calculated: 143, mass: null, discovered: '-', planet_status: 'Confirmed' },
		{ name: 'Saturn', radius: 0.843003413, temp_calculated: 143, mass: null, discovered: '-', planet_status: 'Confirmed' },
		{ name: 'Uranus', radius: 0.3575085324, temp_calculated: 73, mass: null, discovered: '1781', planet_status: 'Confirmed' },
		{ name: 'Neptune', radius: 0.345129525, temp_calculated: 73, mass: null, discovered: '1846', planet_status: 'Confirmed' },
		{ name: 'Pluto', radius: 0.01671515694, temp_calculated: 45, mass: null, discovered: '-', planet_status: 'Confirmed' },
		{ name: 'Makemake', radius: 0.0105705826, temp_calculated: 30, mass: null, discovered: '2005', planet_status: 'Confirmed' }
	];
}

export function loadPlanets(csv) {
  return (dispatch, getState) => {
  	return new Promise((resolve, reject) => {
		window.Papa.parse('./exoplanet.eu_catalog.csv', {
			download: true,
			header: true,
			complete: function(results) {
				const planets = {};
				results.data.forEach(planet => {
					planet.radius = planet.radius ? parseFloat(planet.radius) : null;
					planet.temp_calculated = planet.temp_calculated ? parseFloat(planet.temp_calculated) : null;
					planet.mass = planet.mass ? parseFloat(planet.mass) : null;
					planets[planet.name] = planet;
				});

				getDefaultPlanets().forEach(planet => planets[planet.name] = planet);

				dispatch(refreshPlanets(planets));
				dispatch(searchPlanets(getState().planets.query || INTERESTING_DEFAULT_QUERY));
			}
		});
	});
  }
};

export const queryPlanets = (query) => ({
	type: 'QUERY_PLANETS',
	query
});

export const resultPlanets = (query, results, count) => ({
	type: 'RESULT_PLANETS',
	results,
	count,
	query
});

export const errorPlanets = () => ({
	type: 'ERROR_PLANETS'
})

export const morePlanets = (count) => ({
	type: 'MORE_PLANETS',
	count
})

export function loadMorePlanets() {
	return (dispatch, getState) => {
		dispatch(morePlanets(getState().planets.count + DEFAULT_RESULT_SIZE));
	}
}

function sort(planets, results, sortFn) {
	let sortedResults = [ ...results ];

	return sortedResults.map(key => planets[key]).sort(sortFn).map(planet => planet.name);
}

function search(planets, query, sortMethod) {
	var results = query === '' ? Object.keys(planets) : index.search(query, {expand: true}).map(result => result.doc.name);

	if(sortMethod === SortMethod.NAME_A_Z) results = sort(planets, results, (a,b) => a.name.localeCompare(b.name));
	else if(sortMethod === SortMethod.NAME_Z_A) results = sort(planets, results, (a,b) => a.name.localeCompare(b.name) * -1);
	else if(sortMethod === SortMethod.RADIUS_HIGH_LOW) results = sort(planets, results, (a,b) => ((a.radius || Number.MIN_VALUE) - (b.radius || Number.MIN_VALUE)) * -1);
	else if(sortMethod === SortMethod.RADIUS_LOW_HIGH) results = sort(planets, results, (a,b) => (a.radius || Number.MAX_VALUE) - (b.radius || Number.MAX_VALUE));

	return results;
}

export function searchPlanets(query) {
  return (dispatch, getState) => {
    dispatch(queryPlanets(query))
    
    return new Promise((resolve, reject) => {
    	try {
			const results = search(getState().planets.all, query, getState().planets.sortMethod);
			setTimeout(function(){
			    dispatch(resultPlanets(query, results, DEFAULT_RESULT_SIZE));
				resolve();
			}, 10);
			
		} catch(error) {
			dispatch(errorPlanets());
			reject(error);
		}
    });
  }
}

export const selectPlanet = (planetName) => ({
	type: 'SELECT_PLANET',
	selection: planetName
});

export const deselectPlanet = () => ({
	type: 'DESELECT_PLANET'
});

export const scalePlanets = (scale) => ({
	type: 'SCALE_PLANETS',
	scale
});

export function sortPlanets(method) {
  return (dispatch, getState) => {
  	dispatch({
		type: 'SORT_PLANETS',
		method
	});
    dispatch(searchPlanets(getState().planets.query))
  }
}

export const SortMethod = {
	BEST_MATCH: 'BEST_MATCH',
	NAME_A_Z: 'NAME_A_Z',
	NAME_Z_A: 'NAME_Z_A',
	RADIUS_HIGH_LOW: 'RADIUS_HIGH_LOW',
	RADIUS_LOW_HIGH: 'RADIUS_LOW_HIGH'
};

export const colourPlanets = (method) => ({
	type: 'COLOUR_PLANETS',
	method
});

export const ColourMethod = {
	NONE: 'NONE',
	TEMPERATURE: 'TEMPERATURE',
	MASS: 'MASS',
	STATUS: 'STATUS'
};

