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
router.get('/', async (req, res) => {
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
router.get('/:id', async (req, res) => {
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
    try {
        console.log("usuario logueado:", req.user);
        event.id_creator_user = req.user.id;
        if (event.name.length < 3) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'El nombre del evento debe tener al menos 3 caracteres' });
        }
        const createdEvent = await svc.createEventAsync(event);
        res.status(StatusCodes.CREATED).json(createdEvent);
    } catch (error) {
        console.error('Error al crear el evento:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
        
    }
});
router.put('/', authenticateToken, async (req, res) => {
    const event = req.body;
    const userId = req.user.id;

    try {
        if (event.name.length < 3) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'El nombre del evento debe tener al menos 3 caracteres' });
        }

        const updatedEvent = await svc.updateEventAsync(event, userId);

        if (!updatedEvent) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'Evento no encontrado' });
        }

        res.status(StatusCodes.OK).json(updatedEvent);
    } catch (error) {
        if (error.status === 404) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
});


// Eliminar un evento
router.delete('/:id', authenticateToken, async (req, res) => {
    const eventId = req.params.id;
    const userId = req.user.id;

    try {
        const deletedEvent = await svc.deleteEventAsync(eventId, userId);

        if (!deletedEvent) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'Evento no encontrado' });
        }

        res.status(StatusCodes.OK).json(deletedEvent);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
});

export default router;
