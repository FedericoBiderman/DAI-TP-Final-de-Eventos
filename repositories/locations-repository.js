import DBConfig from './../configs/db-config.js';
import pkg from 'pg'
const {Client, Pool} = pkg;

export default class LocationsRepository{
    getAllAsync = async() => {
        console.log(`LocationsRepository.createAsync()`);
        let returnArray = null;
        const client = new Client(DBConfig);
        try{
            await client.connect();
            const sql = `SELECT * FROM locations`;
            const result = await client.query(sql);
            await client.end();
            returnArray = result.rows;
        } catch (error) {
            console.log(error);
        }
        return returnArray;
    }


    getByIdAsync = async (id) => {
        console.log(`LocationsRepository.getByIdAsync(${id})`);
        let returnEntity = null;
        const client = new Client(DBConfig);
        try{
            await client.connect();
            const sql = `SELECT * FROM locations WHERE id=$1`;
            const values = [id];
            const result = await client.query(sql, values);
            await client.end();
            if(result.rows.length > 0){
                returnEntity = result.rows[0];
            }
        } catch (error) {
            console.log(error);
        }
        //console.log("returnEntity", returnEntity)
        return returnEntity;
    }

    getEventLocationsByLocationIdAsync = async (id, user) => {
        console.log(`EventLocationsRepository.getByLocationIdAsync(${id})`);
        let returnEntity = null;
        const client = new Client(DBConfig);
        try {
            await client.connect();
            const sql = 'SELECT * FROM event_locations WHERE location_id = $1';
            const values = [id];
            const result = await client.query(sql, values);
            await client.end();
            if (result.rows.length > 0) {
                returnEntity = result.rows;
            }
        } catch (error) {
            console.log(error);
        }
        return returnEntity;
    }
}