import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { searchPlanets, scalePlanets } from '../actions'
import { Input, Grid, Button, Dropdown } from 'semantic-ui-react'
import Slider, { Range } from 'rc-slider'
import 'rc-slider/assets/index.css'

const Search = ({ query, onSearchChange, loading }) => (
	<div style={{ width: '100%', maxWidth: 800, marginLeft: 'auto', marginRight: 'auto', textAlign: 'center' }}>
		<Input loading={loading} placeholder='Search...' icon='search' style={{ marginBottom: 20, width: '100%' }} size='big' value={query} onChange={onSearchChange} />
	</div>
)

Search.propTypes = {
	query: PropTypes.string.isRequired,
	loading: PropTypes.bool
}

const mapStateToProps = (state) => ({
	query: state.planets.query,
	loading: state.planets.loading
})

const mapDispatchToProps = ({
	onSearchChange: (event) => searchPlanets(event.target.value)
})

const ConnectedSearch = connect(
	mapStateToProps,
	mapDispatchToProps
)(Search)

export default ConnectedSearch
