import { GoogleGenAI } from "@google/genai";
import Course from "../models/courseModel.js";

export const generateCourseQuiz = async (req, res) => {
    try {
        const { courseId } = req.params;
        
        // 1. Fetch course and populate lectures
        const course = await Course.findById(courseId).populate("lectures");
        if (!course) return res.status(404).json({ message: "Course not found" });

        // 2. Aggregate all lecture transcripts
        let aggregatedContext = `Course Title: ${course.title}\n`;
        let hasTranscriptContent = false;
        
        course.lectures.forEach((lec, index) => {
            if(lec.transcript && lec.transcript.trim() !== "") {
                aggregatedContext += `\nLecture ${index + 1}: ${lec.lectureTitle}\nTranscript: ${lec.transcript}\n`;
                hasTranscriptContent = true;
            } else {
                aggregatedContext += `\nLecture ${index + 1}: ${lec.lectureTitle}\n`;
            }
        });

        if(!hasTranscriptContent) {
            aggregatedContext += `\n\nNote for AI: The educator has not provided transcripts for this course. Please generate an educational quiz based strictly on the general subject matter inferred from the Course Title and Lecture Titles.`
        }

        // 3. Prompt the AI
        const ai = new GoogleGenAI({});
        const prompt = `You are an expert educator. Based strictly on the following course material, generate a 10-question multiple-choice quiz.
        Return ONLY a raw valid JSON array of objects without markdown blocks or backticks. 
        Each object must have exactly:
        - "question" (string)
        - "options" (array of exactly 4 strings)
        - "correctAnswer" (string, must exactly match one of the options)
        
        Begin Course Material:
        ${aggregatedContext}`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        // 4. Parse the JSON and return to frontend
        let rawText = response.text.replace(/```json/gi, "").replace(/```/g, "").trim();
        const quizData = JSON.parse(rawText);

        return res.status(200).json(quizData);
    } catch (error) {
        console.error("Quiz Gen Error:", error);
        return res.status(500).json({ message: `Quiz Generation Failed: ${error.message}` });
    }
}
