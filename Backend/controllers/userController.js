import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../models/userModel.js"



export const getCurrentUser = async (req,res) => {
    try {
        const user = await User.findById(req.userId).select("-password").populate("enrolledCourses") //password would not reflect after passing the user
        if(!user) {
            return res.status(404).json({message:"User not found"})
        }
        return res.status(200).json(user)
    } catch(error) {
        console.log(error);
        
        return res.status(500).json({message:`GetCurrentUser error ${error}`})
    }
}

export const UpdateProfile = async (req,res) => {
    try {
        const userId = req.userId
        const {name, description, role} = req.body

        // Build update object dynamically — only set photoUrl if a new file was uploaded
        const updateFields = {}
        if (name !== undefined) updateFields.name = name
        if (description !== undefined) updateFields.description = description
        if (role && ["student", "educator"].includes(role)) {
            updateFields.role = role
        }

        if (req.file) {
            const uploadedPhoto = await uploadOnCloudinary(req.file.path)
            if (uploadedPhoto) {
                updateFields.photoUrl = uploadedPhoto
            }
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true }).select("-password")

        if(!updatedUser) {
             return res.status(404).json({message:"User not found"})
        }
        return res.status(200).json(updatedUser)

    } catch (error) {
        console.error("UpdateProfile error:", error)
        return res.status(500).json({message:`Update Profile error: ${error.message || error}`})
    }
}