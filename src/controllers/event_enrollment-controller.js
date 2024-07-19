import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import Event_enrollmentService from "../services/event_enrollment-service.js";
import Event_Service from "../services/events-service.js"
import { authenticateToken } from "../middlewares/auth.middleware.js";
const router = Router();
const svc = new Event_enrollmentService();
const svcEventos = new Event_Service();

router.get("/:id/enrollment", async (req, res) => {
    try {
        const eventId = req.params.id;
        const filters = {
            first_name: req.query.first_name,
            last_name: req.query.last_name,
            username: req.query.username,
            attended: req.query.attended,
            rating: req.query.rating
        };
        const returnArray = await svc.getFilteredEnrollmentsAsync(eventId, filters);
        if (returnArray.length > 0) {
            res.status(StatusCodes.OK).json({ collection: returnArray });
        } else {
            res.status(StatusCodes.NOT_FOUND).send(`No se encontraron inscripciones para el evento (id:${eventId}).`);
        }
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json();
    }
});
router.post("/:id/enrollment", authenticateToken, async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.user.id; 
  
        const eventDetails = await svcEventos.getEventDetailsByIdAsync(eventId);
  
        if (!eventDetails) {
            return res.status(StatusCodes.NOT_FOUND).send(`No existe el evento.`);
        }
  
        const rowsAffected = await svc.registerUserAsync(eventId, userId);
  
        if (rowsAffected > 0) {
            return res.status(StatusCodes.OK).send(`Usuario registrado al evento (id:${eventId}) exitosamente.`);
        } else if (rowsAffected === 0) {
            return res.status(StatusCodes.NOT_FOUND).send(`Evento no encontrado con ID: ${eventId}`);
        } else {
            return res.status(StatusCodes.BAD_REQUEST).send(`No se pudo registrar al usuario (id:${eventId}) exitosamente.`);
        }
  
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  });
  


router.delete("/:id/enrollment", authenticateToken, async (req, res) => {
  try {
      const eventId = req.params.id;
      const userId = req.user.id; // Asumimos que el middleware `authenticateToken` añade el usuario al request
      const rowsAffected = await svc.removeUserAsync(eventId, userId);

      if (rowsAffected > 0) {
          res.status(StatusCodes.OK).send(`Usuario removido del evento (id:${eventId}) exitosamente.`);
      }
          if (!rowsAffected) {
            res.status(StatusCodes.NOT_FOUND).send(`no se encontro el evento`);
          }
      else {
          res.status(StatusCodes.BAD_REQUEST).send(`No se pudo remover al usuario del evento (id:${eventId}).`);
      }
  } catch (error) {
      console.error(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json();
  }
});

router.patch('/:id/enrollment/:rating', authenticateToken, async (req, res) => {
    const eventId = req.params.id;
    const rating = req.params.rating;
    const userId = req.user.id;
    const { observations } = req.body;
    try {
        const rowsAffected = await svc.updateRatingAsync(eventId, userId, rating, observations);
        if (rowsAffected === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'No se encontró el evento para rankear.' });
        }
        return res.status(200).json({ message: 'Evento rankeado correctamente.' });
    } catch (error) {
        if (error.status === 404) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'No se pudo rankear el evento.' });
    }
});



export default router;




