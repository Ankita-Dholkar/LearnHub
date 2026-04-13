import React from 'react'
import { useSelector } from "react-redux";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from "recharts";
import img from "../../assets/empty.jpg";
import { useNavigate } from 'react-router-dom';
import { FaArrowLeftLong } from "react-icons/fa6";
import { BookOpen, Users, IndianRupee } from "lucide-react";

function Dashboard() {
  const navigate = useNavigate()
  const { userData } = useSelector((state) => state.user);
  const { creatorCourseData } = useSelector((state) => state.course);

  const courseProgressData = creatorCourseData?.map(course => ({
    name: course.title.slice(0, 10) + "...",
    lectures: course.lectures.length || 0
  })) || [];

  const enrollData = creatorCourseData?.map(course => ({
    name: course.title.slice(0, 10) + "...",
    enrolled: course.enrolledStudents?.length || 0
  })) || [];

  const totalEarnings = creatorCourseData?.reduce((sum, course) => {
    const studentCount = course.enrolledStudents?.length || 0;
    const courseRevenue = course.price ? course.price * studentCount : 0;
    return sum + courseRevenue;
  }, 0) || 0;

  const totalCourses = creatorCourseData?.length || 0;

  const totalStudents = creatorCourseData?.reduce(
    (sum, c) => sum + (c.enrolledStudents?.length || 0), 0
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-50 to-white overflow-hidden">

      {/* Background Glow */}
      <div className='absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/30 blur-[120px] rounded-full' />
      <div className='absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-sky-200/30 blur-[120px] rounded-full' />

      {/* Back Button */}
      <FaArrowLeftLong
        className='w-[20px] h-[20px] absolute top-8 left-8 cursor-pointer text-gray-600 hover:text-blue-500 transition z-20'
        onClick={() => navigate("/")}
      />

      <div className="relative z-10 w-full px-6 py-16 space-y-10">

        {/* 🔹 Header */}
        <div className="max-w-6xl mx-auto bg-white border border-blue-100 rounded-3xl shadow-sm p-8 flex flex-col md:flex-row items-center justify-between gap-6">

          <div className="flex items-center gap-5">
            <img
              src={userData?.photoUrl || img}
              className="w-20 h-20 rounded-full border-4 border-blue-200 shadow-sm"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome, {userData?.name || "Educator"} 👋
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {userData?.description || "Start creating amazing courses!"}
              </p>
            </div>
          </div>

          <button
            className='px-6 py-2.5 bg-blue-500 text-white rounded-lg text-sm font-medium shadow-sm hover:bg-blue-600 transition'
            onClick={() => navigate("/courses")}
          >
            Create Course
          </button>
        </div>

        {/* 🔹 Stats Cards */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl">
            <div className="flex justify-between items-center">
              <p className="text-gray-600 text-sm">Total Courses</p>
              <BookOpen className="text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold mt-2 text-gray-900">
              {totalCourses}
            </h2>
          </div>

          <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl">
            <div className="flex justify-between items-center">
              <p className="text-gray-600 text-sm">Students</p>
              <Users className="text-sky-500" />
            </div>
            <h2 className="text-2xl font-bold mt-2 text-gray-900">
              {totalStudents}
            </h2>
          </div>

          <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl">
            <div className="flex justify-between items-center">
              <p className="text-gray-600 text-sm">Earnings</p>
              <IndianRupee className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold mt-2 text-blue-600">
              ₹{totalEarnings.toLocaleString()}
            </h2>
          </div>

        </div>

        {/* 🔹 Charts */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Course Progress */}
          <div className="bg-white border border-blue-100 rounded-2xl shadow-sm p-6 hover:shadow-md transition">
            <h2 className="font-semibold text-gray-800 mb-4">
              Course Progress
            </h2>

            {courseProgressData.length === 0 ? (
              <p className="text-gray-400 text-center py-10">
                No courses yet
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={courseProgressData}>
                  <CartesianGrid stroke="#e0f2fe" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "10px",
                      border: "1px solid #e0f2fe",
                      fontSize: "12px"
                    }}
                  />
                  <Bar dataKey="lectures" fill="#60a5fa" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Enrollment */}
          <div className="bg-white border border-blue-100 rounded-2xl shadow-sm p-6 hover:shadow-md transition">
            <h2 className="font-semibold text-gray-800 mb-4">
              Student Enrollment
            </h2>

            {enrollData.length === 0 ? (
              <p className="text-gray-400 text-center py-10">
                No enrollments yet
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={enrollData}>
                  <CartesianGrid stroke="#e0f2fe" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "10px",
                      border: "1px solid #e0f2fe",
                      fontSize: "12px"
                    }}
                  />
                  <Bar dataKey="enrolled" fill="#38bdf8" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

        </div>

      </div>
    </div>
  )
}

export default Dashboard;