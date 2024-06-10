import {Router} from 'express';
import EventsService from '../services/events-service.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { StatusCodes } from 'http-status-codes';
const router = Router();
const svc = new EventsService();


router.get('', async (req, res) => {
    let respuesta;
    let limit = req.query.limit;
    let offset = req.query.offset;
    let name = req.query.name;
    let category= req.query.category

    limit = parseInt(limit);
    offset = parseInt(offset);
    if (isNaN(limit) || isNaN(offset)) {
        res.status(400).send("Limit o offset no son números válidos");
    } else {
        try {
            const returnArray = await svc.getAllAsync(limit, offset, name, category);
            if (returnArray !== null && returnArray.length > 0) {
                respuesta = res.status(StatusCodes.OK).json(returnArray);
            } else if (returnArray !== null && returnArray.length === 0) {
                respuesta = res.status(StatusCodes.NOT_FOUND).json({ message: "No se encontraron eventos con el nombre especificado." });
            } else {
                respuesta = res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error interno." });
            }
        } catch (error) {
            console.error(error);
            respuesta = res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error interno del servidor." });
        }
        return respuesta;
    }
});


router.post('/', authenticateToken, async (req, res) => {
    let respuesta;
    let entity = req.body;
  const registrosAfectados = await svc.createAsync(entity);
    const id_creator_user = req.user.id;

    if (!registrosAfectados.name || !registrosAfectados.description || registrosAfectados.name.length < 3 || registrosAfectados.description.length < 3) {
        respuesta = res.status(StatusCodes.BAD_REQUEST).json(registrosAfectados).send(`El nombre o la descripción son inválidos.`);
    }

    if (registrosAfectados.max_assistance > registrosAfectados.max_capacity) {
        respuesta = res.status(StatusCodes.BAD_REQUEST).json(registrosAfectados).send('El max_assistance es mayor que el max_capacity.');
    }

    if (registrosAfectados.price < 0 || registrosAfectados.duration_in_minutes < 0) {
        respuesta = res.status(StatusCodes.BAD_REQUEST).json(registrosAfectados).send('El precio o la duración son inválidos.');
    }

    try {
        const newEvent = await createAsync({ 
            name: entity.name, 
            description: entity.description, 
            id_event_category: entity.id_event_category, 
            id_event_location: entity.id_event_location, 
            start_date: entity.start_date, 
            duration_in_minutes: entity.duration_in_minutes, 
            price: entity.price, 
            enabled_for_enrollment: entity.enabled_for_enrollment, 
            max_assistance: entity.max_assistance, 
            id_creator_user: entity.id_creator_user 
        });
        respuesta = res.status(StatusCodes.CREATED).json(newEvent);
    } catch (error) {
        respuesta = res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Error interno.`);
    }

    return respuesta;
});

router.put('/', authenticateToken, async (req, res) => {
    let respuesta;
    let entity = req.body;
    const registrosAfectados = await svc.updateAsync(entity);
    const id_creator_user = req.user.id;

    
    if (!registrosAfectados.name || !registrosAfectados.description || registrosAfectados.name.length < 3 || registrosAfectados.description.length < 3) {
        respuesta = res.status(StatusCodes.BAD_REQUEST).json(registrosAfectados).send(`El nombre o la descripción son inválidos.`);
    }

    if (registrosAfectados.max_assistance > registrosAfectados.max_capacity) {
        respuesta = res.status(StatusCodes.BAD_REQUEST).json(registrosAfectados).send('El max_assistance es mayor que el max_capacity.');
    }

    if (registrosAfectados.price < 0 || registrosAfectados.duration_in_minutes < 0) {
        respuesta = res.status(StatusCodes.BAD_REQUEST).json(registrosAfectados).send('El precio o la duración son inválidos.');
    }

    try {
        const event = await getEventByIdAsync(id);
        if (!event || event.id_creator_user !== id_creator_user) {
            respuesta = res.status(StatusCodes.NOT_FOUND).send('Evento no encontrado o no pertenece al usuario.');
        }

        const eventUpdate = await updateAsync({ id: entity.id,      
            name: entity.name, 
            description: entity.description, 
            id_event_category: entity.id_event_category, 
            id_event_location: entity.id_event_location, 
            start_date: entity.start_date, 
            duration_in_minutes: entity.duration_in_minutes, 
            price: entity.price, 
            enabled_for_enrollment: entity.enabled_for_enrollment, 
            max_assistance: entity.max_assistance, 
            id_creator_user: entity.id_creator_user });
            respuesta = res.status(StatusCodes.OK).json(eventUpdate);
    } catch (error) {
        respuesta = res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Error interno.');
    }
    return respuesta;
});

router.delete('/:id', authenticateToken, async (req, res) => {
    let respuesta;
    const eventId = req.params.id;
    const id_creator_user = req.user.id;

    try {
        const event = await getEventByIdAsync(id);
        if (!event || event.id_creator_user !== id_creator_user) {
            respuesta = res.status(StatusCodes.NOT_FOUND).send('Evento no encontrado o no pertenece al usuario.');
        }

        // Validar que no haya usuarios registrados al evento
        // Este es un ejemplo y debe ser implementado
        const hasUsersRegistered = false; // Implementar esta lógica
        if (hasUsersRegistered) {
            respuesta = res.status(StatusCodes.NOT_FOUND).send('Hay usuarios registrados en el evento.');
        }

        await deleteByIdAsync(eventId);
        respuesta = res.status(StatusCodes.OK).send('Se ha eliminado el evento correctamente.');
    } catch (error) {
        respuesta = res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Error interno.');
    }

    return respuesta;
});

router.get('/:id', async (req, res) => {
    let respuesta;
    const eventId = req.params.id;

    try {
        const eventDetails = await getEventDetailsById(eventId);
        if (!eventDetails) {
            respuesta = res.status(StatusCodes.NOT_FOUND).send('Evento no encontrado.');
        }
        respuesta = res.status(StatusCodes.OK).json(eventDetails);
    } catch (error) {
        respuesta = res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Error interno.');
    }
    return respuesta;
});

router.get('/', async (req, res) => {
    let respuesta;
    const { name, category, startdate, tag } = req.query;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = parseInt(req.query.offset, 10) || 0;

    const filters = {
        name,
        category,
        startdate,
        tag,
        limit,
        offset
    };

    try {
        const { events, total } = await searchEvents(filters);
        const nextPage = offset + limit < total ? `/api/event?${new URLSearchParams({ name, category, startdate, tag, limit, offset: offset + limit }).toString()}` : null;
        respuesta = res.status(StatusCodes.OK).json({
            collection: events,
            pagination: {
                limit,
                offset,
                total,
                nextPage
            }
        });
    } catch (error) {
        respuesta = res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Error interno.');
    }
    return respuesta;
});


export default router;

