import Course from "../models/courseModel.js"
import Lecture from "../models/lectureModel.js"
import uploadOnCloudinary from "../config/cloudinary.js"
import User from "../models/userModel.js"
import CourseProgress from "../models/courseProgressModel.js"

export const createCourse = async (req, res) => {
    try {
        const { title, category } = req.body
        if (!title || !category) {
            return res.status(400).json({ message: "title or Category is required" })
        }
        const course = await Course.create({
            title,
            category,
            creator: req.userId //userId from isAuth middleware ,only authenticated user can create courses
        })
        return res.status(201).json({
            success: true,
            message: "Course created successfully",
            course
        })

    } catch (error) {
        return res.status(500).json({ message: `CreateCourse error ${error}` })
    }
}

export const getPublishedCourses = async (req, res) => {
    try {
        const courses = await Course.find({ isPublished: true }).populate("lectures")
        if (!courses) {
            return res.status(400).json({ message: "Courses is not found" })
        }
        return res.status(200).json(courses)
    } catch (error) {
        return res.status(500).json({ message: `failed to get isPublished Courses ${error}` })
    }
}

export const getCreatorCourses = async (req, res) => {
    try {
        const courses = await Course.find({ creator: req.userId })
        if (!courses) {
            return res.status(400).json({ message: "Course is not found" })
        }
        return res.status(200).json(courses)
    } catch (error) {
        return res.status(500).json({ message: `failed to get Creator Courses ${error}` })
    }

}

export const editCourse = async (req, res) => {
    try {
        const { courseId } = req.params
        const { title, subTitle, description, level, price, isPublished } = req.body
        let thumbnail
        if (req.file) {
            thumbnail = await uploadOnCloudinary(req.file.path)
        }
        let course = await Course.findById(courseId)
        if (!course) {
            return res.status(400).json({ message: 'Course is not found' })
        }
        const updateData = { title, subTitle, description, level, price, thumbnail, isPublished }

        course = await Course.findByIdAndUpdate(courseId, updateData, { new: true })
        return res.status(200).json(course)
    } catch (error) {
        return res.status(500).json({ message: `failed to edit Course ${error}` })
    }
}

export const getCourseById = async (req, res) => {
    try {
        const { courseId } = req.params
        let course = await Course.findById(courseId)
        if (!course) {
            return res.status(404).json({ message: "Course not found" })
        }
        return res.status(200).json(course)

    } catch (error) {
        return res.status(500).json({ message: `Failed to get course ${error}` })
    }
}

export const removeCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        await course.deleteOne();
        return res.status(200).json({ message: "Course Removed Successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: `Failed to remove course ${error}` })
    }
};


//create Lecture, get Lecture, remove Lecture, edit Lecture would be added in the future as per the requirement of the project
export const createLecture = async (req, res) => {
    try {
        const { lectureTitle } = req.body
        const { courseId } = req.params

        if (!lectureTitle || !courseId) {
            return res.status(400).json({ message: "Lecture Title required" })
        }
        const lecture = await Lecture.create({ lectureTitle })
        const course = await Course.findById(courseId)
        if (course) {
            course.lectures.push(lecture._id)

        }
        await course.populate("lectures")
        await course.save()
        return res.status(201).json({ lecture, course })

    } catch (error) {
        return res.status(500).json({ message: `Failed to Create Lecture ${error}` })
    }
}

export const getCourseLecture = async (req, res) => {
    try {
        const { courseId } = req.params
        const course = await Course.findById(courseId)
        if (!course) {
            return res.status(404).json({ message: "Course not found" })
        }
        await course.populate("lectures")
        await course.save()
        return res.status(200).json(course)
    } catch (error) {
        return res.status(500).json({ message: `Failed to get Lectures ${error}` })
    }

}

export const editLecture = async (req, res) => {
    try {
        const { lectureId } = req.params
        const { isPreviewFree, lectureTitle, transcript } = req.body
        const lecture = await Lecture.findById(lectureId)
        if (!lecture) {
            return res.status(404).json({ message: "Lecture not found" })
        }
        let videoUrl
        if (req.file) {
            videoUrl = await uploadOnCloudinary(req.file.path)
            lecture.videoUrl = videoUrl
        }
        if (lectureTitle) {
            lecture.lectureTitle = lectureTitle
        }
        if (transcript !== undefined) {
            lecture.transcript = transcript
        }
        lecture.isPreviewFree = isPreviewFree

        await lecture.save()
        return res.status(200).json(lecture)
    } catch (error) {
        return res.status(500).json({ message: `Failed to edit Lectures ${error}` })
    }

}


export const removeLecture = async (req, res) => {
    try {
        const { lectureId } = req.params
        const lecture = await Lecture.findByIdAndDelete(lectureId)
        if (!lecture) {
            return res.status(404).json({ message: "Lecture not found" })
        }
        //remove the lecture from associated course

        await Course.updateOne(
            { lectures: lectureId },
            { $pull: { lectures: lectureId } }
        )
        return res.status(200).json({ message: "Lecture Remove Successfully" })
    }

    catch (error) {
        return res.status(500).json({ message: `Failed to remove Lectures ${error}` })
    }
}


//get Creator data

export const getCreatorById = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await User.findById(userId).select("-password"); // Exclude password

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        res.status(500).json({ message: "get Creator error" });
    }
};

export const getCourseProgress = async (req, res) => {
    try {
        const { courseId } = req.params;
        const progress = await CourseProgress.findOne({ courseId, userId: req.userId });

        return res.status(200).json({ success: true, progress });
    } catch (error) {
        return res.status(500).json({ message: "Failed to get course progress", error });
    }
}

export const markLectureAsCompleted = async (req, res) => {
    try {
        const { courseId, lectureId } = req.body;
        let progress = await CourseProgress.findOne({ courseId, userId: req.userId });

        if (!progress) {
            progress = new CourseProgress({
                userId: req.userId,
                courseId,
                completedLectures: [lectureId]
            });
            await progress.save();
        } else {
            if (!progress.completedLectures.some(id => id.toString() === lectureId.toString())) {
                progress.completedLectures.push(lectureId);
                await progress.save();
            }
        }

        return res.status(200).json({ success: true, progress });
    } catch (error) {
        return res.status(500).json({ message: "Failed to mark lecture as completed", error });
    }
}

export const getStudentDashboard = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate({
            path: 'enrolledCourses',
            populate: {
                path: 'lectures'
            }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const enrolledCourses = user.enrolledCourses || [];
        const progress = await CourseProgress.find({ userId: req.userId });

        const dashboardData = enrolledCourses.map(course => {
            const courseProgress = progress.find(p => p.courseId.toString() === course._id.toString());

            const uniqueCompletedLectures = courseProgress
                ? new Set(courseProgress.completedLectures.map(id => id.toString()))
                : new Set();

            const completedCount = uniqueCompletedLectures.size;
            const totalLectures = course.lectures?.length || 0;
            let percentage = totalLectures === 0 ? 0 : Math.round((completedCount / totalLectures) * 100);
            if (percentage > 100) percentage = 100;

            return {
                _id: course._id,
                title: course.title,
                thumbnail: course.thumbnail,
                category: course.category,
                level: course.level,
                completedLectures: completedCount,
                totalLectures,
                percentage
            };
        });

        return res.status(200).json({ success: true, dashboardData });

    } catch (error) {
        return res.status(500).json({ message: "Failed to generate dashboard data", error });
    }
}
