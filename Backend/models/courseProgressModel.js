import mongoose from "mongoose";

const courseProgressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    completedLectures: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lecture' }],
    completed: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("CourseProgress", courseProgressSchema);
