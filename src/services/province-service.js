import ProvinceRepository from '../repositories/province-repository.js';

export default class ProvinceService {
  // Clase con lógica de negocio.
  getAllAsync = async () => {
    const repo = new ProvinceRepository();
    const returnArray = await repo.getAllAsync();
    return returnArray;
  }
  
  getByIdAsync = async (id) => {
    const repo = new ProvinceRepository();
    const returnEntity = await repo.getByIdAsync(id);
    return returnEntity;
  }

  getByLocationId = async (id) => {
    const repo = new ProvinceRepository();
    const returnEntity = await repo.getByLocationId(id);
    return returnEntity;
  }
  createAsync = async (entity) => {   
    const repo = new ProvinceRepository();
    const rowsAffected = await repo.createAsync(entity);
    return rowsAffected;
  }
  updateAsync = async (entity) => {
    const repo = new ProvinceRepository();
    const rowsAffected = await repo.updateAsync(entity);
    return rowsAffected;
  }
  deleteByIdAsync = async (id) => {
    const repo = new ProvinceRepository();
    const rowsAffected = await repo.deleteByIdAsync(id);
    return rowsAffected;
  }
}
