import mysql from 'mysql2';

// Database configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '2DC1m2cI(0Olof]H', // Add your MySQL password here if you have one
    database: 'nurse_management'
};

// Create connection pool for better performance
const pool = mysql.createPool(dbConfig).promise();

// Test database connection
export const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Database connected successfully!');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
};

// Initialize database and create table if not exists
export const initializeDatabase = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS nurses (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                license_number VARCHAR(100) NOT NULL UNIQUE,
                dob DATE NOT NULL,
                age INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Nurses table initialized successfully!');
    } catch (error) {
        console.error('❌ Table initialization failed:', error.message);
    }
};

export default pool;

