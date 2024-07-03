import DBConfig from './../configs/db-config.js';
import pkg from 'pg'
const {Client} = pkg;

export default class Event_locationRepository{
    getAllAsync = async() => {
        console.log(`Event_locationRepository.getAllAsync()`);
        let returnArray = null;
        const client = new Client(DBConfig);
        try{
            await client.connect();
            const sql = `SELECT * FROM event_locations`;
            const result = await client.query(sql);
            await client.end();
            returnArray = result.rows;
        } catch (error) {
            console.log(error);
        }
        return returnArray;
    }


    getByIdAsync = async (id) => {
        console.log(`Event_locationRepository.getByIdAsync(${id})`);
        let returnEntity = null;
        const client = new Client(DBConfig);
        try{
            await client.connect();
            const sql = `SELECT * FROM event_locations WHERE id=$1`;
            const values = [id];
            const result = await client.query(sql, values);
            await client.end();
            if(result.rows.length > 0){
                returnEntity = result.rows[0];
            }
        } catch (error) {
            console.log(error);
        }
        return returnEntity;
    }

    createAsync = async (entity) => {
        console.log(`Event_locationRepository.createAsync(${JSON.stringify(entity)})`); 
        let rowsAffected = 0;
        const client = new Client(DBConfig);
        try{
            await client.connect();
            const sql = `Insert INTO event_locations (
                    id_location         ,
                    name                ,
                    full_address        ,
                    max_capacity        ,
                    latitude            ,
                    longitude           ,
                    id_creator_user 
                )  VALUES (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6,
                    $7
                
                )`;
            const values = [    entity?.id_location            ?? 0,
                                entity?.name                   ?? '',
                                entity?.full_address           ?? '',
                                entity?.max_capacity           ?? 0,
                                entity?.latitude               ?? 0,
                                entity?.longitude              ?? 0,
                                entity?.id_creator_user        ?? 0
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
        console.log(`Event_locationRepository.updateAsync(${JSON.stringify(entity)})`); 
        let rowsAffected = 0;
        let id = entity.id 
        console.log('REPO entity', entity)
        const client = new Client(DBConfig);
        try{
            const previousEntity = await this.getByIdAsync(id);
            console.log('previousEntity', previousEntity)
            if(previousEntity== null) return 0;
            
            await client.connect();

            const sql=`UPDATE event_locations SET
                id_location =  $2      ,
                name = $3              ,
                full_address  = $4     ,
                max_capacity = $5      ,
                latitude = $6          , 
                longitude = $7         ,
                id_creator_user= $8
                WHERE id = $1`;  
        const values = [    id,
                            entity?.id_location            ?? previousEntity?.id_location,
                            entity?.name       ?? previousEntity?.name,
                            entity?.full_address        ?? previousEntity?.full_address,
                            entity?.max_capacity       ?? previousEntity?.max_capacity,
                            entity?.latitude       ?? previousEntity?.latitude,
                            entity?.longitude       ?? previousEntity?.longitude,
                            entity?.id_creator_user   ?? previousEntity?.id_creator_user

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
        console.log(`Event_locationRepository.deleteByIdAsync(${id})`);
        let rowsAffected = 0;
        const client = new Client(DBConfig);
        try{
            await client.connect();
            const sql = `DELETE FROM event_locations WHERE id=$1`;
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

