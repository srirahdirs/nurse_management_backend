import pool from '../config/db.js';

class Nurse {
    // Get all nurses
    static async findAll() {
        const [nurses] = await pool.query('SELECT * FROM nurses ORDER BY created_at DESC');
        return nurses;
    }

    // Get nurse by ID
    static async findById(id) {
        const [nurses] = await pool.query('SELECT * FROM nurses WHERE id = ?', [id]);
        return nurses[0];
    }

    // Get nurse by license number
    static async findByLicenseNumber(licenseNumber) {
        const [nurses] = await pool.query(
            'SELECT * FROM nurses WHERE license_number = ?',
            [licenseNumber]
        );
        return nurses[0];
    }

    // Check if license number exists (excluding specific ID)
    static async licenseNumberExists(licenseNumber, excludeId = null) {
        let query = 'SELECT id FROM nurses WHERE license_number = ?';
        let params = [licenseNumber];

        if (excludeId) {
            query += ' AND id != ?';
            params.push(excludeId);
        }

        const [nurses] = await pool.query(query, params);
        return nurses.length > 0;
    }

    // Create new nurse
    static async create(nurseData) {
        const { name, license_number, dob, age } = nurseData;

        const [result] = await pool.query(
            'INSERT INTO nurses (name, license_number, dob, age) VALUES (?, ?, ?, ?)',
            [name, license_number, dob, age]
        );

        return result.insertId;
    }

    // Update nurse
    static async update(id, nurseData) {
        const { name, license_number, dob, age } = nurseData;

        const [result] = await pool.query(
            'UPDATE nurses SET name = ?, license_number = ?, dob = ?, age = ? WHERE id = ?',
            [name, license_number, dob, age, id]
        );

        return result.affectedRows > 0;
    }

    // Delete nurse
    static async delete(id) {
        const [result] = await pool.query('DELETE FROM nurses WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    // Search nurses by name or license number
    static async search(searchTerm) {
        const searchPattern = `%${searchTerm}%`;
        const [nurses] = await pool.query(
            `SELECT * FROM nurses 
             WHERE name LIKE ? OR license_number LIKE ? 
             ORDER BY created_at DESC`,
            [searchPattern, searchPattern]
        );
        return nurses;
    }
}

export default Nurse;

