import axios from "axios";
import React, { useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../../App";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
const CreateCourse = () => {
    let navigate = useNavigate()
    let [loading, setLoading] = useState(false)
    const [title, setTitle] = useState("")
    const [category, setCategory] = useState("")

    const CreateCourseHandler = async () => {
        setLoading(true)
        try {
            const result = await axios.post(serverUrl + "/api/course/create", { title, category }, { withCredentials: true })
            console.log(result.data)
            toast.success("Course Created")
            navigate("/courses")
            setTitle("")
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
            toast.error(error.response.data.message)
        }

    }

    return (

        <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50/50 to-white px-4 py-10 overflow-hidden">
            <div className='absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/30 blur-[120px] rounded-full pointer-events-none' />
            <div className='absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-sky-200/30 blur-[120px] rounded-full pointer-events-none' />

            <div className="relative z-10 max-w-xl w-full mx-auto p-8 bg-white shadow-2xl shadow-blue-100/50 rounded-3xl mt-10 border border-white/50 backdrop-blur-sm">
                <FaArrowLeftLong className='absolute top-8 left-8 w-[20px] h-[20px] cursor-pointer text-gray-700 hover:text-blue-600 transition-colors' onClick={() => navigate("/courses")} />
                <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Create Course</h2>

                <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                    {/* Course Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Course Title
                        </label>
                        <input
                            type="text"
                            placeholder="Enter course title"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all text-gray-800"
                            onChange={(e) => setTitle(e.target.value)} value={title}
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                        </label>
                        <select
                            className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all text-gray-800"
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">Select category</option>
                            <option value="App Development">App Development</option>
                            <option value="AI/ML">AI/ML</option>
                            <option value="AI Tools">AI Tools
                            </option>
                            <option value="Data Science">Data Science</option>
                            <option value="Data Analytics">Data Analytics</option>
                            <option value="Ethical Hacking">Ethical Hacking</option>
                            <option value="UI UX Designing">UI UX Designing</option>
                            <option value="Web Development">Web Development</option>
                            <option value="Others">Others</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full h-[45px] bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg shadow-blue-200 cursor-pointer flex items-center justify-center rounded-xl mt-6" disabled={loading} onClick={CreateCourseHandler}
                    >
                        {loading ? <ClipLoader size={24} color='white' /> : "Create"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateCourse;
