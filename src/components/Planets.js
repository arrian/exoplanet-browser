import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import Planet from '../components/Planet'
import InfiniteScroll from 'react-infinite-scroller'
import { loadMorePlanets, selectPlanet, deselectPlanet } from '../actions'
import { Loader } from 'semantic-ui-react'

const Planets = ({ planets, loading, error, loadMorePlanets, isMore, selectPlanet, deselectPlanet, selection, scale, colourMethod }) => (
	<div style={{ textAlign: 'center' }}>
    <InfiniteScroll initialLoad={false} pageStart={0} loadMore={loadMorePlanets} hasMore={isMore} loader={<div className="loader">Loading ...</div>}>
      {planets.map(planet => <div style={{ display: 'inline-block' }} key={planet.name}><Planet planet={planet} width={150} height={150} scale={scale} colourMethod={colourMethod} isSelected={selection === planet.name} onClick={() => selection === planet.name ? deselectPlanet() : selectPlanet(planet.name)} /></div>)}
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
  scale: state.planets.scale,
  loading: state.planets.loading,
  error: state.planets.error,
  isMore: state.planets.isMore,
  selection: state.planets.selection,
  colourMethod: state.planets.colourMethod
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
