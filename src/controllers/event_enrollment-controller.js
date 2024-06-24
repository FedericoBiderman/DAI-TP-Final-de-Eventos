import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import Event_enrollmentService from "../services/event_enrollment-service.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
const router = Router();
const svc = new Event_enrollmentService();

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
      const userId = req.user.id; // Asumimos que el middleware `authenticateToken` añade el usuario al request
      const rowsAffected = await svc.registerUserAsync(eventId, userId);

      if (rowsAffected > 0) {
          res.status(StatusCodes.CREATED).send(`Usuario registrado al evento (id:${eventId}) exitosamente.`);
      } else {
          res.status(StatusCodes.BAD_REQUEST).send(`No se pudo registrar al usuario al evento (id:${eventId}).`);
      }
  } catch (error) {
      console.error(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json();
  }
});

router.delete("/:id/enrollment", authenticateToken, async (req, res) => {
  try {
      const eventId = req.params.id;
      const userId = req.user.id; // Asumimos que el middleware `authenticateToken` añade el usuario al request
      const rowsAffected = await svc.removeUserAsync(eventId, userId);

      if (rowsAffected > 0) {
          res.status(StatusCodes.OK).send(`Usuario removido del evento (id:${eventId}) exitosamente.`);
      } else {
          res.status(StatusCodes.BAD_REQUEST).send(`No se pudo remover al usuario del evento (id:${eventId}).`);
      }
  } catch (error) {
      console.error(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json();
  }
});

router.patch("/:id/enrollment/:userId", authenticateToken, async (req, res) => {
  try {
      const eventId = req.params.id;
      const userId = req.params.userId;
      const { rating, observations } = req.body;
      
      // Validar que el rating está entre 1 y 10
      if (rating < 1 || rating > 10) {
          return res.status(StatusCodes.BAD_REQUEST).send(`El rating debe estar entre 1 y 10.`);
      }

      const rowsAffected = await svc.updateRatingAsync(eventId, userId, rating, observations);

      if (rowsAffected > 0) {
          res.status(StatusCodes.OK).send(`Rating actualizado para el evento (id:${eventId}) exitosamente.`);
      } else {
          res.status(StatusCodes.BAD_REQUEST).send(`No se pudo actualizar el rating para el evento (id:${eventId}).`);
      }
  } catch (error) {
      console.error(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json();
  }
});

export default router;