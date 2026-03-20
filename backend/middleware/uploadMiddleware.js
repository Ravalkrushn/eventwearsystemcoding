const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const folders = ['uploads/products', 'uploads/vendors', 'uploads/categories'];
folders.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Check which folder to use based on fieldname
    let folder = 'uploads/products';
    if (file.fieldname === 'shopImage') folder = 'uploads/vendors';
    if (file.fieldname === 'image') folder = 'uploads/categories';
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Please upload only images'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

module.exports = upload;
