import { Router } from "express";
import EventsService from '../services/events-service.js';
import { StatusCodes } from "http-status-codes";
import { authenticateToken } from "../middlewares/auth.middleware.js";
const router = Router();
const svc = new EventsService();

// Obtener eventos (paginado)
/*router.get('/',  async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    
    try {
        const events = await svc.getEventsAsync(limit, offset);
        res.status(StatusCodes.OK).json(events);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
});
*/
// Buscar eventos
router.get('/',  async (req, res) => {
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

router.post('/', authenticateToken, async (req, res) => {
    const event = req.body;
    const userId = req.user.id;

    try {
        const createdEvent = await svc.createEventAsync(event, userId);
        res.status(StatusCodes.CREATED).json(createdEvent);
    } catch (error) {
        if (error.status) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }
});

// Actualizar un evento
router.put('/', authenticateToken, async (req, res) => {
    const event = req.body;
    const userId = req.user.id;

    try {
        const updatedEvent = await svc.updateEventAsync(event, userId);
        res.status(StatusCodes.OK).json(updatedEvent);
    } catch (error) {
        if (error.status) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }
});

// Eliminar un evento
router.delete('/:id', authenticateToken, async (req, res) => {
    const eventId = req.params.id;
    const userId = req.user.id;

    try {
        const deletedEvent = await svc.deleteEventAsync(eventId, userId);
        res.status(StatusCodes.OK).json(deletedEvent);
    } catch (error) {
        if (error.status) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }
});

export default router;
