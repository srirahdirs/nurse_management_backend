import Nurse from '../models/Nurse.js';

// @desc    Get all nurses
// @route   GET /api/nurses
// @access  Public
export const getAllNurses = async (req, res) => {
    try {
        const nurses = await Nurse.findAll();

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
};

// @desc    Get single nurse by ID
// @route   GET /api/nurses/:id
// @access  Public
export const getNurseById = async (req, res) => {
    try {
        const { id } = req.params;
        const nurse = await Nurse.findById(id);

        if (!nurse) {
            return res.status(404).json({
                success: false,
                message: 'Nurse not found'
            });
        }

        res.json({
            success: true,
            data: nurse
        });
    } catch (error) {
        console.error('Error fetching nurse:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching nurse',
            error: error.message
        });
    }
};

// @desc    Create new nurse
// @route   POST /api/nurses
// @access  Public
export const createNurse = async (req, res) => {
    try {
        const { name, license_number, dob, age } = req.body;

        // Validation
        if (!name || !license_number || !dob || !age) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required: name, license_number, dob, age'
            });
        }

        // Validate age is 18+
        if (age < 18) {
            return res.status(400).json({
                success: false,
                message: 'Nurse must be at least 18 years old'
            });
        }

        // Check if license number already exists
        const licenseExists = await Nurse.licenseNumberExists(license_number);
        if (licenseExists) {
            return res.status(400).json({
                success: false,
                message: 'License number already exists'
            });
        }

        // Create nurse
        const nurseId = await Nurse.create({ name, license_number, dob, age });

        // Fetch the newly created nurse
        const newNurse = await Nurse.findById(nurseId);

        res.status(201).json({
            success: true,
            message: 'Nurse added successfully',
            data: newNurse
        });
    } catch (error) {
        console.error('Error adding nurse:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding nurse',
            error: error.message
        });
    }
};

// @desc    Update nurse
// @route   PUT /api/nurses/:id
// @access  Public
export const updateNurse = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, license_number, dob, age } = req.body;

        // Validation
        if (!name || !license_number || !dob || !age) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required: name, license_number, dob, age'
            });
        }

        // Validate age is 18+
        if (age < 18) {
            return res.status(400).json({
                success: false,
                message: 'Nurse must be at least 18 years old'
            });
        }

        // Check if nurse exists
        const nurse = await Nurse.findById(id);
        if (!nurse) {
            return res.status(404).json({
                success: false,
                message: 'Nurse not found'
            });
        }

        // Check if license number is taken by another nurse
        const licenseExists = await Nurse.licenseNumberExists(license_number, id);
        if (licenseExists) {
            return res.status(400).json({
                success: false,
                message: 'License number already exists'
            });
        }

        // Update nurse
        await Nurse.update(id, { name, license_number, dob, age });

        // Fetch updated nurse
        const updatedNurse = await Nurse.findById(id);

        res.json({
            success: true,
            message: 'Nurse updated successfully',
            data: updatedNurse
        });
    } catch (error) {
        console.error('Error updating nurse:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating nurse',
            error: error.message
        });
    }
};

// @desc    Delete nurse
// @route   DELETE /api/nurses/:id
// @access  Public
export const deleteNurse = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if nurse exists
        const nurse = await Nurse.findById(id);
        if (!nurse) {
            return res.status(404).json({
                success: false,
                message: 'Nurse not found'
            });
        }

        // Delete nurse
        await Nurse.delete(id);

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
};

