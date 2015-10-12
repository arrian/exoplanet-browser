import csv
import json

input_file = 'exoplanets.1436203548'

planets = []

identifier = 0

reasonable_name_mapper = {
	'NAME': 'name',
	'OTHERNAME': 'other_name',
	'COMP': 'planet_name',
	'HD': 'henry_draper_number',
	'HR': 'bright_star_catalog_number',
	'HIPP': 'hipparcos_catalog_number',
	'SAO': 'smithsonian_astrophysical_catalog_number',
	'GL': 'gliese_catalog_number',
	'BINARY': 'is_multiple_star_system',
	'RA': 'right_ascension',
	'DEC': 'declination',
	'KEPID': 'kepler_id',
	'PER': 'orbital_period',
	'ECC': 'orbital_eccentricity',
	'OM': 'argument_of_periastron',
	'K': 'velocity_semiamplitude',
	'T0': 'time_of_periastron',
	'DVDT': 'velocity_slope',
	'I': 'orbit_inclination',
	'MSINI': 'minimum_mass_of_planet',
	'A': 'semi_major_axis',
	'MASS': 'planet_mass',
	'SEP': 'separation',
	'LAMBDA': 'spin_orbit_misalignment',
	'BIGOM': 'longitude_of_ascending_node',

	'DEPTH': 'transit_depth',
	'T14': 'duration_of_transit',
	'TT': 'epoch_of_transit_center',
	'R': 'planetary_radius',
	'AR': 'semi_major_axis_to_stellar_radius_ratio',
	'B': 'impact_parameter',
	'DENSITY': 'density',
	'GRAVITY': 'gravity',
	'RR': 'planet_star_radius_ratio',

	'STAR': 'star_name',
	'MSTAR': 'star_mass',
	'RSTAR': 'star_radius',
	'TEFF': 'star_temperature',
	'RHOSTAR': 'star_density',
	'LOGG': 'star_gravity',
	'FE': 'star_iron_to_hydrogen_ratio'

	'JSNAME': 'exoplanet_link'
}


with open(input_file + '.csv', 'r') as csvfile:
	reader = csv.DictReader(csvfile)

	for row in reader:
		planet = {}
		planet['id'] = identifier
		planet['name'] = row['NAME']

		try:
			planet['radius'] = float(row['R'])
		except ValueError:
			print('Radius not a float: ' + row['R'])

		try:
			planet['radius'] = float(row['MASS'])
		except ValueError:
			print('Mass not a float: ' + row['MASS'])

		planets.append(planet)
		identifier += 1

with open(input_file + '.json', 'w') as outfile:
    json.dump({'planets': planets}, outfile)

