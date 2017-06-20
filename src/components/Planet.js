import React, { PropTypes } from 'react'
import { Parallax } from 'react-parallax'
import { Table, Header, Label } from 'semantic-ui-react'
import { ColourMethod } from '../actions'

const scale = require('scale-color-perceptual');

class Planet extends React.Component {
  constructor(props) {
    super(props);

    this.epsilon = 0.0001;
  }

  hasRadius() {
    return this.props.planet.radius > this.epsilon;
  }

  hasTemperature() {
    return this.props.planet.temp_calculated;
  }

  getRadius() {
    const planet = this.props.planet;
    const defaultRadius = 20;
    return this.hasRadius() ? planet.radius * 30 : defaultRadius;
  }

  getColour() {
    const planet = this.props.planet;
    if(this.props.colourMethod === ColourMethod.TEMPERATURE) return this.hasRadius() && this.hasTemperature() ? scale.magma(Math.max(0.0, Math.min(1.0, planet.temp_calculated / 2500))) : 'gray';
    
    if(this.props.colourMethod === ColourMethod.MASS) return planet.mass ? scale.magma(Math.max(0.0, Math.min(1.0, planet.mass / 30))) : 'gray';
    
    if(this.isConfirmed()) return '#21BA45';
    else if(this.isUnconfirmed()) return '#2185D0';
    else return 'gray';
  }

  renderArrow() {
    const arrowSize = 15;
    return <div style={{ position: 'absolute', left: this.props.width / 2 - arrowSize, bottom: 0, width: 0, height: 0, borderLeft: arrowSize + 'px solid transparent', borderRight: arrowSize + 'px solid transparent', borderBottom: arrowSize + 'px solid #545A70' }}></div>
  }

  renderPlanet(limit) {
    const radius = this.getRadius() * (this.hasRadius() ? this.props.scale : 1.0);
    const color = this.getColour();
    const diameter = radius * 2;
    const circleSVG = <circle cx={limit ? Math.min(radius, 75) : radius} cy={radius} r={radius - (this.hasRadius() ? 0 : 3)} fill={this.hasRadius() ? color : null} stroke={this.hasRadius() ? null : color} strokeWidth={2} />;
    const planetSVG = <svg height={limit ? Math.min(diameter, 80) : diameter} width={limit ? Math.min(diameter, 150) : diameter}>{circleSVG}{this.hasRadius() ? null : <text x={radius} y={radius} fill='white' textAnchor='middle' dy='.3em'>?</text>}</svg>

    return planetSVG;
  }

  getDetailsHeight() {
    return this.props.isSelected ? this.props.height * 1.5 : 0;
  }

  isConfirmed() {
    return this.props.planet.planet_status === 'Confirmed';
  }

  isUnconfirmed() {
    return this.props.planet.planet_status === 'Unconfirmed';
  }

  isCandidate() {
    return this.props.planet.planet_status === 'Candidate';
  }

  renderStatus() {
    let color;

    if(this.isConfirmed()) {
      color = 'green';
    } else if(this.isUnconfirmed()) {
      color = 'blue';
    } else {
      color = '';
    }

    return <Label color={color}>{this.props.planet.planet_status}</Label>
  }

  renderDetails() {
    const planet = this.props.planet;
    return (
      <div style={{ textAlign: 'center', display: 'block', position: 'absolute', left: 0, right: 0, height: this.getDetailsHeight(), marginTop: this.getDetailsHeight() * -1, backgroundColor: '#545A70' }}>
        <h2 style={{ paddingTop: 10, fontFamily: '\'Roboto\', sans-serif', fontWeight: 100, width: '100%', textAlign: 'center', color: 'white' }}>{planet.name}</h2>
        <Table textAlign='center' style={{ marginRight: 'auto', marginLeft: 'auto' }} basic='very' celled collapsing unstackable inverted>
          <Table.Body>
            <Table.Row>
              <Table.Cell>
                Impression
              </Table.Cell>
              <Table.Cell>
                Radius
              </Table.Cell>
              <Table.Cell>
                Mass
              </Table.Cell>
              <Table.Cell>
                Discovered
              </Table.Cell>
              <Table.Cell>
                Status
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                {this.renderPlanet(true)}
              </Table.Cell>
              <Table.Cell>
                {this.hasRadius() ? planet.radius + ' Jupiter radius' : 'Unknown'}
              </Table.Cell>
              <Table.Cell>
                {planet.mass ? planet.mass + ' Jupiter masses' : 'Unknown'}
              </Table.Cell>
              <Table.Cell>
                {planet.discovered}
              </Table.Cell>
              <Table.Cell>
                {this.renderStatus()}
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    );
  }

  render() {
    const planet = this.props.planet;

    const selectedStyle = { marginBottom: this.getDetailsHeight() };
    let itemStyle = { width: this.props.width, height: this.props.height, color: 'white', position: 'relative', lineHeight: this.props.height + 'px' };

    itemStyle = this.props.isSelected ? Object.assign({}, selectedStyle, itemStyle) : itemStyle;
    // return this.renderPlanet();
    return (
      <div>
      <a href='#' style={{ textDecoration: 'none' }} onClick={e => { e.preventDefault(); this.props.onClick(e); }}>
      <div className='planet' style={itemStyle}>
        <h3 style={{ fontFamily: '\'Roboto\', sans-serif', fontWeight: 100, width: this.props.width, maxWidth: this.props.width, overflow: 'hidden', textAlign: 'center', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{planet.name}</h3>
        <div style={{ textAlign: 'center' }}>{this.renderPlanet(true)}</div>
        { this.props.isSelected ? this.renderArrow() : null }
      </div>
      </a>
      { this.props.isSelected ? this.renderDetails() : null }
      </div>
    );
  }
}

Planet.propTypes = {
  planet: PropTypes.object.isRequired,
  scale: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  onClick: PropTypes.func,
  isSelected: PropTypes.bool,
  colourMethod: PropTypes.string
}

export default Planet
