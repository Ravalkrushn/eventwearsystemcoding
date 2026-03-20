const Customer = require('../models/Customer');

// @desc    Get customer profile
// @route   GET /api/customer/profile/:id
const getProfile = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id).select('-password');
        if (!customer) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }
        res.status(200).json({ success: true, data: customer });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update customer profile
// @route   PUT /api/customer/profile/:id
const updateProfile = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).select('-password');

        if (!customer) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }

        res.status(200).json({ success: true, data: customer });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getProfile,
    updateProfile
};
