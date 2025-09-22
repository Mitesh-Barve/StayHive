const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET, // Fixed typo: was CLOUD_API_SECRTE
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'stayhive_DEV',
      // Removed allowed_formats restriction to allow all image formats
    },
});

module.exports = {
    cloudinary,
    storage,
};