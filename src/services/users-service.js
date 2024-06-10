import UserRepository from './../repositories/users-repository.js';

export default class ProvinceService {
  getAllAsync = async (username, password) => {
    const repo = new UserRepository();
    const returnArray = await repo.getAllAsync(username, password);
    return returnArray;
  }
  
  createUser = async (entity) => {   
    const repo = new UserRepository();
    const rowsAffected = await repo.createAsync(entity);
    return rowsAffected;
  }
}