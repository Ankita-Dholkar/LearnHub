import User from "../models/userModel.js"
import validator from "validator"
import bcrypt from "bcryptjs"
import genToken from "../config/token.js"
import sendMail from "../config/sendMail.js"

export const signUp = async (req, res) => {
    try {
        const { name, email, password, role } = req.body
        let existUser = await User.findOne({ email })
        if (existUser) {
            // console.log("user already exists");

            return res.status(400).json({ message: "User is already exist" })
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Enter Valid email" })
        }
        // if(!name || !email || !password || !role) {
        //     return res.status(400).json({
        //         message: "All fields are required"
        //     })
        // }
        if (password.length < 8) {
            return res.status(400).json({ message: "Enter Strong password" })
        }
        let hashPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            name,
            email,
            password: hashPassword,
            role,
        })
        //token generation after the user gets authenticated
        let token = await genToken(user._id)
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 //changed 7 days into milliseconds
        })
        return res.status(201).json(user)

    } catch (error) {
        return res.status(500).json({ message: `SignUp error ${error}` })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        let isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect Password" })
        }
        let token = await genToken(user._id)
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 //changed 7 days into milliseconds
        })
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ message: `Login error ${error}` })
    }
}

export const logout = async (req, res) => {
    try {
        await res.clearCookie("token") //clear token
        return res.status(200).json({ message: "LogOut Success" })
    }
    catch (error) {

    }
}

export const sendOTP = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        // Generate  OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString(); // Generate a 4-digit OTP

        user.resetOtp = otp,
            user.otpExpires = Date.now() + 5 * 60 * 1000, //otp will expire in 5 min
            user.isOtpVerified = false

        await user.save()
        await sendMail(email, otp)
        return res.status(200).json({ message: "Otp Send successfully" })
    } catch (error) {
        return res.status(500).json({ message: `send Otp error ${error}` })
    }
}

export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body
        const user = await User.findOne({ email })
        if (!user || user.resetOtp != otp || user.otpExpires < Date.now()) {
            return res.status(404).json({ message: "Invalid OTP" })
        }
        user.isOtpVerified = true
        user.resetOtp = undefined, //set to undefined
            user.otpExpires = undefined,

            await user.save();
        return res.status(200).json({ message: "Otp verified successfully" })

    } catch (error) {
        return res.status(500).json({ message: `verify Otp error ${error}` })
    }
}


//controller for reset password
export const resetPassword = async (req, res) => {

    try {

        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user || !user.isOtpVerified) {
            return res.status(404).json({ message: "OTP verification is required" })
        }
        const hashPassword = await bcrypt.hash(password, 10)
        user.password = hashPassword,
            user.isOtpVerified = false

        await user.save()
        return res.status(200).json({ message: "Reset password successfully" })

    }
    catch (error) {
        return res.status(500).json({ message: `Reset password error ${error}` })
    }
}


export const googleSignup = async (req,res) => {

    try {
       const {name, email, role} = req.body
    let user = await User.findOne({email})
    if(!user) {
        user = await User.create({
            name,
            email,
            role
        })
    }

    let token = await genToken(user._id) 
    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 //changed 7 days into milliseconds
    });

    return res.status(200).json(user);

    } catch (error) {
        return res.status(500).json({message:`GoogleAuth error ${error}`})
    }
    
}