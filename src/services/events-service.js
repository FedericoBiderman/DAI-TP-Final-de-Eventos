import EventsRepository from '../repositories/events-repository.js';

export default class EventsService {
    getEventsAsync = async (limit, offset) => {
        const repo = new EventsRepository();
        const returnObject = await repo.getEventsAsync(limit, offset);
        return returnObject;
    }

    searchEventsAsync = async (filters) => {
        const repo = new EventsRepository();
        const returnObject = await repo.searchEventsAsync(filters);
        return returnObject;
    }

    getEventDetailsByIdAsync = async (eventId) => {
        const repo = new EventsRepository();
        const returnObject = await repo.getEventDetailsByIdAsync(eventId);
        return returnObject;
    }
}
