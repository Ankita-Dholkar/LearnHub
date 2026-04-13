import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'; // Import the fs module to handle file system operations


const uploadOnCloudinary = async (filePath) => { // Function to upload a file to Cloudinary

      cloudinary.config({  // Configure Cloudinary with your credentials
        cloud_name: process.env.CLOUDINARY_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });

    try {
        if(!filePath) {
            return null;
        }
        const uploadResult = await cloudinary.uploader.upload(filePath,{resource_type:'auto'})
        fs.unlinkSync(filePath) // Delete the file after uploading to Cloudinary
        return uploadResult.secure_url;
      
    } catch (error) {
       fs.unlinkSync(filePath) // Delete the file if there's an error during upload
       console.log(error);
       
    }
}

export default uploadOnCloudinary;