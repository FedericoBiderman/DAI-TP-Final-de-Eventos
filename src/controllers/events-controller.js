import { Router } from "express";
import EventsService from '../services/events-service.js';
import { StatusCodes } from "http-status-codes";
const router = Router();
const svc = new EventsService();

// Obtener eventos (paginado)
router.get('/',  async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    
    try {
        const events = await svc.getEventsAsync(limit, offset);
        res.status(StatusCodes.OK).json(events);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
});

// Buscar eventos
router.get('/search',  async (req, res) => {
    const { name, category, startdate, tag, limit, offset } = req.query;
    const filters = { name, category, startdate, tag, limit: parseInt(limit) || 10, offset: parseInt(offset) || 0 };

    try {
        const events = await svc.searchEventsAsync(filters);
        res.status(StatusCodes.OK).json(events);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
});

// Obtener detalle de un evento
router.get('/:id',   async (req, res) => {
    const eventId = req.params.id;

    try {
        const eventDetails = await svc.getEventDetailsByIdAsync(eventId);
        if (!eventDetails) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Evento no encontrado.' });
        }
        res.status(StatusCodes.OK).json(eventDetails);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
});

export default router;
