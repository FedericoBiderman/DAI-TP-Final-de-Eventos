import DBConfig from './../configs/db-config.js';
import pkg from 'pg'
const {Client, Pool} = pkg;

export default class ProvinceRepository{
    getAllAsync = async() => {
        console.log(`ProvinceRepository.createAsync()`);
        let returnArray = null;
        const client = new Client(DBConfig);
        try{
            await client.connect();
            const sql = `SELECT * FROM provinces`;
            const result = await client.query(sql);
            await client.end();
            returnArray = result.rows;
        } catch (error) {
            LogHelper.logError(error);
            console.log(error);
        }
        return returnArray;
    }


    getByIdAsync = async (id) => {
        console.log(`ProvinceRepository.getByIdAsync(${id})`);
        let returnEntity = null;
        const client = new Client(DBConfig);
        try{
            await client.connect();
            const sql = `SELECT * FROM provinces WHERE id=$1`;
            const values = [id];
            const result = await client.query(sql, values);
            await client.end();
            if(result.rows.length > 0){
                returnEntity = result.rows[0];
            }
        } catch (error) {
            console.log(error);
        }
        console.log("returnEntity", returnEntity)
        return returnEntity;
    }


    createAsync = async (entity) => {
        console.log(`ProvinceRepository.createAsync(${JSON.stringify(entity)})`); 
        let rowsAffected = 0;
        const client = new Client(DBConfig);
        try{
            await client.connect();
            const sql = `Insert INTO provinces (
                    name            ,
                    full_name       ,
                    latitude        ,
                    longitude       ,
                    display_order   
                )  VALUES (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5
                
                )`;
            const values = [    entity?.name            ?? '',
                                entity?.full_name       ?? '',
                                entity?.latitude        ?? 0,
                                entity?.longitude       ?? 0,
                                entity?.display_order   ?? 0
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
