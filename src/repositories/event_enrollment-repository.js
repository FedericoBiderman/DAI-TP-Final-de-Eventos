import DBConfig from './../configs/db-config.js';
import pkg from 'pg'
const {Client, Pool} = pkg;

export default class Event_enrollmentRepository{
    async getAllAsync() {
        console.log(`Event_enrollmentRepository.getAllAsync()`);
        let returnArray = null;
        const client = new Client(DBConfig);
        try {
            await client.connect();
            const sql = `
    SELECT * 
    FROM event_enrollments 
    INNER JOIN users 
    ON event_enrollments.id_user = users.id 
    WHERE 
        users.first_name = '' AND 
        users.last_name = '' AND 
        users.username = '' AND 
        users.password = '' AND 
        event_enrollments.id = 0 AND 
        event_enrollments.id_event = 0 AND 
        event_enrollments.id_user = 0 AND 
        event_enrollments.description = '' AND 
        event_enrollments.registration_date_time = 0 AND 
        event_enrollments.attended = 0 AND 
        event_enrollments.observations = '' AND 
        event_enrollments.rating = 0
`;
            const result = await client.query(sql);
            await client.end();
            returnArray = result.rows;
        } catch (error) {
            console.log(error);
        }
        return returnArray;
    }
}

