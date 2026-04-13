import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeftLong } from "react-icons/fa6";

const Profile = () => {

  let {userData} = useSelector(state=>state.user)
  let navigate = useNavigate()
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-blue-50/50 to-white px-4 py-10">
      <div className='absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/30 blur-[120px] rounded-full pointer-events-none' />
      <div className='absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-sky-200/30 blur-[120px] rounded-full pointer-events-none' />
      
      <div className="relative z-10 bg-white shadow-2xl shadow-blue-100/50 rounded-3xl p-8 max-w-xl w-full border border-white/50 backdrop-blur-sm">
        <FaArrowLeftLong  className='absolute top-8 left-8 w-[20px] h-[20px] cursor-pointer text-gray-700 hover:text-blue-600 transition-colors' onClick={()=>navigate("/")}/>
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center">
          {userData.photoUrl ? <img
            src={userData?.photoUrl}
            alt=""
            className="w-28 h-28 rounded-full border-4 border-white shadow-lg shadow-blue-100 object-cover"
          /> : <div className='w-28 h-28 rounded-full text-blue-600 bg-blue-50 flex items-center justify-center text-[30px] font-bold border-4 border-white shadow-lg shadow-blue-100 cursor-pointer'>
         {userData?.name?.slice(0,1).toUpperCase()}
          </div>}
          <h2 className="text-2xl font-bold mt-4 text-gray-800">{userData.name}</h2>
          <p className="text-sm text-gray-500">{userData.role}</p>
        </div>

        {/* Profile Info */}
        <div className="mt-6 space-y-4">
          <div className="text-sm">
            <span className="font-semibold text-gray-700">Email: </span>
            <span>{userData.email}</span>
          </div>

          <div className="text-sm">
            <span className="font-semibold text-gray-700">Bio: </span>
            <span>{userData.description}</span>
          </div>

          

          <div className="text-sm">
            <span className="font-semibold text-gray-700">Enrolled Courses: </span>
            <span>{userData?.enrolledCourses?.length}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-center gap-4">
          <button className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer transition-all shadow-lg shadow-blue-200" onClick={()=>navigate("/editprofile")}>
            Edit Profile
          </button>
          
        </div>
      </div>
    </div>
  )
}

export default Profile