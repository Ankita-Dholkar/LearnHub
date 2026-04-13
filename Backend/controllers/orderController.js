import Course from "../models/courseModel.js";
import Razorpay from 'razorpay'
import User from "../models/userModel.js";
import dotenv from "dotenv"
dotenv.config()
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

export const createOrder = async (req, res) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const amount = Number(course.price);
    if (!amount || isNaN(amount)) {
      return res.status(400).json({ message: "Course price is missing or invalid. Please update course price before enrolling." });
    }

    const options = {
      amount: Math.round(amount * 100), // in paisa
      currency: 'INR',
      receipt: `receipt_${courseId}`.slice(0, 40),
    };

    const order = await razorpayInstance.orders.create(options);
    return res.status(200).json(order);
  } catch (err) {
    console.error("Razorpay Order Creation Error:", err);
    return res.status(500).json({ message: `Order creation failed: ${err.message || err}` });

  }
};



export const verifyPayment = async (req, res) => {
  try {
    
        const {razorpay_order_id , courseId , userId} = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
        if(orderInfo.status === 'paid') {
      // Update user and course enrollment
      const user = await User.findById(userId);
      if (!user.enrolledCourses.includes(courseId)) {
        user.enrolledCourses.push(courseId);
        await user.save();
      }

      const course = await Course.findById(courseId).populate("lectures");
      if (!course.enrolledStudents.includes(userId)) {
        course.enrolledStudents.push(userId);
        await course.save();
      }

      return res.status(200).json({ message: "Payment verified and enrollment successful" });
    } else {
      return res.status(400).json({ message: "Payment verification failed (invalid signature)" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error during payment verification" });
  }
};
