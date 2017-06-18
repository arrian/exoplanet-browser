import React, { PropTypes } from 'react'
import { Parallax } from 'react-parallax'
import { Table, Header } from 'semantic-ui-react'

class Planet extends React.Component {
  constructor(props) {
    super(props);

    this.epsilon = 0.0001;
  }

  getRGBFromBV(bv) {
    var t,
        r = 0.0,
        g = 0.0,
        b = 0.0;

    if (bv < -0.4) bv = -0.4;
    if (bv > 2.0) bv = 2.0;

    if ((bv>=-0.40) && (bv<0.00)) { t=(bv+0.40)/(0.00+0.40); r=0.61+(0.11*t)+(0.1*t*t); }
    else if ((bv>= 0.00) && (bv<0.40)) { t=(bv-0.00)/(0.40-0.00); r=0.83+(0.17*t); }
    else if ((bv>= 0.40) && (bv<2.10)) { t=(bv-0.40)/(2.10-0.40); r=1.00; }

    if ((bv>=-0.40) && (bv<0.00)) { t=(bv+0.40)/(0.00+0.40); g=0.70+(0.07*t)+(0.1*t*t); }
    else if ((bv>= 0.00) && (bv<0.40)) { t=(bv-0.00)/(0.40-0.00); g=0.87+(0.11*t); }
    else if ((bv>= 0.40) && (bv<1.60)) { t=(bv-0.40)/(1.60-0.40); g=0.98-(0.16*t); }
    else if ((bv>= 1.60) && (bv<2.00)) { t=(bv-1.60)/(2.00-1.60); g=0.82-(0.5*t*t); }
    
    if ((bv>=-0.40) && (bv<0.40)) { t=(bv+0.40)/(0.40+0.40); b=1.00; }
    else if ((bv>= 0.40) && (bv<1.50)) { t=(bv-0.40)/(1.50-0.40); b=1.00-(0.47*t)+(0.1*t*t); }
    else if ((bv>= 1.50) && (bv<1.94)) { t=(bv-1.50)/(1.94-1.50); b=0.63-(0.6*t*t); }

    return `rgb(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)})`;
  }

  hasRadius() {
    return this.props.planet.R > this.epsilon;
  }

  hasDensity() {
    return this.props.planet.DENSITY > this.epsilon;
  }

  getRadius() {
    const planet = this.props.planet;
    const defaultRadius = 20;
    return this.hasRadius() ? planet.R * 30 : defaultRadius;
  }

  getColour() {
    const planet = this.props.planet;
    return this.hasRadius() ? (planet.BMV ? this.getRGBFromBV(planet.BMV) : 'brown') : 'gray';
  }

  renderArrow() {
    const arrowSize = 15;
    return <div style={{ position: 'absolute', left: this.props.width / 2 - arrowSize, bottom: 0, width: 0, height: 0, borderLeft: arrowSize + 'px solid transparent', borderRight: arrowSize + 'px solid transparent', borderBottom: arrowSize + 'px solid #545A70' }}></div>
  }

  renderPlanet(limit) {
    const radius = this.getRadius();
    const color = this.getColour();
    const diameter = radius * 2;
    const circleSVG = <circle cx={radius} cy={radius} r={radius} fill={color} />;
    const planetSVG = <svg height={limit ? Math.min(diameter, 80) : diameter} width={limit ? Math.min(diameter, 150) : diameter}>{circleSVG}{this.hasRadius() ? null : <text x={radius} y={radius} fill='black' textAnchor='middle' dy='.3em'>?</text>}</svg>

    return planetSVG;
  }

  getDetailsHeight() {
    return this.props.isSelected ? this.props.height * 1.5 : 0;
  }

  renderDetails() {
    const planet = this.props.planet;
    return (
      <div style={{ textAlign: 'center', display: 'block', position: 'absolute', left: 0, right: 0, height: this.getDetailsHeight(), marginTop: this.getDetailsHeight() * -1, backgroundColor: '#545A70' }}>
        <h2 style={{ paddingTop: 10, fontFamily: '\'Roboto\', sans-serif', fontWeight: 100, width: '100%', textAlign: 'center', color: 'white' }}>{planet.NAME}</h2>
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
                Density
              </Table.Cell>
              <Table.Cell>
                Orbital Period
              </Table.Cell>
              <Table.Cell>
                First Referenced
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                {this.renderPlanet(true)}
              </Table.Cell>
              <Table.Cell>
                {this.hasRadius() ? Math.round(planet.R * 69911) + ' km' : 'Unknown'}
              </Table.Cell>
              <Table.Cell>
                {this.hasDensity() ? planet.DENSITY + ' gm/cm³' : 'Unknown'}
              </Table.Cell>
              <Table.Cell>
                {planet.PER > this.epsilon ? planet.PER + ' days' : 'Unknown'}
              </Table.Cell>
              <Table.Cell>
                <a style={{ color: 'white' }} href={planet.FIRSTURL}>{planet.FIRSTREF}</a>
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
        <h3 style={{ fontFamily: '\'Roboto\', sans-serif', fontWeight: 100, width: '100%', textAlign: 'center' }}>{planet.NAME}</h3>
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
  width: PropTypes.number,
  height: PropTypes.number,
  onClick: PropTypes.func,
  isSelected: PropTypes.bool
}

export default Planet
