// eslint-disable-next-line
const mongoose = require('mongoose');
// eslint-disable-next-line
const dotenv = require('dotenv');
// eslint-disable-next-line
const geolib = require('geolib');
dotenv.config();
const { Schema } = mongoose;

// Define the Company schema
const CompanySchema = new Schema({
  parent_company_id: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
  },
  name: { type: String, required: true },
});

// Define the Station schema
const StationSchema = new Schema({
  name: { type: String, required: true },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  company_id: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  address: { type: String, required: true },
});

StationSchema.index({ location: '2dsphere' });

const Company = mongoose.model('Company', CompanySchema);
const Station = mongoose.model('Station', StationSchema);

async function seedDatabase() {
  await mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
    dbName: process.env.MONGODB_DATABASE,
  });

  console.log('Connected to MongoDB');
  console.log('Ensuring indexes are created');
  await Company.ensureIndexes();
  await Station.ensureIndexes();

  console.log('Indexes created');
  console.log('Clearing existing data');
  await Company.deleteMany({});
  await Station.deleteMany({});

  console.log('Inserting companies');
  const companyA = new Company({ name: 'Company A' });
  const companyB = new Company({
    name: 'Company B',
    parent_company_id: companyA._id,
  });
  const companyC = new Company({
    name: 'Company C',
    parent_company_id: companyB._id,
  });

  await companyA.save();
  await companyB.save();
  await companyC.save();

  const finlandLat = 64.0;
  const finlandLon = 26.0;

  // Function to generate random coordinates within a 0 to 30 km radius around a given point
  const getRandomCoordinates = (centerLat, centerLon) => {
    const radius = Math.random() * 3000; // Distance between 0m and 30000m (0km to 30km)
    const randomPoint = geolib.computeDestinationPoint(
      { latitude: centerLat, longitude: centerLon },
      radius,
      Math.random() * 360, // Random bearing
    );

    return [randomPoint.longitude, randomPoint.latitude];
  };

  const addresses = [
    'Kauppakartanonkatu 18, 00930 Helsinki',
    'Mannerheimintie 22, 00100 Helsinki',
    'Aleksanterinkatu 52, 00100 Helsinki',
    'Esplanadi 40, 00130 Helsinki',
    'Lönnrotinkatu 5, 00120 Helsinki',
    'Fredrikinkatu 30, 00120 Helsinki',
    'Bulevardi 31, 00120 Helsinki',
    'Korkeavuorenkatu 35, 00130 Helsinki',
    'Pohjoisesplanadi 29, 00100 Helsinki',
    'Eerikinkatu 27, 00180 Helsinki',
    'Hämeentie 15, 00500 Helsinki',
    'Runeberginkatu 4, 00100 Helsinki',
    'Mechelininkatu 10, 00100 Helsinki',
    'Tehtaankatu 20, 00150 Helsinki',
    'Iso Roobertinkatu 12, 00120 Helsinki',
    'Hietalahdenranta 5, 00120 Helsinki',
    'Kaivokatu 8, 00100 Helsinki',
  ];

  const sharedCoordinates = getRandomCoordinates(finlandLat, finlandLon);

  const stations = [
    // Company A stations (10 stations)
    {
      name: 'Charging Station 1',
      location: { type: 'Point', coordinates: sharedCoordinates },
      company_id: companyA._id,
      address: addresses[0],
    },
    {
      name: 'Charging Station 2',
      location: {
        type: 'Point',
        coordinates: getRandomCoordinates(finlandLat, finlandLon),
      },
      company_id: companyA._id,
      address: addresses[1],
    },
    {
      name: 'Charging Station 3',
      location: {
        type: 'Point',
        coordinates: getRandomCoordinates(finlandLat, finlandLon),
      },
      company_id: companyA._id,
      address: addresses[2],
    },
    {
      name: 'Charging Station 4',
      location: {
        type: 'Point',
        coordinates: getRandomCoordinates(finlandLat, finlandLon),
      },
      company_id: companyA._id,
      address: addresses[3],
    },
    {
      name: 'Charging Station 5',
      location: {
        type: 'Point',
        coordinates: getRandomCoordinates(finlandLat, finlandLon),
      },
      company_id: companyA._id,
      address: addresses[4],
    },
    {
      name: 'Charging Station 6',
      location: {
        type: 'Point',
        coordinates: getRandomCoordinates(finlandLat, finlandLon),
      },
      company_id: companyA._id,
      address: addresses[5],
    },
    {
      name: 'Charging Station 7',
      location: {
        type: 'Point',
        coordinates: getRandomCoordinates(finlandLat, finlandLon),
      },
      company_id: companyA._id,
      address: addresses[6],
    },
    {
      name: 'Charging Station 8',
      location: {
        type: 'Point',
        coordinates: getRandomCoordinates(finlandLat, finlandLon),
      },
      company_id: companyA._id,
      address: addresses[7],
    },
    {
      name: 'Charging Station 9',
      location: {
        type: 'Point',
        coordinates: getRandomCoordinates(finlandLat, finlandLon),
      },
      company_id: companyA._id,
      address: addresses[8],
    },
    {
      name: 'Charging Station 10',
      location: {
        type: 'Point',
        coordinates: getRandomCoordinates(finlandLat, finlandLon),
      },
      company_id: companyA._id,
      address: addresses[9],
    },

    // Company B stations (5 stations)
    {
      name: 'Charging Station 11',
      location: { type: 'Point', coordinates: sharedCoordinates },
      company_id: companyB._id,
      address: addresses[10],
    },
    {
      name: 'Charging Station 12',
      location: {
        type: 'Point',
        coordinates: getRandomCoordinates(finlandLat, finlandLon),
      },
      company_id: companyB._id,
      address: addresses[11],
    },
    {
      name: 'Charging Station 13',
      location: {
        type: 'Point',
        coordinates: getRandomCoordinates(finlandLat, finlandLon),
      },
      company_id: companyB._id,
      address: addresses[12],
    },
    {
      name: 'Charging Station 14',
      location: {
        type: 'Point',
        coordinates: getRandomCoordinates(finlandLat, finlandLon),
      },
      company_id: companyB._id,
      address: addresses[13],
    },
    {
      name: 'Charging Station 15',
      location: {
        type: 'Point',
        coordinates: getRandomCoordinates(finlandLat, finlandLon),
      },
      company_id: companyB._id,
      address: addresses[14],
    },

    // Company C stations (2 stations)
    {
      name: 'Charging Station 16',
      location: {
        type: 'Point',
        coordinates: getRandomCoordinates(finlandLat, finlandLon),
      },
      company_id: companyC._id,
      address: addresses[15],
    },
    {
      name: 'Charging Station 17',
      location: {
        type: 'Point',
        coordinates: getRandomCoordinates(finlandLat, finlandLon),
      },
      company_id: companyC._id,
      address: addresses[16],
    },
  ];

  console.log('Inserting stations');
  await Station.insertMany(stations);

  console.log('Database seeded successfully');
  mongoose.connection.close();
}

seedDatabase().catch((err) => {
  console.error('Error seeding database:', err);
  mongoose.connection.close();
});
