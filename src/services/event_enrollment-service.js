import Event_enrollmentRepository from '../repositories/event_enrollment-repository.js';

export default class Event_enrollmentService {
  // Clase con lógica de negocio.
  getAllAsync = async () => {
    const repo = new Event_enrollmentRepository();
    const returnArray = await repo.getAllAsync();
    return returnArray;
  }
}