import csv
import json
import math

JUPITER_RADIUS_KM = 71492

RADIUS_KEY = 'r'

identifier = 0

class Source():

	def __init__(self, name, file_name, mapper, converter, post_process = None):
		self.name = name
		self.file_name = file_name
		self.mapper = mapper
		self.converter = converter

		if post_process is None:
			def default_post_process(body):
				pass
			self.post_process = default_post_process
		else:
			self.post_process = post_process

		self.data = []

star_mapper = {
	# 'id': 'id',
	'proper': 'n',
	# 'hip': 'hip',
	# 'hd': 'henry_draper_number',
	# 'hr': 'bright_star_catalog_number',
	# 'gl': 'gliese_catalog_number',
	# 'bf': 'bayer_flamsteed',
	# 'ra': 'right_ascension',
	# 'dec': 'declination',
	# 'dist': 'parsec_distance',
	# 'pmra': '',
	# 'pmdec': '',
	# 'rv': '',
	# 'spect': 'spectral_type',
	# 'x': 'position_x',
	# 'y': 'position_y',
	# 'z': 'position_z',
	# 'vx': 'velocity_x',
	# 'vy': 'velocity_y',
	# 'vz': 'velocity_z',
	# 'rarad': '',
	# 'decrad': '',
	# 'pmrarad': '',
	# 'pmdecrad': '',
	# 'bayer': '',
	# 'flam': '',
	# 'con': '',
	# 'comp': '',
	# 'comp_primary': '',
	# 'base': '',
	# 'lum': 'luminosity'
	# 'var': '',
	# 'var_min': '',
	# 'var_max': '',
	# 'mag': 'visual_magnitude',
	'absmag': 'absolute_magnitude',
	'ci': 'colour_index'
}

star_converter = {
	'absolute_magnitude': float,
	'colour_index': float
}

def colour_index_to_temperature(colour_index):
	return 4600 * ((1 / (0.92 * colour_index + 1.7)) + (1 / (0.92 * colour_index + 0.62)))

def radius_ratio(temperature, absolute_magnitude):
	return math.pow(5800 / temperature, 2.0) * math.pow(math.pow(2.512, 4.83 - absolute_magnitude), 0.5)

def to_radius_km(colour_index, absolute_magnitude):
	return 696000 * radius_ratio(colour_index_to_temperature(colour_index), absolute_magnitude)
	
def star_post_process(star):
	if 'colour_index' in star and 'absolute_magnitude' in star and star['colour_index'] is not None and star['absolute_magnitude'] is not None:
		star[RADIUS_KEY] = to_radius_km(star['colour_index'], star['absolute_magnitude'])
		star.pop('colour_index', None)
		star.pop('absolute_magnitude', None)


exoplanet_file = 'exoplanets.1436203548'

exoplanet_mapper = {
	'NAME': 'n',
	# 'OTHERNAME': 'other_name',
	# 'COMP': 'planet_name',
	# 'HD': 'henry_draper_number',
	# 'HR': 'bright_star_catalog_number',
	# 'HIPP': 'hipparcos_catalog_number',
	# 'SAO': 'smithsonian_astrophysical_catalog_number',
	# 'GL': 'gliese_catalog_number',
	# 'BINARY': 'is_multiple_star_system',
	# 'RA': 'right_ascension',
	# 'DEC': 'declination',
	# 'KEPID': 'kepler_id',
	# 'PER': 'orbital_period',
	# 'ECC': 'orbital_eccentricity',
	# 'OM': 'argument_of_periastron',
	# 'K': 'velocity_semiamplitude',
	# 'T0': 'time_of_periastron',
	# 'DVDT': 'velocity_slope',
	# 'I': 'orbit_inclination',
	# 'MSINI': 'minimum_mass_of_planet',
	# 'A': 'semi_major_axis',
	# 'SEP': 'separation',
	# 'LAMBDA': 'spin_orbit_misalignment',
	# 'BIGOM': 'longitude_of_ascending_node',

	# 'DEPTH': 'transit_depth',
	# 'T14': 'duration_of_transit',
	# 'TT': 'epoch_of_transit_center',
	'R': RADIUS_KEY
	# 'MASS': 'm',
	# 'AR': 'semi_major_axis_to_stellar_radius_ratio',
	# 'B': 'impact_parameter',
	# 'DENSITY': 'd',
	# 'GRAVITY': 'g',
	# 'RR': 'planet_star_radius_ratio',

	# 'STAR': 'star_name',
	# 'MSTAR': 'star_mass',
	# 'RSTAR': 'star_radius',
	# 'TEFF': 'star_temperature',
	# 'RHOSTAR': 'star_density',
	# 'LOGG': 'star_gravity',
	# 'FE': 'star_iron_to_hydrogen_ratio',

	# 'JSNAME': 'exoplanet_link'
}

exoplanet_converter = {
	RADIUS_KEY: float
}

def exoplanet_post_process(exoplanet):
	if RADIUS_KEY in exoplanet and exoplanet[RADIUS_KEY] is not None:
		exoplanet[RADIUS_KEY] *= JUPITER_RADIUS_KM


sources = []
sources.append(Source('stars', 'stars.hygdata_v3', star_mapper, star_converter, star_post_process))
sources.append(Source('planets', 'exoplanets.1436203548', exoplanet_mapper, exoplanet_converter, exoplanet_post_process))

for s in sources:
	with open(s.file_name + '.csv', 'r') as csvfile:
		reader = csv.DictReader(csvfile)

		for row in reader:
			body = {}
			body['id'] = identifier

			skip = False

			for key,value in s.mapper.items():
				if row[key] == '' or row[key] is None:
					skip = True
				elif value in s.converter:
					try:
						body[value] = s.converter[value](row[key])
					except ValueError:
						skip = True
						print('Could not convert column ' + key + ' for value ' + row[key])
				else:
					body[value] = row[key]

			if skip:
				continue

			s.post_process(body)
			s.data.append(body)
			identifier += 1

result = {}
for s in sources:
	result[s.name] = s.data

with open('astronomical.json', 'w') as outfile:
    json.dump(result, outfile)
