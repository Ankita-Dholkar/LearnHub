import React, { useEffect, useState } from 'react'
import { FaArrowLeftLong } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { serverUrl } from '../../App';
import { ClipLoader } from 'react-spinners';
import { setLectureData } from '../../redux/lectureSlice';
import { toast } from 'react-toastify';
import axios from 'axios';
import { MdEdit } from "react-icons/md";

const CreateLecture = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [lectureTitle, setLectureTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const { lectureData } = useSelector((state) => state.lecture);


    const handleCreateLecture = async () => {

        setLoading(true);
        try {
            const result = await axios.post(serverUrl + `/api/course/createlecture/${courseId}`, { lectureTitle }, { withCredentials: true })
            console.log(result.data);
            dispatch(setLectureData([...lectureData, result.data.lecture]));
            setLoading(false);
            toast.success("Added Lecture Successfully");
            setLectureTitle(""); // Clear the input field after successful creation to add next lecture

        } catch (error) {
            console.log(error);
            setLoading(false);
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        const getCourseLecture = async () => {
            try {
                const result = await axios.get(serverUrl + `/api/course/getcourselecture/${courseId}`, { withCredentials: true })
                console.log(result.data);
                // The backend returns the course object directly, so lectures are at result.data.lectures
                dispatch(setLectureData(result.data.lectures || []));
            } catch (error) {
                console.log(error);
            }
        }
        getCourseLecture();
    }, [courseId])



    return (
        <div className='relative min-h-screen bg-gray-50 flex items-center justify-center p-4 py-10 overflow-hidden'>
            <div className='relative z-10 bg-white shadow-sm rounded-3xl w-full max-w-3xl p-8 md:p-10 border border-gray-100'>
                {/* header */}
                <div className='mb-6' >
                    <h1 className='text-3xl font-bold text-gray-900 mb-2'>
                        Let's Add a Lecture
                    </h1>
                    <p className='text-sm text-gray-500'>
                        Enter the title and add your video lectures to enhance your course content.
                    </p>
                </div>

                {/* input Area */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Lecture Title</label>
                  <input type="text" className='w-full border border-gray-200 bg-gray-50 rounded-xl p-4 text-sm focus:outline-none focus:bg-white focus:border-gray-300 focus:ring-4 focus:ring-gray-100 transition-all text-gray-900 mb-4' placeholder='e.g. Introduction to Mern Stack' onChange={(e) => setLectureTitle(e.target.value)} value={lectureTitle} />
                </div>

                {/* Button */}
                <div className='flex gap-4 mb-10 border-b border-gray-100 pb-8'>
                    <button className='flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 transition-all font-semibold shadow-sm' onClick={() => navigate(`/addcourses/${courseId}`)} ><FaArrowLeftLong className='text-gray-500' />Back to Course</button>
                    <button className='flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition-all font-bold shadow-sm' disabled={loading} onClick={handleCreateLecture}>{loading ? <ClipLoader size={24} color='white' /> : "+ Add Lecture"}</button>
                </div>

                {/* lecture list */}
                <div>
                   <h2 className="text-xl font-bold text-gray-900 mb-4">Course Curriculum</h2>
                   <div className='space-y-3'>
                       {lectureData?.length === 0 && (
                           <p className="text-gray-500 text-sm italic text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">No lectures added yet. Start by creating one above!</p>
                       )}
                       {lectureData?.map((lecture, index) => (
                           <div key={index} className='bg-white border border-gray-100 hover:border-gray-300 hover:shadow-sm transition-all rounded-xl flex justify-between items-center p-5 text-sm font-semibold text-gray-800 group' >
                               <span className="flex items-center gap-3">
                                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 border border-gray-200">{index + 1}</span>
                                  {lecture.lectureTitle}
                               </span>
                               <span>
                                   <MdEdit className='text-gray-400 cursor-pointer group-hover:text-gray-900 transition-colors w-5 h-5' onClick={() => navigate(`/editlecture/${courseId}/${lecture._id}`)} />
                               </span>
                           </div>
                       ))}
                   </div>
                </div>

            </div>

        </div>
    )
}

export default CreateLecture