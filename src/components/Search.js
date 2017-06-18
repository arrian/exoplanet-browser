import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { searchPlanets } from '../actions'
import { Input } from 'semantic-ui-react'

const Search = ({ query, onSearchChange, loading }) => (
	<div style={{ width: '100%', textAlign: 'center' }}><Input placeholder='Search...' style={{ marginBottom: 20, width: '100%', maxWidth: 800 }} size='big' value={query} onChange={onSearchChange} /></div>
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
