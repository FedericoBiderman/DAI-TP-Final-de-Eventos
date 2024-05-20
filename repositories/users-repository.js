import DBConfig from './../configs/db-config.js';
import pkg from 'pg';
const { Client } = pkg;

export default class UserRepository {
    getAllAsync = async(username) => {
        console.log(`UserRepository.getAllAsync(${username})`);
        let user = null;
        const client = new Client(DBConfig);
        try{
            await client.connect();
            const sql = `SELECT * FROM users WHERE username = $1 `;
            const values= [username];
            const result = await client.query(sql, values);
            await client.end();
            if(result.rows.length >0)
            user = result.rows[0];
        } catch (error) {
            console.log(error);
        }
        return user;
    }

    createUser = async(first_name, last_name, username, password) => {
        console.log(`UserRepository.createUser(${first_name}, ${last_name}, ${username}, ${password})`);
        let rowsAffected = 0;
        const client = new Client(DBConfig);
        try {
            await client.connect();
            const sql = `INSERT INTO users (first_name, last_name, username, password) VALUES ($1, $2, $3, $4)`;
            const values = [first_name, last_name, username, password];
            const result = await client.query(sql, values);
            await client.end();
            rowsAffected = result.rowCount;
        } catch (error) {
            console.log(error);
        }
        return rowsAffected;
    }
}

