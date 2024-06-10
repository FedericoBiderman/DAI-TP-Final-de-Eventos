import EventsRepository from '../repositories/events-repository.js';

export default class EventsService {
    getAllAsync = async (limit, offset,name, category) => {
        const repo = new EventsRepository();
        const returnArray = await repo.getAllAsync(limit, offset, name, category);
        return returnArray;
    }

    createAsync = async (entity) => {   
        const repo = new EventsRepository();
        const rowsAffected = await repo.createAsync(entity);
        return rowsAffected;
      }

    updateAsync = async (entity) => {
        const repo = new EventsRepository();
        const rowsAffected = await repo.updateAsync(entity);
        return rowsAffected;
    }

    deleteByIdAsync = async (id) => {
        const repo = new EventsRepository();
        const rowsAffected = await repo.deleteByIdAsync(id);
        return rowsAffected;
    }

    getByIdAsync = async (id) => {
        const repo = new EventsRepository();
        const returnEntity = await repo.getByIdAsync(id);
        return returnEntity;
    }

    getEventDetailsAsync = async (id) => {
        const repo = new EventsRepository();
        const returnEntity = await repo.getByIdAsync(id);
        return returnEntity;
    }

    getEventEnrollmentsAsync = async (id) => {
        const repo = new EventsRepository();
        const returnEntity = await repo.getByIdAsync(id);
        return returnEntity;
    }

    getEventsAsync = async (limit, offset) => {
        const repo = new EventsRepository();
        const returnArray = await repo.getEventsAsync(limit, offset);
        return returnArray;
    }

    searchEvents = async (filters) => {
        const repo = new EventsRepository();
        const returnObject = await repo.searchEvents(filters);
        return returnObject;
    }
}
