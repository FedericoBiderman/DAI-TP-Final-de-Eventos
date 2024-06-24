import DBConfig from '../configs/db-config.js';
import pkg from 'pg';
const { Client } = pkg;

export default class EventsRepository {
    getEventsAsync = async (limit, offset) => {
        const client = new Client(DBConfig);
        try {
            await client.connect();
            const res = await client.query(`
                SELECT 
                    e.id, e.name, e.description, e.start_date, e.duration_in_minutes, e.price, e.enabled_for_enrollment, e.max_assistance,
                    u.id as creator_user_id, u.first_name as creator_user_first_name, u.last_name as creator_user_last_name, u.username as creator_user_username,
                    c.id as category_id, c.name as category_name,
                    el.id as location_id, el.name as location_name, el.full_address as location_full_address
                FROM events e
                JOIN users u ON e.id_creator_user = u.id
                JOIN event_categories c ON e.id_event_category = c.id
                JOIN event_locations el ON e.id_event_location = el.id
                ORDER BY e.start_date DESC
                LIMIT $1 OFFSET $2
            `, [limit, offset]);
    
            const countRes = await client.query('SELECT COUNT(*) FROM events');
            const total = parseInt(countRes.rows[0].count, 10);
    
            await client.end();
            return { events: res.rows, total };
        } catch(error) {
            console.log(error);
        }
    };

    searchEventsAsync = async (filters) => {
        const client = new Client(DBConfig);
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
    
        const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
        const query = `
            SELECT 
                e.id, e.name, e.description, e.start_date, e.duration_in_minutes, e.price, e.enabled_for_enrollment, e.max_assistance,
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
        values.push(limit, offset);
    
        try {
            await client.connect();
            const res = await client.query(query, values);
    
            const countQuery = `
                SELECT COUNT(*)
                FROM events e
                JOIN event_categories c ON e.id_event_category = c.id
                LEFT JOIN event_tags et ON e.id = et.id_event
                LEFT JOIN tags t ON et.id_tag = t.id
                ${whereClause}
            `;
            const countRes = await client.query(countQuery, values.slice(0, values.length - 2));
            const total = parseInt(countRes.rows[0].count, 10);
    
            await client.end();
            return { events: res.rows, total };
        } catch(error) {
            console.log(error);
        }
    };

    getEventDetailsByIdAsync = async (eventId) => {
        const client = new Client(DBConfig);
        try {
            await client.connect();
            const res = await client.query(`
                SELECT 
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
                GROUP BY e.id, el.id, l.id, p.id, u.id, c.id
            `, [eventId]);
            await client.end();
            return res.rows[0];
        } catch(error) {
            console.log(error);
        }
    };
}
