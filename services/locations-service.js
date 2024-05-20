import LocationsRepository from '../repositories/locations-repository.js';

export default class LocationsService {
  // Clase con lógica de negocio.
  getAllAsync = async () => {
    const repo = new LocationsRepository();
    const returnArray = await repo.getAllAsync();
    return returnArray;
  }
  
  getByIdAsync = async (id) => {
    const repo = new LocationsRepository();
    const returnEntity = await repo.getByIdAsync(id);
    return returnEntity;
  }

  getEventLocationsByLocationIdAsync = async (id) => {
    const repo = new LocationsRepository();
    const returnEntity = await repo.getEventLocationsByLocationIdAsync(id);
    return returnEntity;
  }
}