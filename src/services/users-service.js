import UserRepository from './../repositories/users-repository.js';

export default class ProvinceService {
  getAllAsync = async () => {
    const repo = new UserRepository();
    const returnArray = await repo.getAllAsync();
    return returnArray;
  }
  
  createUser = async (entity) => {   
    const repo = new UserRepository();
    const rowsAffected = await repo.createAsync(entity);
    return rowsAffected;
  }
}