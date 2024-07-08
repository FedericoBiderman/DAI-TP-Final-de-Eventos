import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import ProvinceService from './../services/province-service.js'
const router = Router();
const svc = new ProvinceService();		// Instanciación del Service.

router.get('', async (req, res) => {
  let respuesta;
  const returnArray = await svc.getAllAsync();
  if (returnArray != null) {
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
  if (returnEntity != null) {
    respuesta = res.status(StatusCodes.OK).json(returnEntity);
  } else {
    respuesta = res.status(StatusCodes.NOT_FOUND).send(`no se encontro la entidad (id:${id}).`);
  }
  return respuesta;
});

router.get('/:id/location', async (req, res) => {
  let respuesta;
  let id = req.params.id;
  const returnEntity = await svc.getByLocationId(id);
  if (returnEntity != null) {
    respuesta = res.status(StatusCodes.OK).json(returnEntity);
  } else {
    respuesta = res.status(StatusCodes.NOT_FOUND).send(`no se encontro las locaciones del (id:${id}).`);
  }
  return respuesta;
});



router.post('', async (req, res) => {
  let entity = req.body;
  const registrosAfectados = await svc.createAsync(entity);
  if (entity.name.length < 3) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'el campo name tiene menos de 3 letras' });
  }
  if (!entity.latitude) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'La latitud debe ser un número válido' });
  }
  if (!entity.longitude) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'La longitud debe ser un número válido' });
  } else {
    return res.status(StatusCodes.CREATED).json(registrosAfectados);
  }
});


router.put('', async (req, res) => {
  let respuesta;
  let entity = req.body;
  console.log(entity);
  const registrosAfectados = await svc.updateAsync(entity);
  if (registrosAfectados != 0) {
    respuesta = res.status(StatusCodes.OK).json(registrosAfectados);
  } 
  if (entity.name.length < 3) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'el campo name tiene menos de 3 letras' });
  }
  if (!entity.latitude) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'La latitud debe ser un número válido' });
  }
  if (!entity.longitude) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'La longitud debe ser un número válido' });
  }
  else {
    respuesta = res.status(StatusCodes.NOT_FOUND).send(`no se encontro la entidad (id:${entity.id}).`);
  }
  return respuesta;
});


router.delete('/:id', async (req, res) => {
  let respuesta;
  let id = req.params.id;
  let entity = req.body;
  const registrosAfectados = await svc.deleteByIdAsync(id);
  if (registrosAfectados != 0) {
    respuesta = res.status(StatusCodes.OK).json(respuesta);
  } else {
    respuesta = res.status(StatusCodes.NOT_FOUND).send(`no se encontro la entidad (id:${entity.id}).`);
  }
  return respuesta;
});

export default router;
