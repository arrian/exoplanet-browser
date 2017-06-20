import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { scalePlanets, colourPlanets, sortPlanets, SortMethod, ColourMethod } from '../actions'
import { Grid, Button, Dropdown, Divider, Label } from 'semantic-ui-react'
import Slider, { Range } from 'rc-slider'
import 'rc-slider/assets/index.css'

const Options = ({ onScaleChange, onSortChange, onColourChange, loading, scale, sortMethod, colourMethod }) => (
	<div>
		<Grid style={{ width: '100%', maxWidth: 800, paddingTop: 20, marginLeft: 'auto', marginRight: 'auto', textAlign: 'center', color: 'white' }} columns={3}>
			<Grid.Row>
				<Grid.Column>
					<div style={{ display: 'flex' }}>
						Colour by
						<Dropdown value={colourMethod} onChange={onColourChange} style={{ marginLeft: 20 }} options={[
							{ text: 'Temperature', value: ColourMethod.TEMPERATURE },
							{ text: 'Mass', value: ColourMethod.MASS },
							{ text: 'Status', value: ColourMethod.STATUS }
						]} />
					</div>
  				</Grid.Column>
  				<Grid.Column>
  					<div style={{ display: 'flex' }}>
	  					Sort by
						<Dropdown value={sortMethod} onChange={onSortChange} style={{ marginLeft: 20 }} options={[
							{ text: 'Best Match', value: SortMethod.BEST_MATCH },
							{ text: 'Name (A - Z)', value: SortMethod.NAME_A_Z },
							{ text: 'Name (Z - A)', value: SortMethod.NAME_Z_A },
							{ text: 'Radius (High - Low)', value: SortMethod.RADIUS_HIGH_LOW },
							{ text: 'Radius (Low - High)', value: SortMethod.RADIUS_LOW_HIGH }
						]} />
					</div>
  				</Grid.Column>
  				<Grid.Column>
					<div style={{ display: 'flex' }}>
						Scale
						<Slider style={{ marginLeft: 20, paddingTop: 7 }} min={0.5} max={100} value={scale} onChange={onScaleChange} step={0.5} />
					</div>
				</Grid.Column>
			</Grid.Row>
		</Grid>
		<Divider inverted />
	</div>
)

Options.propTypes = {
	loading: PropTypes.bool
}

const mapStateToProps = (state) => ({
	loading: state.planets.loading,
	scale: state.planets.scale,
	sortMethod: state.planets.sortMethod,
	colourMethod: state.planets.colourMethod
})

const mapDispatchToProps = ({
	onScaleChange: scalePlanets,
	onSortChange: (_, data) => sortPlanets(data.value),
	onColourChange: (_, data) => colourPlanets(data.value)
})

const ConnectedOptions = connect(
	mapStateToProps,
	mapDispatchToProps
)(Options)

export default ConnectedOptions
