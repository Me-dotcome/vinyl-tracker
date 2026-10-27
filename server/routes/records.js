const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getRecords, addRecord, updateRecord, deleteRecord } = require('../controllers/recordController');

// All record routes require authentication
router.get('/', authMiddleware, getRecords);
router.post('/', authMiddleware, addRecord);
router.put('/:id', authMiddleware, updateRecord);
router.delete('/:id', authMiddleware, deleteRecord);

module.exports = router;
