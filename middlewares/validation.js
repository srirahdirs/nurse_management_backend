// Validation middleware for nurse data
export const validateNurseData = (req, res, next) => {
    const { name, license_number, dob, age } = req.body;

    // Check required fields
    if (!name || !license_number || !dob || !age) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required: name, license_number, dob, age'
        });
    }

    // Validate name
    if (typeof name !== 'string' || name.trim().length < 2) {
        return res.status(400).json({
            success: false,
            message: 'Name must be at least 2 characters long'
        });
    }

    // Validate license number
    if (typeof license_number !== 'string' || license_number.trim().length < 3) {
        return res.status(400).json({
            success: false,
            message: 'License number must be at least 3 characters long'
        });
    }

    // Validate age
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
        return res.status(400).json({
            success: false,
            message: 'Age must be between 18 and 100'
        });
    }

    // Validate date of birth
    const dobDate = new Date(dob);
    if (isNaN(dobDate.getTime())) {
        return res.status(400).json({
            success: false,
            message: 'Invalid date of birth'
        });
    }

    // Sanitize data
    req.body.name = name.trim();
    req.body.license_number = license_number.trim();
    req.body.age = ageNum;

    next();
};

// Validate ID parameter
export const validateId = (req, res, next) => {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
            success: false,
            message: 'Invalid nurse ID'
        });
    }

    next();
};

