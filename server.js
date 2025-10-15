import express from 'express';
import cors from 'cors';
import pool, { testConnection, initializeDatabase } from './config/db.js';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test database connection and initialize on startup
(async () => {
    await testConnection();
    await initializeDatabase();
})();

// ============ API ROUTES ============

// GET: Fetch all nurses (with async/await)
app.get('/api/nurses', async (req, res) => {
    try {
        const [nurses] = await pool.query('SELECT * FROM nurses ORDER BY created_at DESC');

        res.json({
            success: true,
            count: nurses.length,
            data: nurses
        });
    } catch (error) {
        console.error('Error fetching nurses:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching nurses',
            error: error.message
        });
    }
});

// GET: Fetch single nurse by ID (using Promise)
app.get('/api/nurses/:id', (req, res) => {
    const { id } = req.params;

    pool.query('SELECT * FROM nurses WHERE id = ?', [id])
        .then(([nurses]) => {
            if (nurses.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Nurse not found'
                });
            }
            res.json({
                success: true,
                data: nurses[0]
            });
        })
        .catch(error => {
            console.error('Error fetching nurse:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching nurse',
                error: error.message
            });
        });
});

// POST: Add new nurse (with async/await)
app.post('/api/nurses', async (req, res) => {
    try {
        const { name, license_number, dob, age } = req.body;

        // Validation
        if (!name || !license_number || !dob || !age) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required: name, license_number, dob, age'
            });
        }

        // Check if license number already exists
        const [existing] = await pool.query(
            'SELECT id FROM nurses WHERE license_number = ?',
            [license_number]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'License number already exists'
            });
        }

        // Insert new nurse
        const [result] = await pool.query(
            'INSERT INTO nurses (name, license_number, dob, age) VALUES (?, ?, ?, ?)',
            [name, license_number, dob, age]
        );

        // Fetch the newly created nurse
        const [newNurse] = await pool.query(
            'SELECT * FROM nurses WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: 'Nurse added successfully',
            data: newNurse[0]
        });
    } catch (error) {
        console.error('Error adding nurse:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding nurse',
            error: error.message
        });
    }
});

// PUT: Update nurse (using Promise chain)
app.put('/api/nurses/:id', (req, res) => {
    const { id } = req.params;
    const { name, license_number, dob, age } = req.body;

    // Validation
    if (!name || !license_number || !dob || !age) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required: name, license_number, dob, age'
        });
    }

    // Check if nurse exists
    pool.query('SELECT * FROM nurses WHERE id = ?', [id])
        .then(([nurses]) => {
            if (nurses.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Nurse not found'
                });
            }

            // Check if license number is taken by another nurse
            return pool.query(
                'SELECT id FROM nurses WHERE license_number = ? AND id != ?',
                [license_number, id]
            );
        })
        .then(([existing]) => {
            if (existing && existing.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'License number already exists'
                });
            }

            // Update nurse
            return pool.query(
                'UPDATE nurses SET name = ?, license_number = ?, dob = ?, age = ? WHERE id = ?',
                [name, license_number, dob, age, id]
            );
        })
        .then(() => {
            // Fetch updated nurse
            return pool.query('SELECT * FROM nurses WHERE id = ?', [id]);
        })
        .then(([updatedNurse]) => {
            res.json({
                success: true,
                message: 'Nurse updated successfully',
                data: updatedNurse[0]
            });
        })
        .catch(error => {
            console.error('Error updating nurse:', error);
            res.status(500).json({
                success: false,
                message: 'Error updating nurse',
                error: error.message
            });
        });
});

// DELETE: Delete nurse (with async/await)
app.delete('/api/nurses/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Check if nurse exists
        const [nurses] = await pool.query('SELECT * FROM nurses WHERE id = ?', [id]);

        if (nurses.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Nurse not found'
            });
        }

        // Delete nurse
        await pool.query('DELETE FROM nurses WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'Nurse deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting nurse:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting nurse',
            error: error.message
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running!',
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);

});

