import React, { useEffect } from 'react'

import { FaEdit } from "react-icons/fa";

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';
import { setCreatorCourseData } from '../../redux/courseSlice.js';
import img1 from "../../assets/empty.jpg"
import { FaArrowLeftLong } from "react-icons/fa6";
function Courses() {

  let navigate = useNavigate()
  let dispatch = useDispatch()

  const { creatorCourseData } = useSelector(state => state.course)

  useEffect(() => {
    const getCreatorData = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/course/getcreatorcourses", { withCredentials: true })

        await dispatch(setCreatorCourseData(result.data))


        console.log(result.data)

      } catch (error) {
        console.log(error)
        toast.error(error.response.data.message)
      }

    }
    getCreatorData()
  }, [])



  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-50/50 to-white flex overflow-hidden">
      <div className='absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/30 blur-[120px] rounded-full pointer-events-none' />
      <div className='absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-sky-200/30 blur-[120px] rounded-full pointer-events-none' />

      <div className="relative z-10 w-[100%] min-h-screen p-4 sm:p-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className='flex items-center justify-center gap-3'><FaArrowLeftLong className='w-[20px] h-[20px] cursor-pointer text-gray-700 hover:text-blue-600 transition-colors' onClick={() => navigate("/dashboard")} />
            <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
          </div>

          <button className="bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2" onClick={() => navigate("/createcourses")}>
            <span className="text-lg leading-none mt-[-2px]">+</span> Create Course
          </button>
        </div>

        {/* For larger screens (table layout) */}

        <div className="hidden md:block bg-white rounded-3xl shadow-xl shadow-blue-50/50 border border-blue-50 p-6 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4">Course</th>
                <th className="text-left py-3 px-4">Price</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {creatorCourseData?.map((course, index) => (

                <tr key={index}

                  className="border-b border-gray-100 hover:bg-blue-50/30 transition duration-200"
                >
                  <td className="py-3 px-4 flex items-center gap-4">
                    {course?.thumbnail ? <img
                      src={course?.thumbnail}
                      alt=""
                      className="w-25 h-14 object-cover rounded-md"
                    /> : <img src={img1} alt='' className="w-14 h-14 object-cover rounded-md object-fit" />}
                    <span>{course?.title}</span>
                  </td>
                  {course?.price ? <td className="py-3 px-4 font-medium">₹{course?.price}</td> : <td className="py-3 px-4 text-gray-500">Free</td>}
                  <td className="py-3 px-4">
                    <span className={`  px-3 py-1 rounded-full text-xs ${course?.isPublished ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"}`}>
                      {course?.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <FaEdit className="text-gray-600 hover:text-blue-600 cursor-pointer" onClick={() => navigate(`/addcourses/${course?._id}`)} />
                  </td>
                </tr>
              ))
              }
            </tbody>
          </table>
          <p className="text-center text-sm text-gray-400 mt-6">
            A list of your recent courses.
          </p>
        </div>


        <div className="md:hidden space-y-4">
          {creatorCourseData?.map((course, index) => (
            <div key={index}

              className="bg-white rounded-2xl shadow-lg shadow-blue-50/50 border border-blue-50 p-5 flex flex-col gap-4 mb-4"
            >
              <div className="flex gap-4 items-center">
                {course?.thumbnail ? <img
                  src={course?.thumbnail}
                  alt=""
                  className="w-16 h-16 rounded-md object-cover"
                /> : <img
                  src={img1}
                  alt=""
                  className="w-16 h-16 rounded-md object-cover"
                />}
                <div className="flex-1">
                  <h2 className="font-bold text-gray-900 text-base">{course?.title}</h2>
                  {course?.price ? <p className="text-blue-600 font-semibold text-sm mt-1">₹{course?.price}</p> : <p className="text-blue-600 font-semibold text-sm mt-1">Free</p>}
                </div>
                <FaEdit className="text-gray-600 hover:text-blue-600 cursor-pointer" onClick={() => navigate(`/addcourses/${course?._id}`)} />
              </div>
              <span className={` w-fit px-3 py-1 text-xs rounded-full  ${course?.isPublished ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"}`}>
                {course?.isPublished ? "Published" : "Draft"}
              </span>
            </div>
          ))}
          <p className="text-center text-sm text-gray-400 mt-4 pl-[80px]">
            A list of your recent courses.
          </p>

        </div>


      </div>
    </div>
  );

}

export default Courses
