import EventsRepository from '../repositories/events-repository.js';

export default class EventsService {
    getAllAsync = async (limit, offset) => {
        const repo = new EventsRepository();
        const returnArray = await repo.getAllAsync(limit, offset);
        return returnArray;
    }
}
