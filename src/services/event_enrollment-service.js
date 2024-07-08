import Event_enrollmentRepository from '../repositories/event_enrollment-repository.js';

export default class Event_enrollmentService {
    // Registrar a un usuario en un evento
    registerUserAsync = async (eventId, userId) => {
        const repo = new Event_enrollmentRepository();
        const registrationDateTime = new Date().toISOString();
        const rowsAffected = await repo.registerUserAsync(eventId, userId, registrationDateTime);
        return rowsAffected;
    }

    // Eliminar la inscripción de un usuario de un evento
    removeUserAsync = async (eventId, userId) => {
        const repo = new Event_enrollmentRepository();
        const rowsAffected = await repo.removeUserAsync(eventId, userId);
        return rowsAffected;
    }

    

    // Actualizar el rating de un evento
    updateRatingAsync = async (eventId, userId, rating, observations) => {
        const repo = new Event_enrollmentRepository();
        const rowsAffected = await repo.updateRatingAsync(eventId, userId, rating, observations);
        return rowsAffected;
    }

    getFilteredEnrollmentsAsync = async (eventId, filters) => {
        const repo = new Event_enrollmentRepository();
        const returnArray = await repo.getFilteredEnrollmentsAsync(eventId, filters);
        return returnArray;
    }
}


