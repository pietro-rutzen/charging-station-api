export const LAT_QUERY = {
  name: 'lat',
  example: 64.08,
  description: 'Latitude of the location',
  required: true,
};

export const LNG_QUERY = {
  name: 'lng',
  example: 26.13,
  description: 'Longitude of the location',
  required: true,
};

export const RADIUS_QUERY = {
  name: 'radius',
  example: 20,
  description: 'Search radius in kilometers',
  required: true,
};

export const COMPANY_ID_QUERY = {
  name: 'company_id',
  example: '6699719eee1af6da9aa6dc44',
  description: 'ID of the company',
  required: true,
};

export const STATION_ID_QUERY = {
  name: 'id',
  example: '6699719eee1af6da9aa6dc4a',
  description: 'ID of the charging station',
  required: true,
};

const SINGLE_CHARGING_STATION_SCHEMA = {
  type: 'object',
  properties: {
    _id: { type: 'string', example: '6699719eee1af6da9aa6dc56' },
    name: { type: 'string', example: 'Charging Station 13' },
    latitude: { type: 'number', example: 64.01682038958333 },
    longitude: { type: 'number', example: 25.99188464054383 },
    company_id: { type: 'string', example: '6699719eee1af6da9aa6dc45' },
    address: { type: 'string', example: 'Mechelininkatu 10, 00100 Helsinki' },
    distance: { type: 'number', example: 9733.085282968641 },
  },
};

export const CREATE_CHARGING_STATION_RESPONSE_DOCS = {
  status: 201,
  description: 'Creates one charging station',
  schema: SINGLE_CHARGING_STATION_SCHEMA,
};

export const GET_ALL_CHARGING_STATIONS_DOCS = {
  status: 200,
  description:
    'Gets all charging stations, regardless of location and company ownership',
  schema: {
    type: 'array',
    items: SINGLE_CHARGING_STATION_SCHEMA,
  },
};

export const GET_NEAR_CHARGING_STATIONS_RESPONSE_DOCS = {
  status: 200,
  description:
    'Gets all charging stations near a location, by parent company ID while grouping by location',
  schema: {
    type: 'object',
    properties: {
      stations: {
        type: 'array',
        items: SINGLE_CHARGING_STATION_SCHEMA,
      },
      count: { type: 'number', example: 1 },
    },
  },
};

export const GET_ONE_CHARGING_STATION_RESPONSE_DOCS = {
  status: 200,
  description: 'Gets one charging station by its ID',
  schema: SINGLE_CHARGING_STATION_SCHEMA,
};

export const UPDATE_CHARGING_STATION_RESPONSE_DOCS = {
  status: 200,
  description:
    'Updates one charging station by its ID, returning the updated document',
  schema: SINGLE_CHARGING_STATION_SCHEMA,
};

export const DELETE_CHARGING_STATION_RESPONSE_DOCS = {
  status: 200,
  description:
    'Deletes one charging station by its ID, returning the deleted document',
  schema: SINGLE_CHARGING_STATION_SCHEMA,
};
