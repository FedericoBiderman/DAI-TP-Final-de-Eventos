import {Router} from 'express';
import { StatusCodes } from 'http-status-codes';
import Event_enrollmentService from '../services/event_enrollment-service.js'
const router = Router();
const svc    = new Event_enrollmentService();		// Instanciación del Service.


router.get('/:id/enrollment', async (req, res) => {
    let respuesta;
    const returnArray = await svc.getAllAsync();
    if (returnArray != null){
      respuesta = res.status(StatusCodes.OK).json(returnArray);
    } else {
      respuesta = res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Error interno.`);
    }
    return respuesta;
  });


router.post('/:id/enrollment', async (req, res) => {
    let respuesta;
    let id = req.params.id;
    const registrosAfectados = await svc.updateAsync(id);
    if (registrosAfectados !== 0) {
        return res.status(StatusCodes.CREATED).send('Te registraste creado correctamente.');
    } else {
      respuesta = res.status(StatusCodes.NOT_FOUND).send(`no se encontro la entidad (id:${entity.id}).`);
    }
    return respuesta;
  })
  
  
  router.delete('/:id/enrollment', async (req, res) => {
    let respuesta;
    let id = req.params.id;
    const registrosAfectados = await svc.deleteByIdAsync(id);
    if (registrosAfectados != 0){
      respuesta = res.status(StatusCodes.OK).json(respuesta);
    } else {
      respuesta = res.status(StatusCodes.NOT_FOUND).send(`no se encontro la entidad (id:${entity.id}).`);
    }
    return respuesta;
  })
  
  export default router;