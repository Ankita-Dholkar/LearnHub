import express from 'express';
import { createCourse, createLecture, editCourse, editLecture, getCourseById, getCourseLecture, getCourseProgress, getCreatorById, getCreatorCourses, getPublishedCourses, getStudentDashboard, markLectureAsCompleted, removeCourse, removeLecture } from '../controllers/courseController.js';
import upload from '../middleware/multer.js';
import isAuth from '../middleware/isAuth.js';
import isEducator from '../middleware/isEducator.js';

const courseRouter = express.Router()

// --- Course routes (Educator only for write operations) ---
courseRouter.post("/create", isAuth, isEducator, createCourse)
courseRouter.get("/getpublished", getPublishedCourses)
courseRouter.get("/getcreatorcourses", isAuth, isEducator, getCreatorCourses)
courseRouter.post("/editcourse/:courseId", isAuth, isEducator, upload.single("thumbnail"), editCourse)
courseRouter.get("/getcourse/:courseId", isAuth, getCourseById)
courseRouter.delete("/removecourse/:courseId", isAuth, isEducator, removeCourse)

// --- Lecture routes (Educator only for write operations) ---
courseRouter.post("/createlecture/:courseId", isAuth, isEducator, createLecture)
courseRouter.get("/getcourselecture/:courseId", isAuth, getCourseLecture)
courseRouter.post("/editlecture/:lectureId", isAuth, isEducator, upload.single("videoUrl"), editLecture)
courseRouter.delete("/removelecture/:lectureId", isAuth, isEducator, removeLecture)
courseRouter.post("/getCreator", isAuth, getCreatorById)

// --- Student progress routes ---
courseRouter.get("/progress/dashboard", isAuth, getStudentDashboard)
courseRouter.get("/progress/:courseId", isAuth, getCourseProgress)
courseRouter.post("/progress/mark-lecture", isAuth, markLectureAsCompleted)

export default courseRouter