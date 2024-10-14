import UserRepository from './../repositories/users-repository.js';

export default class UserService {
  getAllAsync = async (username, password) => {
    const repo = new UserRepository();
    const returnArray = await repo.getAllAsync(username, password);
    return returnArray;
  }

  getByIdAsync = async (id) => {
    const repo = new UserRepository();
    const returnEntity = await repo.getByIdAsync(id);
    return returnEntity;
  }
  
  createUser = async (entity) => {   
    const repo = new UserRepository();
    const rowsAffected = await repo.createUser(entity);
    return rowsAffected;
  }
}