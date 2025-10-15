import express from 'express';
import {
    getAllNurses,
    getNurseById,
    createNurse,
    updateNurse,
    deleteNurse,
    searchNurses
} from '../controllers/nurseController.js';

const router = express.Router();

// GET /api/nurses/search - Search nurses (must be before /:id route)
router.get('/search', searchNurses);

// GET /api/nurses - Get all nurses
router.get('/', getAllNurses);

// GET /api/nurses/:id - Get single nurse
router.get('/:id', getNurseById);

// POST /api/nurses - Create new nurse
router.post('/', createNurse);

// PUT /api/nurses/:id - Update nurse
router.put('/:id', updateNurse);

// DELETE /api/nurses/:id - Delete nurse
router.delete('/:id', deleteNurse);

export default router;

