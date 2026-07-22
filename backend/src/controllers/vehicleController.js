const Vehicle = require('../models/Vehicle');
const AppError = require('../utils/appError');

// Create a new vehicle (Admin only)
exports.createVehicle = async (req, res, next) => {
  try {
    const { make, model, category, price, quantity, imageUrl } = req.body;

    const newVehicle = await Vehicle.create({
      make,
      model,
      category,
      price,
      quantity,
      imageUrl,
    });

    res.status(201).json({
      status: 'success',
      data: {
        vehicle: newVehicle,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Get all vehicles (Protected)
exports.getAllVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: vehicles.length,
      data: {
        vehicles,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Search vehicles (Protected)
exports.searchVehicles = async (req, res, next) => {
  try {
    const { make, model, category, minPrice, maxPrice, search } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { make: { $regex: search.trim(), $options: 'i' } },
        { model: { $regex: search.trim(), $options: 'i' } },
        { category: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    if (make) {
      query.make = { $regex: make, $options: 'i' };
    }
    if (model) {
      query.model = { $regex: model, $options: 'i' };
    }
    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined && minPrice !== '') {
        query.price.$gte = Number(minPrice);
      }
      if (maxPrice !== undefined && maxPrice !== '') {
        query.price.$lte = Number(maxPrice);
      }
      // If object remains empty, delete it
      if (Object.keys(query.price).length === 0) {
        delete query.price;
      }
    }

    const vehicles = await Vehicle.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: vehicles.length,
      data: {
        vehicles,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Update vehicle (Admin only)
exports.updateVehicle = async (req, res, next) => {
  try {
    const { make, model, category, price, quantity, imageUrl } = req.body;
    
    // We update manually or use findByIdAndUpdate with runValidators
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { make, model, category, price, quantity, imageUrl },
      { new: true, runValidators: true }
    );

    if (!vehicle) {
      return next(new AppError('No vehicle found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        vehicle,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Delete vehicle (Admin only)
exports.deleteVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);

    if (!vehicle) {
      return next(new AppError('No vehicle found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      message: 'Vehicle deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};

// Purchase vehicle (Protected)
exports.purchaseVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return next(new AppError('No vehicle found with that ID', 404));
    }

    // Business rule: decrease quantity by 1, reject if 0
    if (vehicle.quantity <= 0) {
      return next(new AppError('Vehicle is out of stock', 400));
    }

    vehicle.quantity -= 1;
    await vehicle.save();

    res.status(200).json({
      status: 'success',
      message: 'Vehicle purchased successfully',
      data: {
        vehicle,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Restock vehicle (Admin only)
exports.restockVehicle = async (req, res, next) => {
  try {
    const { quantity } = req.body;

    if (quantity === undefined || typeof quantity !== 'number') {
      return next(new AppError('Please provide a valid restock quantity number', 400));
    }

    // Business rule: prevent negative values
    if (quantity < 0) {
      return next(new AppError('Restock quantity cannot be negative', 400));
    }

    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return next(new AppError('No vehicle found with that ID', 404));
    }

    vehicle.quantity += quantity;
    await vehicle.save();

    res.status(200).json({
      status: 'success',
      message: 'Vehicle restocked successfully',
      data: {
        vehicle,
      },
    });
  } catch (err) {
    next(err);
  }
};
