const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload file to Cloudinary
exports.uploadToCloudinary = async (filePath, folder) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: 'auto'
    });

    // Delete the local file after upload
    await unlinkAsync(filePath);

    return result;
  } catch (error) {
    // Delete the local file if upload fails
    try {
      await unlinkAsync(filePath);
    } catch (unlinkError) {
      console.error('Error deleting local file:', unlinkError);
    }
    throw error;
  }
};

// Delete file from Cloudinary
exports.deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
}; 