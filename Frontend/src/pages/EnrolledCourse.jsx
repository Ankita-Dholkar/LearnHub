import React  from 'react'

import { useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
import { FaArrowLeftLong } from "react-icons/fa6";

function EnrolledCourse() {
  const navigate = useNavigate()

  const { userData } = useSelector((state) => state.user);
  const { courseData } = useSelector((state) => state.course);

  // Correctly map enrolled courses even if backend sends unpopulated raw ObjectIDs from login or nulls from deleted courses
  const enrolledCourses = userData?.enrolledCourses?.map(courseItem => {
      // If it's a string (unpopulated ID from login payload)
      if (typeof courseItem === 'string') {
          return courseData?.find(c => c._id === courseItem);
      }
      // If it's a populated object
      else if (courseItem && typeof courseItem === 'object' && courseItem._id) {
          // If the course was deleted but the ID remained, mongoose populate might return an empty or null object.
          // By falling back to matching courseData, we ensure the course still legitimately exists.
          return courseData?.find(c => c._id === courseItem._id) || courseItem;
      }
      return null;
  }).filter(Boolean) || []; // Filter out nulls/undefined

  return (
    <div className="relative min-h-screen w-full px-4 py-12 bg-gradient-to-b from-blue-50/50 to-white overflow-hidden">
      <div className='absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/30 blur-[120px] rounded-full pointer-events-none' />
      <div className='absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-sky-200/30 blur-[120px] rounded-full pointer-events-none' />

      <div className="relative z-10 max-w-6xl mx-auto">
        <FaArrowLeftLong  className='absolute top-[-2%] md:top-[-4%] left-0 w-[20px] h-[20px] cursor-pointer text-gray-700 hover:text-blue-600 transition-colors' onClick={()=>navigate("/")}/>
        <h1 className="text-3xl text-center font-bold text-gray-900 mb-10">
          My Enrolled Courses
        </h1>

      {enrolledCourses.length === 0 ? (
        <p className="text-gray-500 text-center w-full">You haven’t enrolled in any course yet.</p>
      ) : (
        <div className="flex items-center justify-center flex-wrap gap-[30px]">
          {enrolledCourses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-3xl shadow-lg border border-white/50 hover:border-blue-200 hover:shadow-blue-200/50 transition-all duration-300 overflow-hidden w-full max-w-sm"
            >
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">{course.title}</h2>
                <p className="text-sm text-gray-600 mb-2">{course.category}</p>
                <p className="text-sm text-gray-700">{course.level}</p>
                <h1 className='w-full text-center py-3 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-200 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-300 transition-all text-base font-bold flex items-center justify-center cursor-pointer mt-4' onClick={()=>navigate(`/viewlecture/${course._id}`)}>Watch Now</h1>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  )
}

export default EnrolledCourse
