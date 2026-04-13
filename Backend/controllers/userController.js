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
        const {name,description} = req.body
        let photoUrl
        if(req.file) {
            photoUrl = await uploadOnCloudinary(req.file.path)
        }
        const user = await User.findByIdAndUpdate(userId, {name,description, photoUrl})

        if(!user) {
             return res.status(404).json({message:"User not found"})
        }
        await user.save()
        return res.status(200).json(user)

    } catch (error) {
        return res.status(500).json({message:`update Profile error ${error}`})
    }
}