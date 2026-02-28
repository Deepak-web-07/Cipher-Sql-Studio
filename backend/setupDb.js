const { Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const client = new Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

async function setupDatabase() {
    try {
        await client.connect();
        console.log("Connected to PostgreSQL successfully!");

        // 1. Create the Users table
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                first_name VARCHAR(50) NOT NULL,
                last_name VARCHAR(50) NOT NULL,
                age INTEGER NOT NULL
            );
        `;
        await client.query(createTableQuery);
        console.log("Table 'users' created or already exists.");

        // 2. Clear existing dummy data (if any) so we don't have duplicates
        await client.query('TRUNCATE TABLE users RESTART IDENTITY;');

        // 3. Insert some dummy data
        const insertDataQuery = `
            INSERT INTO users (first_name, last_name, age) VALUES 
            ('Deepak', 'Kushwah', 22),
            ('Aisha', 'Sharma', 19),
            ('Rahul', 'Singh', 25),
            ('Sneha', 'Patel', 21);
        `;
        await client.query(insertDataQuery);
        console.log("Sample data inserted into 'users' table successfully.");

    } catch (error) {
        console.error("Error setting up database:", error);
    } finally {
        await client.end();
        console.log("PostgreSQL connection closed.");
    }
}

setupDatabase();
