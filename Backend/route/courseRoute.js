import express from 'express';
import { createCourse, createLecture, editCourse, editLecture, getCourseById, getCourseLecture, getCourseProgress, getCreatorById, getCreatorCourses, getPublishedCourses, getStudentDashboard, markLectureAsCompleted, removeCourse, removeLecture } from '../controllers/courseController.js';
import upload from '../middleware/multer.js';
import isAuth from '../middleware/isAuth.js';

const courseRouter = express.Router()
//for courses
courseRouter.post("/create",isAuth,createCourse) 
courseRouter.get("/getpublished",getPublishedCourses) 
courseRouter.get("/getcreatorcourses",isAuth,getCreatorCourses)
courseRouter.post("/editcourse/:courseId",isAuth,upload.single("thumbnail"),editCourse)
courseRouter.get("/getcourse/:courseId",isAuth,getCourseById)
courseRouter.delete("/removecourse/:courseId",isAuth,removeCourse)


//for lectures
courseRouter.post("/createlecture/:courseId",isAuth,createLecture)
courseRouter.get("/getcourselecture/:courseId",isAuth,getCourseLecture)
courseRouter.post("/editlecture/:lectureId",isAuth,upload.single("videoUrl"),editLecture)
courseRouter.delete("/removelecture/:lectureId",isAuth,removeLecture)
courseRouter.post("/getCreator",isAuth,getCreatorById) 

//for student progress dashboard
courseRouter.get("/progress/dashboard", isAuth, getStudentDashboard)
courseRouter.get("/progress/:courseId", isAuth, getCourseProgress)
courseRouter.post("/progress/mark-lecture", isAuth, markLectureAsCompleted)

export default courseRouter