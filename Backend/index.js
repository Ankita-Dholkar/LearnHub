import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDb from './config/connectDB.js';
import authRouter from './route/authRoute.js';
import cors from 'cors';
import userRouter from './route/userRoute.js';
import courseRouter from './route/courseRoute.js';
import paymentRouter from './route/paymentRoute.js';
import aiRouter from './route/aiRoute.js';
import reviewRouter from './route/reviewRoute.js';


dotenv.config();
connectDb();

const port = process.env.PORT
const app = express();
app.set("trust proxy", 1);
app.use(express.json())
app.use(cookieParser())

const clientUrls = (process.env.CLIENT_URL || process.env.FRONTEND_URL || "")
    .split(",")
    .map(url => url.trim().replace(/\/+$/, ""))
    .filter(Boolean);

const allowedOrigins = [
    "http://localhost:5173",
    ...clientUrls
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const cleanOrigin = origin.replace(/\/+$/, "");
        if (allowedOrigins.includes(cleanOrigin)) {
            return callback(null, true);
        }
        return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
}))



app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use("/api/course",courseRouter)
app.use("/api/payment", paymentRouter)
app.use("/api/ai", aiRouter)
app.use("/api/review", reviewRouter)

app.get("/",(req,res) => {
    res.send("Hello from Server");
})


app.listen(port,() => {
    console.log(`Server running on port ${port}`);
    
})
