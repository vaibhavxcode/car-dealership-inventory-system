const express = require('express');
const vehicleController = require('../controllers/vehicleController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// Apply protect middleware to all routes below this point
router.use(protect);

router.get('/', vehicleController.getAllVehicles);
router.get('/search', vehicleController.searchVehicles);

// Purchase can be done by standard users and admins
router.post('/:id/purchase', vehicleController.purchaseVehicle);

// Admin-only actions
router.post('/', restrictTo('admin'), vehicleController.createVehicle);
router.put('/:id', restrictTo('admin'), vehicleController.updateVehicle);
router.delete('/:id', restrictTo('admin'), vehicleController.deleteVehicle);
router.post('/:id/restock', restrictTo('admin'), vehicleController.restockVehicle);

module.exports = router;
