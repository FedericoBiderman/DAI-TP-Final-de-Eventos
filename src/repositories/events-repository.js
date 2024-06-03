import DBConfig from '../configs/db-config.js';
import pkg from 'pg'
const { Client, Pool }  = pkg;


export default class EventsRepository {
    getAllAsync = async (limit, offset) => {
        let returnArray = null;
        const client = new Client(DBConfig);
        try {
            await client.connect();
            const sql = `SELECT
            e.id, e.name,
            e.description,
            e.start_date,
            e.duration_in_minutes,
            e.price,
            e.enabled_for_enrollment,
            e.max_assistance,
            json_build_object(
                'nombre'    , u.first_name,
                'apellido'  ,  u.last_name
            ) AS usuario,
            json_build_object(
                'categoria' , catego.name
            ) AS Categoria,
            json_build_object(
                'locacion'  , loc.name,
                'direccion' , loc.full_address,
                'longitud'  , loc.longitude,
                'latitud'   , loc.latitude
            ) AS Loc
        FROM public.events AS e
        INNER JOIN public.event_categories AS catego ON e.id_event_category = catego.id
        INNER JOIN public.event_locations AS loc ON e.id_event_location = loc.id
        INNER JOIN public.users AS u ON e.id_creator_user = u.id
        LIMIT $1  
        OFFSET $2`;
            const values = [limit, offset];
            const result = await client.query(sql, values);
            await client.end();
            returnArray = result.rows;
        } catch (error) {
            console.log(error);
        }
        return returnArray;
    }

    createAsync = async (entity) => {
        console.log(`EventsRepository.createAsync(${JSON.stringify(entity)})`); 
        let rowsAffected = 0;
        const client = new Client(DBConfig);
        try{
            await client.connect();
            const sql = `Insert INTO events (
                    name            ,
                    description       ,
                    id_event_category        ,
                    id_event_location       ,
                    start_date              ,
                    duration_in_minutes     ,
                    price                   ,
                    enabled_for_enrollment  ,
                    max_assistance          ,
                    id_creator_user   
                )  VALUES (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6,
                    $7,
                    $8,
                    $9,
                    $10
                
                )`;
            const values = [    entity?.name            ?? '',
                                entity?.description       ?? '',
                                entity?.id_event_category        ?? 0,
                                entity?.id_event_location       ?? 0,
                                entity?.start_date   ?? 0,
                                entity?.duration_in_minutes            ?? 0,
                                entity?.price       ?? 0,
                                entity?.enabled_for_enrollment        ?? 0,
                                entity?.max_assistance       ?? 0,
                                entity?.id_creator_user   ?? 0
                           ];
            const result = await client.query(sql, values);
            await client.end();
            rowsAffected = result.rowCount;
        } catch (error) {
            console.log(error);
        }
        return rowsAffected;
    }
    updateAsync = async (entity) => {
        console.log(`EventsRepository.updateAsync(${JSON.stringify(entity)})`); 
        let rowsAffected = 0;
        let id = entity.id 
        console.log('REPO entity', entity)
        const client = new Client(DBConfig);
        try{
            const previousEntity = await this.getByIdAsync(id);
            console.log('previousEntity', previousEntity)
            if(previousEntity== null) return 0;
            
            await client.connect();

            const sql=`UPDATE events SET
            name   = $2         ,
            description = $3      ,
            id_event_category  = $4      ,
            id_event_location  = $5     ,
            start_date        = $6      ,
            duration_in_minutes = $7    ,
            price           = $8        ,
            enabled_for_enrollment = $9  ,
            max_assistance    = $10      ,
            id_creator_user   = $11
                WHERE id = $1`;  
        const values = [    id,
            entity?.name            ?? '',
            entity?.description       ?? '',
            entity?.id_event_category        ?? 0,
            entity?.id_event_location       ?? 0,
            entity?.start_date   ?? 0,
            entity?.duration_in_minutes            ?? 0,
            entity?.price       ?? 0,
            entity?.enabled_for_enrollment        ?? 0,
            entity?.max_assistance       ?? 0,
            entity?.id_creator_user   ?? 0

                       ]; 
        const result = await client.query(sql, values);
         await client.end();
         rowsAffected = result.rowCount;
    } catch (error) {
        console.log(error);
    }
     return rowsAffected;
  }

    deleteByIdAsync = async (id) => {
        console.log(`EventsRepository.deleteByIdAsync(${id})`);
        let rowsAffected = 0;
        const client = new Client(DBConfig);
        try{
            await client.connect();
            const sql = `DELETE FROM events WHERE id=$1`;
            const values = [id];
            const result = await client.query(sql, values);
            await client.end();
          rowsAffected = result.rowCount;
        } catch (error) {
            console.log(error);
        }
        return rowsAffected;
    }

}


