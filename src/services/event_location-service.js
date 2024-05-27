import Event_locationRepository from '../repositories/event_location-repository.js';

export default class Event_locationService {
  // Clase con lógica de negocio.
  getAllAsync = async () => {
    const repo = new Event_locationRepository();
    const returnArray = await repo.getAllAsync();
    return returnArray;
  }
  
  getByIdAsync = async (id) => {
    const repo = new Event_locationRepository();
    const returnEntity = await repo.getByIdAsync(id);
    return returnEntity;
  }

  createAsync = async (entity) => {   
    const repo = new Event_locationRepository();
    const rowsAffected = await repo.createAsync(entity);
    return rowsAffected;
  }
  
  updateAsync = async (entity) => {
    const repo = new Event_locationRepository();
    const rowsAffected = await repo.updateAsync(entity);
    return rowsAffected;
  }

  deleteByIdAsync = async (id) => {
    const repo = new Event_locationRepository();
    const rowsAffected = await repo.deleteByIdAsync(id);
    return rowsAffected;
  }
}