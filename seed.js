// eslint-disable-next-line
const mongoose = require('mongoose');
// eslint-disable-next-line
const dotenv = require('dotenv');
dotenv.config();
const { Schema } = mongoose;

// Define the Company schema
const CompanySchema = new Schema({
  id: { type: String, required: true, unique: true },
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
  await Station.init();
  console.log('Indexes created');
  console.log('Clearing existing data');
  await Company.deleteMany({});
  await Station.deleteMany({});

  console.log('Inserting companies');
  const companyA = new Company({ id: 'A', name: 'Company A' });
  const companyB = new Company({
    id: 'B',
    name: 'Company B',
    parent_company_id: companyA._id,
  });
  const companyC = new Company({
    id: 'C',
    name: 'Company C',
    parent_company_id: companyB._id,
  });

  await companyA.save();
  await companyB.save();
  await companyC.save();

  const stations = [
    // Company A - 10 stations
    {
      name: 'Charging Station 1',
      location: {
        type: 'Point',
        coordinates: [25.082368457670785, 60.207724972363685],
      },
      company_id: companyA._id,
      address: 'Kauppakartanonkatu 18, 00930 Helsinki',
    },
    {
      name: 'Charging Station 2',
      location: {
        type: 'Point',
        coordinates: [25.083368457670785, 60.208724972363685],
      },
      company_id: companyA._id,
      address: 'Kauppakartanonkatu 20, 00930 Helsinki',
    },
    {
      name: 'Charging Station 3',
      location: {
        type: 'Point',
        coordinates: [25.084368457670785, 60.209724972363685],
      },
      company_id: companyA._id,
      address: 'Kauppakartanonkatu 22, 00930 Helsinki',
    },
    {
      name: 'Charging Station 4',
      location: {
        type: 'Point',
        coordinates: [25.085368457670785, 60.210724972363685],
      },
      company_id: companyA._id,
      address: 'Kauppakartanonkatu 24, 00930 Helsinki',
    },
    {
      name: 'Charging Station 5',
      location: {
        type: 'Point',
        coordinates: [25.086368457670785, 60.211724972363685],
      },
      company_id: companyA._id,
      address: 'Kauppakartanonkatu 26, 00930 Helsinki',
    },
    {
      name: 'Charging Station 6',
      location: {
        type: 'Point',
        coordinates: [25.087368457670785, 60.212724972363685],
      },
      company_id: companyA._id,
      address: 'Kauppakartanonkatu 28, 00930 Helsinki',
    },
    {
      name: 'Charging Station 7',
      location: {
        type: 'Point',
        coordinates: [25.088368457670785, 60.213724972363685],
      },
      company_id: companyA._id,
      address: 'Mannerheimintie 10, 00100 Helsinki',
    },
    {
      name: 'Charging Station 8',
      location: {
        type: 'Point',
        coordinates: [25.089368457670785, 60.214724972363685],
      },
      company_id: companyA._id,
      address: 'Mannerheimintie 12, 00100 Helsinki',
    },
    {
      name: 'Charging Station 9',
      location: {
        type: 'Point',
        coordinates: [25.090368457670785, 60.215724972363685],
      },
      company_id: companyA._id,
      address: 'Mannerheimintie 14, 00100 Helsinki',
    },
    {
      name: 'Charging Station 10',
      location: {
        type: 'Point',
        coordinates: [25.091368457670785, 60.216724972363685],
      },
      company_id: companyA._id,
      address: 'Mannerheimintie 16, 00100 Helsinki',
    },
    // Company B - 5 stations
    {
      name: 'Charging Station 11',
      location: {
        type: 'Point',
        coordinates: [25.092368457670785, 60.217724972363685],
      },
      company_id: companyB._id,
      address: 'Mannerheimintie 18, 00100 Helsinki',
    },
    {
      name: 'Charging Station 12',
      location: {
        type: 'Point',
        coordinates: [25.093368457670785, 60.218724972363685],
      },
      company_id: companyB._id,
      address: 'Aleksanterinkatu 1, 00100 Helsinki',
    },
    {
      name: 'Charging Station 13',
      location: {
        type: 'Point',
        coordinates: [25.094368457670785, 60.219724972363685],
      },
      company_id: companyB._id,
      address: 'Aleksanterinkatu 3, 00100 Helsinki',
    },
    {
      name: 'Charging Station 14',
      location: {
        type: 'Point',
        coordinates: [25.095368457670785, 60.220724972363685],
      },
      company_id: companyB._id,
      address: 'Aleksanterinkatu 5, 00100 Helsinki',
    },
    {
      name: 'Charging Station 15',
      location: {
        type: 'Point',
        coordinates: [25.096368457670785, 60.221724972363685],
      },
      company_id: companyB._id,
      address: 'Aleksanterinkatu 7, 00100 Helsinki',
    },
    // Company C - 2 stations
    {
      name: 'Charging Station 16',
      location: {
        type: 'Point',
        coordinates: [25.097368457670785, 60.222724972363685],
      },
      company_id: companyC._id,
      address: 'Aleksanterinkatu 9, 00100 Helsinki',
    },
    {
      name: 'Charging Station 17',
      location: {
        type: 'Point',
        coordinates: [25.098368457670785, 60.223724972363685],
      },
      company_id: companyC._id,
      address: 'Aleksanterinkatu 11, 00100 Helsinki',
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
