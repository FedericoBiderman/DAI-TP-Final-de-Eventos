import {Router} from 'express';
import { StatusCodes } from 'http-status-codes';
import LocationsService from './../services/locations-service.js'
const router = Router();
const svc    = new LocationsService();		// Instanciación del Service.

router.get('', async (req, res) => {
  let respuesta;
  const returnArray = await svc.getAllAsync();
  if (returnArray != null){
    respuesta = res.status(StatusCodes.OK).json(returnArray);
  } else {
    respuesta = res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Error interno.`);
  }
  return respuesta;
});

router.get('/:id', async (req, res) => {
  let respuesta;
  let id = req.params.id;
  const returnEntity = await svc.getByIdAsync(id);
  if (returnEntity != null){
    respuesta = res.status(StatusCodes.OK).json(returnEntity);
  } else if(returnEntity.id == null) {
    respuesta = res.status(StatusCodes.NOT_FOUND).send(`no se encontro la entidad (id:${id}).`);
  }
  return respuesta;
})

router.get('/:id/event-location', async (req, res) => {
  let respuesta;
  let id = req.params.id;
  const user = req.user; // assuming user authentication is handled and user object is available in the request
  
  // Check if the user is authenticated
  if (!user) {
      respuesta = res.status(StatusCodes.UNAUTHORIZED).send('Usuario no autenticado.');
      return respuesta;
  }

  // Check if the location id exists
  const location = await svc.getByIdAsync(id);
  if (!location) {
      respuesta = res.status(StatusCodes.NOT_FOUND).send(`La entidad con ID: ${id} no fue encontrada.`);
      return respuesta;
  }

  // Fetch event locations for the specified location id
  const eventLocations = await svc.getEventLocationsByLocationIdAsync(id, user);
  if (eventLocations != null) {
      respuesta = res.status(StatusCodes.OK).json(eventLocations);
  } else {
      respuesta = res.status(StatusCodes.NOT_FOUND).send(`No se encontraron eventos para la ubicación con ID: ${id}.`);
  }
  return respuesta;
})


export default router;