const DEFAULT_RESULT_SIZE = 200;

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

function search(planets, query) {
	return query === '' ? Object.keys(planets) : index.search(query, {expand: true}).map(result => result.doc.name);
}

export function searchPlanets(query) {
  return (dispatch, getState) => {
    dispatch(queryPlanets(query))
    
    return new Promise((resolve, reject) => {
    	try {
			const results = search(getState().planets.all, query);
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

