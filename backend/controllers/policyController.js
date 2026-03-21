const Policy = require('../models/Policy');

// @desc    Add or Update vendor policy
// @route   POST /api/vendors/policies
// @access  Private (Vendor)
exports.addOrUpdatePolicy = async (req, res, next) => {
  try {
    const { vendorId, type, title, content, disclaimer } = req.body;

    let policy = await Policy.findOne({ vendor: vendorId, type });

    if (policy) {
      policy.title = title;
      policy.content = content;
      policy.disclaimer = disclaimer;
      await policy.save();
      return res.status(200).json({ success: true, message: 'Policy updated successfully', data: policy });
    }

    policy = await Policy.create({
      vendor: vendorId,
      type,
      title,
      content,
      disclaimer
    });

    res.status(201).json({ success: true, message: 'Policy added successfully', data: policy });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all policies for a vendor
// @route   GET /api/vendors/policies/:vendorId
// @access  Public
exports.getVendorPolicies = async (req, res, next) => {
  try {
    const policies = await Policy.find({ vendor: req.params.vendorId });
    res.status(200).json({ success: true, count: policies.length, data: policies });
  } catch (error) {
    next(error);
  }
};
