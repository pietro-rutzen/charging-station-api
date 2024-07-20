
const API_URL = process.env.CHARGING_STATION_API_URL || 'http://charging-station-api:3000';
const STATION_API_ENDPOINT = `${API_URL}/station`;
interface Station {
  name: string;
  latitude: number;
  longitude: number;
  company_id: number;
  address: string;
}

interface GroupedStations {
  [companyId: number]: Station[];
}

const fetchStations = async (): Promise<Station[]> => {
  try {
    const response = await fetch(STATION_API_ENDPOINT);
    if (!response.ok) {
      throw new Error(`Error fetching stations: ${response.statusText}`);
    }
    const data = await response.json() as Station[];
    return data;
  } catch (error) {
    console.error('Error fetching stations:', error);
    return [];
  }
};

const groupStationsByCompany = (
  stations: Station[],
): GroupedStations => {
  return stations.reduce(
    (groupedStations: GroupedStations, station: Station) => {
      const companyId = station.company_id;
      if (!groupedStations[companyId]) {
        groupedStations[companyId] = [];
      }
      groupedStations[companyId].push(station);
      return groupedStations;
    },
    {} as GroupedStations,
  );
};

const runStationGroupingService = async () => {
  try {
    console.log('Running station grouping service...');
    const stations = await fetchStations();
    if (stations.length === 0) {
      console.error('No stations found.');
      return;
    }
    const groupedStationsByCompany = groupStationsByCompany(stations);
    console.log('See logs below grouped stations by company.');
    console.log(groupedStationsByCompany);
    console.log('See above for grouped stations by company.');
  } catch (error) {
    console.error('Error running station grouping service:', error);
  }
};

runStationGroupingService();
