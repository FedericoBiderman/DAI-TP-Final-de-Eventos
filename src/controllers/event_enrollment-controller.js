import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import Event_enrollmentService from "../services/event_enrollment-service.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
const router = Router();
const svc = new Event_enrollmentService(); // Instanciación del Service.

router.get("/:id/enrollments", authenticateToken, async (req, res) => {
  let respuesta;
  const returnArray = await svc.getAllAsync();
  if (returnArray != null) {
    respuesta = res.status(StatusCodes.OK).json(returnArray);
  } else {
    respuesta = res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Error interno.`);
  }
  return respuesta;
});
router.post("/:id/enrollments", authenticateToken, async (req, res) => {
  try {
    const returnArray = await svc.getAllAsync();
    if (returnArray != null) {
      const eventDate = new Date(returnArray.start_date);
      const today = new Date();
      const user = req.user;
      let respuesta;

      if (returnArray.max_assistance > returnArray.max_capacity) {
        respuesta = res.status(StatusCodes.BAD_REQUEST).json({ message: "El max_assistance es mayor que el max_capacity." });
      } else if (!returnArray.enabled_for_enrollment) {
        respuesta = res.status(StatusCodes.BAD_REQUEST).json({ message: "El evento no está habilitado para la inscripción." });
      } else if (eventDate <= today) {
        respuesta = res.status(StatusCodes.BAD_REQUEST).json({ message: "El evento ya ha ocurrido o está ocurriendo actualmente." });
      } else if (!user) {
        respuesta = res.status(StatusCodes.UNAUTHORIZED).json({ message: 'No autorizado. Se requiere autenticación.' });
      } else {
        respuesta = res.status(StatusCodes.OK).json(returnArray);
      }
    } else {
      respuesta = res.status(StatusCodes.NOT_FOUND).json({ message: "No se encontraron inscripciones para este evento." });
    }
  } catch (error) {
    console.error(error);
    respuesta = res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error interno del servidor." });
  }
  return respuesta;
});

router.delete("/:id/enrollments", authenticateToken, async (req, res) => {
  let respuesta;
  let id = req.params.id;
  const registrosAfectados = await svc.deleteByIdAsync(id);
  if (registrosAfectados != 0) {
    respuesta = res.status(StatusCodes.OK).json(respuesta);
  } else {
    respuesta = res
      .status(StatusCodes.NOT_FOUND)
      .send(`no se encontro la entidad (id:${entity.id}).`);
  }
  return respuesta;
});

export default router;
