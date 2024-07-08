import DBConfig from './../configs/db-config.js';
import pkg from 'pg';
const { Client } = pkg;

export default class EventEnrollmentRepository {
    getFilteredEnrollmentsAsync = async (eventId, filters) => {
        console.log(`EventEnrollmentRepository.getFilteredEnrollmentsAsync(${eventId}, ${JSON.stringify(filters)})`);
        const client = new Client(DBConfig);
        try {
            await client.connect();

            let sql = `
                SELECT event_enrollments.*, users.id as user_id, users.first_name, users.last_name, users.username
                FROM event_enrollments
                INNER JOIN users ON event_enrollments.id_user = users.id
                WHERE event_enrollments.id_event = $1
            `;
            const values = [eventId];

            if (filters.first_name) {
                sql += ` AND users.first_name ILIKE $${values.length + 1}`;
                values.push(`%${filters.first_name}%`);
            }
            if (filters.last_name) {
                sql += ` AND users.last_name ILIKE $${values.length + 1}`;
                values.push(`%${filters.last_name}%`);
            }
            if (filters.username) {
                sql += ` AND users.username ILIKE $${values.length + 1}`;
                values.push(`%${filters.username}%`);
            }
            if (filters.attended !== undefined) {
                sql += ` AND event_enrollments.attended = $${values.length + 1}`;
                values.push(filters.attended);
            }
            if (filters.rating) {
                sql += ` AND event_enrollments.rating >= $${values.length + 1}`;
                values.push(filters.rating);
            }

            const result = await client.query(sql, values);
            await client.end();
            return result.rows;
        } catch (error) {
            console.log(error);
            await client.end();
            throw error;
        }
    }

    registerUserAsync = async (eventId, userId, registrationDateTime) => {
        console.log(`EventEnrollmentRepository.registerUserAsync(${eventId}, ${userId}, ${registrationDateTime})`);
        const client = new Client(DBConfig);
        try {
            await client.connect();
            const sql = `
                INSERT INTO event_enrollments (id_event, id_user, registration_date_time)
                VALUES ($1, $2, $3)
                RETURNING *
            `;
            const values = [eventId, userId, registrationDateTime];
            const result = await client.query(sql, values);
            await client.end();
            return result.rowCount;
        } catch (error) {
            console.log(error);
            await client.end();
            throw error;
        }
    }

    removeUserAsync = async (eventId, userId) => {
        console.log(`EventEnrollmentRepository.removeUserAsync(${eventId}, ${userId})`);
        const client = new Client(DBConfig);
        try {
            await client.connect();
            const sql = `
                DELETE FROM event_enrollments
                WHERE id_event = $1 AND id_user = $2
            `;
            const values = [eventId, userId];
            const result = await client.query(sql, values);
            await client.end();
            return result.rowCount;
        } catch (error) {
            console.log(error);
            await client.end();
            throw error;
        }
    }

    updateRatingAsync = async (eventId, userId, rating, observations) => {
        console.log(`EventEnrollmentRepository.updateRatingAsync(${eventId}, ${userId}, ${rating}, ${observations})`);
        const client = new Client(DBConfig);
        try {
            await client.connect();
            const sql = `
                UPDATE event_enrollments
                SET rating = $1, observations = $2
                WHERE id_event = $3 AND id_user = $4
                RETURNING *
            `;
            const values = [rating, observations, eventId, userId];
            const result = await client.query(sql, values);
            await client.end();
            return result.rowCount;
        } catch (error) {
            console.log(error);
            await client.end();
            throw error;
        }
    }

    getEventByIdAsync = async (eventId) => {
        console.log(`EventEnrollmentRepository.getEventByIdAsync(${eventId})`);
        const client = new Client(DBConfig);
        try {
            await client.connect();
            const sql = `SELECT * FROM events WHERE id = $1`;
            const values = [eventId];
            const result = await client.query(sql, values);
            await client.end();
            return result.rows[0];
        } catch (error) {
            console.log(error);
            await client.end();
            throw error;
        }
    }

    

    isUserEnrolledAsync = async (eventId, userId) => {
        console.log(`EventEnrollmentRepository.isUserEnrolledAsync(${eventId}, ${userId})`);
        const client = new Client(DBConfig);
        try {
            await client.connect();
            const sql = `
                SELECT * FROM event_enrollments
                WHERE id_event = $1 AND id_user = $2
            `;
            const values = [eventId, userId];
            const result = await client.query(sql, values);
            await client.end();
            return result.rows.length > 0;
        } catch (error) {
            console.log(error);
            await client.end();
            throw error;
        }
    }
}
