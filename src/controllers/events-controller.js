import {Router} from 'express';
import EventsService from '../services/events-service.js';
const router = Router();
const svc = new EventsService();


router.get('', async (req, res) => {
    let respuesta;
    let  limit = req.query.limit;
    let offset = req.query.offset;
    limit = parseInt(limit);
    offset= parseInt(offset);
    if (isNaN(limit) && isNaN(offset)){
        console.log("error")
        res.status(500).send("no es un numero");
    } else {
        const returnArray = await svc.getAllAsync(limit, offset);
        if (returnArray != null){
            respuesta = res.status(200).json(returnArray);
        } else {
            respuesta = res.status(500).send(`Error interno.`);
        }
        return respuesta;
    }
});


export default router;


