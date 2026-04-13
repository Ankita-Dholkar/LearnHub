import express from "express"
import { addReview, getAllReviews } from "../controllers/reviewController.js"
import isAuth from "../middleware/isAuth.js"



let reviewRouter = express.Router()

reviewRouter.post("/givereview",isAuth,addReview)
reviewRouter.get("/allReview",getAllReviews)


export default reviewRouter