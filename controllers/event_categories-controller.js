import {Router} from 'express';
import { StatusCodes } from 'http-status-codes';
import CategoriesService from '../services/event_categories-service.js'
const router = Router();
const svc    = new CategoriesService();		// Instanciación del Service.

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
  } else {
    respuesta = res.status(StatusCodes.NOT_FOUND).send(`no se encontro la entidad (id:${id}).`);
  }
  return respuesta;
}),


router.post('', async (req, res) => {
  let entity = req.body;
  const registrosAfectados = await svc.createAsync(entity);
  if (entity.name == null || entity.name.length < 3)
  {
    return res.status(StatusCodes.BAD_REQUEST).json(registrosAfectados); 

  }else{
  return res.status(StatusCodes.CREATED).json(registrosAfectados); }
}),


router.put('', async (req, res) => {
  let respuesta;
  let entity = req.body;
  console.log(entity);
  const registrosAfectados = await svc.updateAsync(entity);
  if (entity.name == null || entity.name.length < 3){
    respuesta = res.status(StatusCodes.BAD_REQUEST).json(registrosAfectados); 
  } else {
    const returnEntity = await svc.getByIdAsync(req.body.id);
    if (returnEntity == null){
      respuesta = res.status(StatusCodes.NOT_FOUND).send(`no se encontro la entidad (id:${entity.id}).`);
    }else {
      let registrosAfectados;
      respuesta = res.status(StatusCodes.OK).json(registrosAfectados);
    }    
  }
  return respuesta;
}),

//  const registrosAfectados = await svc.updateAsync(entity);

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
