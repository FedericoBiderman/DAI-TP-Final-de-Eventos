import CategoriesRepository from '../repositories/event_categories-repository.js';

export default class CategoriesService {
  // Clase con lógica de negocio.
  getAllAsync = async () => {
    const repo = new CategoriesRepository();
    const returnArray = await repo.getAllAsync();
    return returnArray;
  }
  
  getByIdAsync = async (id) => {
    const repo = new CategoriesRepository();
    const returnEntity = await repo.getByIdAsync(id);
    return returnEntity;
  }
  createAsync = async (entity) => {   
    const repo = new CategoriesRepository();
    const rowsAffected = await repo.createAsync(entity);
    return rowsAffected;
  }
  updateAsync = async (entity) => {
    const repo = new CategoriesRepository();
    const rowsAffected = await repo.updateAsync(entity);
    return rowsAffected;
  }
  deleteByIdAsync = async (id) => {
    const repo = new CategoriesRepository();
    const rowsAffected = await repo.deleteByIdAsync(id);
    return rowsAffected;
  }
}
