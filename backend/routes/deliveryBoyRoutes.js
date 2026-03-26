const express = require('express');
const router = express.Router();
const { addDeliveryBoy, getVendorDeliveryBoys, updateDeliveryBoy, deleteDeliveryBoy, getDeliveryBoyTasks, updateTaskStatus } = require('../controllers/deliveryBoyController');

router.post('/', addDeliveryBoy);
router.get('/vendor/:vendorId', getVendorDeliveryBoys);
router.put('/:id', updateDeliveryBoy);
router.delete('/:id', deleteDeliveryBoy);
router.get('/tasks/:id', getDeliveryBoyTasks);
router.put('/tasks/:orderId/status', updateTaskStatus);

module.exports = router;
