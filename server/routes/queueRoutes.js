const express = require('express');
const router = express.Router();
const queueController = require('../controllers/queueController');

// Queue REST routes
router.get('/', queueController.getAllQueues);
router.post('/', queueController.createQueueEntry);
router.put('/:queueId', queueController.updateQueueEntry);
router.delete('/:queueId', queueController.deleteQueueEntry);

module.exports = router;
