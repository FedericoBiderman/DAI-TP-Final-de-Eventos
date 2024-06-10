import DBConfig from '../configs/db-config.js';
import pkg from 'pg'
const { Client, Pool }  = pkg;


export default class EventsRepository {
    getAllAsync = async (limit, offset, name, category) => {
        let returnArray = null;
        const client = new Client(DBConfig);
        let values = [limit, offset]; // Usar %name% para búsqueda parcial
        try {
            await client.connect();
            let sql = `
                SELECT
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
                WHERE 1=1`
                
            if (name!=null){
                values.push(values);
                sql = sql + ` AND e.name LIKE $${values.length}`;
            }

            if (category!=null){
                values.push(category);
                sql = sql + ` AND catego.name LIKE $${values.length}`;
            }

            sql = sql + ` LIMIT $1  OFFSET $2`;

            console.log('SQL:', sql);
            //const values = [limit, offset, name, category]; // Usar %name% para búsqueda parcial
            console.log('Values:', values);
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

    getEventByIdAsync = async (id) => {
        console.log(`EventsRepository.getEventByIdAsync(${id})`);
        let returnEntity = null;
        const client = new Client(DBConfig);
        try{
            await client.connect();
            const sql = `SELECT * FROM events WHERE id=$1`;
            const values = [id];
            const result = await client.query(sql, values);
            await client.end();
            returnEntity = result.rows;
        } catch (error) {
            console.log(error);
        }
        return returnEntity;
    }

    getEventDetailsAsync = async (id) => {
        console.log(`EventsRepository.getEventDetailsAsync(${id})`);
        let returnArray = null;
        const client = new Client(DBConfig);
        try{
            await client.connect();
            const sql = `SELECT 
            e.id, e.name, e.description, e.id_event_category, e.start_date, e.duration_in_minutes, e.price, e.enabled_for_enrollment, e.max_assistance, e.id_creator_user,
            el.id as event_location_id, el.name as event_location_name, el.full_address as event_location_full_address, el.max_capacity as event_location_max_capacity, el.latitude as event_location_latitude, el.longitude as event_location_longitude,
            l.id as location_id, l.name as location_name, l.latitude as location_latitude, l.longitude as location_longitude,
            p.id as province_id, p.name as province_name, p.full_name as province_full_name, p.latitude as province_latitude, p.longitude as province_longitude,
            u.id as creator_user_id, u.first_name as creator_user_first_name, u.last_name as creator_user_last_name, u.username as creator_user_username,
            c.id as event_category_id, c.name as event_category_name, c.display_order as event_category_display_order,
            COALESCE(json_agg(json_build_object('id', t.id, 'name', t.name)) FILTER (WHERE t.id IS NOT NULL), '[]') as tags
        FROM events e
        JOIN event_locations el ON e.id_event_location = el.id
        JOIN locations l ON el.id_location = l.id
        JOIN provinces p ON l.id_province = p.id
        JOIN users u ON e.id_creator_user = u.id
        JOIN event_categories c ON e.id_event_category = c.id
        LEFT JOIN event_tags et ON e.id = et.id_event
        LEFT JOIN tags t ON et.id_tag = t.id
        WHERE e.id = $1
        GROUP BY e.id, el.id, l.id, p.id, u.id, c.id`;

            const values = [id];
            const result = await client.query(sql, values);
            await client.end();
            returnArray = result.rows;
        } catch (error) {
            console.log(error);
        }
        return returnArray;
    }


    getEventEnrollmentsAsync = async (filters) => {
        console.log(`EventsRepository.getEventEnrollmentsAsync`);
        let returnArray = null;
        const client = new Client(DBConfig);
        const { first_name, last_name, username, attended, rating } = filters;
        const conditions = [];
        const values = [first_name, last_name, username, attended, rating];
        if (first_name) {
            values.push(`%${first_name}%`);
            conditions.push(`u.first_name ILIKE $${values.length}`);
        }
        if (last_name) {
            values.push(`%${last_name}%`);
            conditions.push(`u.last_name ILIKE $${values.length}`);
        }
        if (username) {
            values.push(`%${username}%`);
            conditions.push(`u.username ILIKE $${values.length}`);
        }
        if (attended !== undefined) {
            values.push(attended);
            conditions.push(`e.attended = $${values.length}`);
        }
        if (rating) {
            values.push(rating);
            conditions.push(`e.rating >= $${values.length}`);
        }
    
        const whereClause = conditions.length ? `AND ${conditions.join(' AND ')}` : '';
    
        try {
            await client.connect();
            const result = await client.query(`
                SELECT 
                    e.id, e.id_event, e.id_user, e.description, e.registration_date_time, e.attended, e.observations, e.rating,
                    u.id as user_id, u.first_name, u.last_name, u.username
                FROM event_enrollments e
                JOIN users u ON e.id_user = u.id
                WHERE e.id_event = $1 ${whereClause}
            `, values);
            await client.end();
            returnArray = result.rows;
        } catch (error) {
            console.log(error);
        }
        return returnArray;
    }


    getEventsAsync = async (limit, offset) => {
        let returnArray = null;
        const client = new Client(DBConfig);
        try {
            await client.connect();
            const sql = `
                SELECT 
                    e.id, e.name, e.description, e.start_date, e.duration_in_minutes, e.price, e.enabled_for_enrollment, el.max_capacity,
                    u.id as creator_user_id, u.first_name as creator_user_first_name, u.last_name as creator_user_last_name, u.username as creator_user_username,
                    c.id as category_id, c.name as category_name,
                    el.id as location_id, el.name as location_name, el.full_address as location_full_address
                FROM events e
                JOIN users u ON e.id_creator_user = u.id
                JOIN event_categories c ON e.id_event_category = c.id
                JOIN event_locations el ON e.id_event_location = el.id
                ORDER BY e.start_date DESC
                LIMIT $1 OFFSET $2`;
        
            const result = await client.query(sql, [limit, offset]);
        
            const rowCount = await client.query('SELECT COUNT(*) FROM events');
            const total = parseInt(rowCount.rows[0].count, 10);
        
            return {
                returnArray: result.rows,
                total
            };
        } catch (error) {
            console.error(error);
        } finally {
            await client.end();
        }
    };
    
    
    searchEvents = async (filters) => {
        console.log(`EventsRepository.searchEvents`);
        const client = new Client(DBConfig);
        let returnObject = null;
        const { name, category, startdate, tag, limit, offset } = filters;
        const conditions = [];
        const values = [];
    
        if (name) {
            values.push(`%${name}%`);
            conditions.push(`e.name ILIKE $${values.length}`);
        }
        if (category) {
            values.push(`%${category}%`);
            conditions.push(`c.name ILIKE $${values.length}`);
        }
        if (startdate) {
            values.push(startdate);
            conditions.push(`DATE(e.start_date) = $${values.length}`);
        }
        if (tag) {
            values.push(`%${tag}%`);
            conditions.push(`t.name ILIKE $${values.length}`);
        }
    
        const whereClause = conditions.length ? `AND ${conditions.join(' AND ')}` : '';
    
        try {
            await client.connect();
    
            const query = `
                SELECT 
                    e.id, e.name, e.description, e.start_date, e.duration_in_minutes, e.price, e.enabled_for_enrollment, el.max_capacity,
                    u.id as creator_user_id, u.first_name as creator_user_first_name, u.last_name as creator_user_last_name, u.username as creator_user_username,
                    c.id as category_id, c.name as category_name,
                    el.id as location_id, el.name as location_name, el.full_address as location_full_address
                FROM events e
                JOIN users u ON e.id_creator_user = u.id
                JOIN event_categories c ON e.id_event_category = c.id
                JOIN event_locations el ON e.id_event_location = el.id
                LEFT JOIN event_tags et ON e.id = et.id_event
                LEFT JOIN tags t ON et.id_tag = t.id
                ${whereClause}
                ORDER BY e.start_date DESC
                LIMIT $${values.length + 1} OFFSET $${values.length + 2}
            `;
    
            const result = await client.query(query, [...values, limit, offset]);
    
            const countQuery = `
                SELECT COUNT(*)
                FROM events e
                JOIN event_categories c ON e.id_event_category = c.id
                LEFT JOIN event_tags et ON e.id = et.id_event
                LEFT JOIN tags t ON et.id_tag = t.id
                ${whereClause}
            `;
            const countRes = await client.query(countQuery, values);
            const total = parseInt(countRes.rows[0].count, 10);
    
            returnObject = {
                events: result.rows,
                total
            };
        } catch (error) {
            console.error(error);
        } finally {
            await client.end();
        }
    
        return returnObject;
    };
}    