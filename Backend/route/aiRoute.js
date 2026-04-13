import express from "express"
import { searchWithAi } from '../controllers/searchController.js';
import { generateCourseQuiz } from '../controllers/quizController.js';
import isAuth from '../middleware/isAuth.js';

let aiRouter = express.Router()

aiRouter.post("/search",searchWithAi)
aiRouter.get("/generate-quiz/:courseId", isAuth, generateCourseQuiz)

export default aiRouter