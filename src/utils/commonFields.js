export const worldField = {
  key: 'world_id',
  label: 'Monde',
  type: 'relation',
  relationTable: 'worlds',
  required: false,
  placeholder: 'Sélectionner un monde (optionnel)'
};

export const continentField = {
  key: 'continent_id',
  label: 'Continent',
  type: 'relation',
  relationTable: 'continents',
  required: false,
  filterBy: 'world_id',
  placeholder: 'Sélectionner un continent (optionnel)'
};

export const oceanField = {
  key: 'ocean_id',
  label: 'Océan / Mer',
  type: 'relation',
  relationTable: 'oceans',
  required: false,
  filterBy: 'world_id',
  placeholder: 'Sélectionner un océan ou une mer (optionnel)'
};

export const countryField = {
  key: 'country_id',
  label: 'Pays',
  type: 'relation',
  relationTable: 'countries',
  required: false,
  placeholder: 'Sélectionner un pays (optionnel)'
};
