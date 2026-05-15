// Cloudinary configuration for image storage in the Audibox E-commerce application.
// This module sets up Cloudinary as the cloud-based image storage solution for product photos.
// In an e-commerce context, images are crucial for product presentation and user experience.
// Data flow: Admin uploads product images → Multer processes files → Cloudinary stores and optimizes → URLs saved to product database records.

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary with credentials from environment variables.
// These sensitive credentials are kept secure and not hardcoded.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up Cloudinary storage for Multer (file upload middleware).
// This defines how uploaded images are stored in the cloud.
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'ecommerce-products', // Organizes images in a dedicated folder
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'], // Restricts to web-compatible formats
    transformation: [{ width: 800, height: 800, crop: 'limit' }], // Auto-resizes images for consistent display
  },
});

// Create the Multer upload middleware with Cloudinary storage.
// This middleware will be used in routes to handle file uploads from the frontend.
const upload = multer({ storage });

module.exports = { cloudinary, upload };