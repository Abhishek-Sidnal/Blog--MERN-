const { v2: cloudinary } = require("cloudinary");
const fs = require("fs");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath, folderName = "default_folder") => {
    if (!localFilePath) {
        console.error("No file path provided");
        return null; // Or throw an error if it's required
    }

    console.log("Upload started:", localFilePath);
    
    try {
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto", // This handles different file types
            folder: Blog-dev, // Folder name in Cloudinary
        });
        console.log("File successfully uploaded to Cloudinary:", response.url);

        // Attempt to delete the local file after upload
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
            console.log("Local file deleted:", localFilePath);
        }

        return response;
    } catch (error) {
        console.error("Error during Cloudinary upload:", error);

        // Attempt to delete the file if an error occurred
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
            console.log("Local file deleted after error:", localFilePath);
        }

        return null; // Consider throwing an error if needed
    }
};

module.exports = { uploadOnCloudinary };
