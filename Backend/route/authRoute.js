import express from "express"
import { googleSignup, login, logout, resetPassword, sendOTP, signUp, verifyOTP } from "../controllers/authController.js";

const authRouter = express.Router()

authRouter.post("/signup",signUp)
authRouter.post("/login",login);
authRouter.get("/logout",logout)
authRouter.post("/sendotp",sendOTP)
authRouter.post("/verifyotp",verifyOTP)
authRouter.post("/resetpassword",resetPassword)
authRouter.post("/googlesignup",googleSignup)


export default authRouter;