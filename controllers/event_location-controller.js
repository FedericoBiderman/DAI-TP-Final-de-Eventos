import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import Event_locationService from './../services/event_location-service.js';

const router = Router();
const svc = new Event_locationService();

router.get('', async (req, res) => {
    try {
        const returnArray = await svc.getAllAsync();
        if (returnArray.length > 0) {
            return res.status(StatusCodes.OK).json(returnArray);
        } else {
            return res.status(StatusCodes.NOT_FOUND).send('No se encontraron eventos de ubicación.');
        }
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Ocurrió un error al obtener los eventos de ubicación.');
    }
});


router.get('/:id', async (req, res) => {
  let respuesta;
  let id = req.params.id;
  const returnEntity = await svc.getByIdAsync(id);
  if (returnEntity != null){
    respuesta = res.status(StatusCodes.OK).json(returnEntity);
  } else {
    respuesta = res.status(StatusCodes.NOT_FOUND).send(`no se encontro la entidad (id:${id}).`);
  }
  return respuesta;
})

router.post('', async (req, res) => {
  let entity = req.body;
  const registrosAfectados = await svc.createAsync(entity);
  if (registrosAfectados !== 0) {
      return res.status(StatusCodes.CREATED).send('Event Location creado correctamente.');
  } else if(entity.name == '' || entity.full_address == '' || entity.id_location == null || entity.max_capacity <= 0){
      return res.status(StatusCodes.BAD_REQUEST).send('Error al crear Event Location. Verifique los datos proporcionados.');
  }
});



router.put('', async (req, res) => {
  let respuesta;
  let entity = req.body;
  console.log(entity);
  const registrosAfectados = await svc.updateAsync(entity);
  if (registrosAfectados != 0){
    respuesta = res.status(StatusCodes.OK).send('Event Location actualizado correctamente');
  } else {
    respuesta = res.status(StatusCodes.NOT_FOUND).send(`no se encontro la entidad (id:${entity.id}).`);
  }
  return respuesta;

}),
router.delete('/:id', async (req, res) => {
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
