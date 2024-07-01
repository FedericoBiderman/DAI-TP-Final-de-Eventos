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

    createEventAsync = async (event) => {
        const repo = new EventsRepository();
        const returnObject = await repo.createEventAsync(event);
        return returnObject;
    }

    updateEventAsync = async (event) => {
        const repo = new EventsRepository();
        const returnObject = await repo.updateEventAsync(event);
        return returnObject;
    }

    deleteEventAsync = async (id, userId) => {
        const repo = new EventsRepository();
        const returnObject = await repo.deleteEventAsync(id, userId);
        return returnObject;
    }
}
