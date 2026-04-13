import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { serverUrl } from '../App';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { FaArrowLeftLong } from "react-icons/fa6";

const StudentDashboard = () => {
  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/course/progress/dashboard`, { withCredentials: true });
        setDashboardData(response.data.dashboardData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-16">

      <div className="w-full max-w-6xl mx-auto">
        <div className="mb-8 flex items-center gap-3">
          <FaArrowLeftLong
            className='text-gray-400 hover:text-gray-700 transition-colors w-5 h-5 cursor-pointer'
            onClick={() => navigate("/")}
          />
          <h1 className="text-2xl font-bold text-gray-900">My Learning Dashboard</h1>
        </div>

        {loading ? (
          <div className="flex justify-center mt-20">
            <ClipLoader size={42} color={'#374151'} />
          </div>
        ) : dashboardData.length === 0 ? (
          <div className="text-center mt-20">
            <p className="text-5xl mb-4">📚</p>
            <h2 className="text-xl font-bold text-gray-700 mb-2">No enrolled courses yet</h2>
            <p className="text-gray-400 text-sm mb-6">Start learning by exploring our course library.</p>
            <button
              className="px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-all"
              onClick={() => navigate('/allcourses')}
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardData.map((course) => (
              <div key={course._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-40 object-cover rounded-xl mb-4 bg-gray-100"
                />
                <h2 className="text-base font-bold text-gray-900 line-clamp-2 min-h-[48px]">{course.title}</h2>
                <div className="flex gap-2 text-xs text-gray-500 mt-2 mb-4">
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{course.category}</span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full">{course.level}</span>
                </div>

                <div className="mt-auto">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-semibold text-gray-500">Progress</span>
                    <span className="text-xs font-bold text-gray-700">{course.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 mb-2 overflow-hidden">
                    <div
                      className="bg-gray-800 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${course.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-center text-gray-400 mb-5">
                    {course.completedLectures} of {course.totalLectures} lectures completed
                  </p>

                  <button
                    className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl text-sm transition-all"
                    onClick={() => navigate(`/viewlecture/${course._id}`)}
                  >
                    {course.percentage > 0 ? 'Continue Learning' : 'Start Learning'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
