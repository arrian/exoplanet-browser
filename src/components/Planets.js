import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import Planet from '../components/Planet'
import InfiniteScroll from 'react-infinite-scroller'
import { loadMorePlanets, selectPlanet, deselectPlanet } from '../actions'
import { Loader } from 'semantic-ui-react'

function renderPlanets(planets, selectPlanet, deselectPlanet, selection) {
	return planets.map(planet => <div style={{ display: 'inline-block' }} key={planet.NAME}><Planet planet={planet} width={150} height={150} isSelected={selection === planet.NAME} onClick={() => selection === planet.NAME ? deselectPlanet() : selectPlanet(planet.NAME)} /></div>);
}

const Planets = ({ planets, loading, error, loadMorePlanets, isMore, selectPlanet, deselectPlanet, selection }) => (
	<div style={{ textAlign: 'center' }}>
		<Loader active={loading}></Loader>
		<InfiniteScroll initialLoad={false} pageStart={0} loadMore={loadMorePlanets} hasMore={isMore} loader={<div className="loader">Loading ...</div>}>
			{renderPlanets(planets, selectPlanet, deselectPlanet, selection)}
		</InfiniteScroll>
	</div>
)

Planets.propTypes = {
  planets: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.bool,
  isMore: PropTypes.bool
}

const mapStateToProps = (state) => ({
  planets: state.planets.results.slice(0, state.planets.count).map(planetName => state.planets.all[planetName]),
  loading: state.planets.loading,
  error: state.planets.error,
  isMore: state.planets.isMore,
  selection: state.planets.selection
})

const mapDispatchToProps = ({
	loadMorePlanets: loadMorePlanets,
	selectPlanet: selectPlanet,
	deselectPlanet: deselectPlanet
})

const ConnectedPlanets = connect(
  mapStateToProps,
  mapDispatchToProps
)(Planets)

export default ConnectedPlanets
