import User from "../models/userModel.js"
import validator from "validator"
import bcrypt from "bcryptjs"
import genToken from "../config/token.js"
import sendMail from "../config/sendMail.js"

const isProduction = process.env.NODE_ENV === "production" || 
                     Boolean(process.env.RENDER) || 
                     Boolean(process.env.VERCEL) || 
                     Boolean(process.env.RAILWAY_ENVIRONMENT) ||
                     Boolean(process.env.CLIENT_URL && process.env.CLIENT_URL.startsWith("https"));

const getCookieOptions = () => ({
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
});

export const signUp = async (req, res) => {
    try {
        const { name, email, password, role } = req.body
        let existUser = await User.findOne({ email })
        if (existUser) {
            return res.status(400).json({ message: "User is already exist" })
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Enter Valid email" })
        }
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
        let token = await genToken(user._id)
        res.cookie("token", token, getCookieOptions())
        const userObj = user.toObject ? user.toObject() : { ...user._doc }
        userObj.token = token
        return res.status(201).json(userObj)

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
        res.cookie("token", token, getCookieOptions())
        const userObj = user.toObject ? user.toObject() : { ...user._doc }
        userObj.token = token
        return res.status(200).json(userObj)
    } catch (error) {
        return res.status(500).json({ message: `Login error ${error}` })
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax"
        })
        return res.status(200).json({ message: "LogOut Success" })
    }
    catch (error) {
        return res.status(500).json({ message: `Logout error: ${error.message}` })
    }
}

export const sendOTP = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        user.resetOtp = otp;
        user.otpExpires = Date.now() + 5 * 60 * 1000;
        user.isOtpVerified = false;

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
        user.resetOtp = undefined;
        user.otpExpires = undefined;

        await user.save();
        return res.status(200).json({ message: "Otp verified successfully" })

    } catch (error) {
        return res.status(500).json({ message: `verify Otp error ${error}` })
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user || !user.isOtpVerified) {
            return res.status(404).json({ message: "OTP verification is required" })
        }
        const hashPassword = await bcrypt.hash(password, 10)
        user.password = hashPassword;
        user.isOtpVerified = false;

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
                name: name || "User",
                email,
                role: (role && role.trim()) ? role : "student"
            })
        }

        let token = await genToken(user._id) 
        res.cookie("token", token, getCookieOptions());
        const userObj = user.toObject ? user.toObject() : { ...user._doc }
        userObj.token = token
        return res.status(200).json(userObj);

    } catch (error) {
        return res.status(500).json({message:`GoogleAuth error ${error}`})
    }
}