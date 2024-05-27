import DBConfig from './../configs/db-config.js';
import pkg from 'pg'
const {Client, Pool} = pkg;

export default class Event_enrollmentRepository{
    createAsync = async (entity) => {
        console.log(`Event_enrollmentRepository.createAsync(${JSON.stringify(entity)})`); 
        let rowsAffected = 0;
        const client = new Client(DBConfig);
        try{
            await client.connect();
            const sql = `Insert INTO event_enrollment (
                    id_event                ,
                    id_user                 ,
                    description             ,
                    registration_date_time  ,
                    attended                ,
                    observations            ,
                    rating   
                )  VALUES (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6,
                    $7
                
                )`;
            const values = [    entity?.id_event            ?? 0,
                                entity?.id_user       ?? 0,
                                entity?.description        ?? '',
                                entity?.registration_date_time       ?? 0,
                                entity?.attended   ?? 0,
                                entity?.observations   ?? '',
                                entity?.rating   ?? 0
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
        console.log(`ProvinceRepository.updateAsync(${JSON.stringify(entity)})`); 
        let rowsAffected = 0;
        let id = entity.id 
        console.log('REPO entity', entity)
        const client = new Client(DBConfig);
        try{
            const previousEntity = await this.getByIdAsync(id);
            console.log('previousEntity', previousEntity)
            if(previousEntity== null) return 0;
            
            await client.connect();

            const sql=`UPDATE provinces SET
                name =  $2        ,
                full_name = $3     ,
                latitude  = $4       ,
                longitude = $5      ,
                display_order = $6
                WHERE id = $1`;  
        const values = [    id,
                            entity?.name            ?? previousEntity?.name,
                            entity?.full_name       ?? previousEntity?.full_name,
                            entity?.latitude        ?? previousEntity?.latitude,
                            entity?.longitude       ?? previousEntity?.longitude,
                            entity?.display_order   ?? previousEntity?.display_order

                       ]; 
        const result = await client.query(sql, values);
         await client.end();
         rowsAffected = result.rowCount;
    } catch (error) {
        LogHelper.logError(error);
        console.log(error);
    }
     return rowsAffected;
  }

    deleteByIdAsync = async (id) => {
        console.log(`ProvinceRepository.deleteByIdAsync(${id})`);
        let rowsAffected = 0;
        const client = new Client(DBConfig);
        try{
            await client.connect();
            const sql = `DELETE FROM provinces WHERE id=$1`;
            const values = [id];
            const result = await client.query(sql, values);
            await client.end();
          rowsAffected = result.rowCount;
        } catch (error) {
            LogHelper.logError(error);
            console.log(error);
        }
        return rowsAffected;
    }

}
