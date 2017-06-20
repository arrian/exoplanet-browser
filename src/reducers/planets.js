import { SortMethod, ColourMethod } from '../actions'

const planets = (state = {all: {}, query: '', results: [], count: 0, error: false, loading: true, isMore: false, selection: null, scale: 1.0, colourMethod: ColourMethod.TEMPERATURE, sortMethod: SortMethod.BEST_MATCH }, action) => {
	switch(action.type) {
	case 'REFRESH_PLANETS':
		return Object.assign({}, state, { all: action.planets, results: [], count: 0, loading: false, isMore: false });
	case 'QUERY_PLANETS':
		return Object.assign({}, state, { query: action.query, loading: true, isMore: false });
	case 'RESULT_PLANETS':
		if(action.query === state.query) return Object.assign({}, state, { results: action.results, count: action.count, loading: false, isMore: action.results.length > action.count });
		return state;
	case 'ERROR_PLANETS':
		return Object.assign({}, state, { error: true, loading: false, isMore: false });
	case 'MORE_PLANETS':
		return Object.assign({}, state, { count: action.count, isMore: state.results.length > action.count });
	case 'SELECT_PLANET':
		return Object.assign({}, state, { selection: action.selection });
	case 'DESELECT_PLANET':
		return Object.assign({}, state, { selection: null });
	case 'SCALE_PLANETS':
		return Object.assign({}, state, { scale: action.scale });
	case 'COLOUR_PLANETS':
		return Object.assign({}, state, { colourMethod: action.method });
	case 'SORT_PLANETS':
		return Object.assign({}, state, { sortMethod: action.method });
	default:
		return state;
	}
}

export default planets
