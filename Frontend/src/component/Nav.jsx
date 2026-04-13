import React, { useState } from 'react'
import logo from "../assets/logo.png"
import { IoMdPerson } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import { GiSplitCross } from "react-icons/gi";

import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../redux/userSlice';
function Nav() {
  let [showHam,setShowHam] = useState(false)
  let [showPro,setShowPro] = useState(false)
  let navigate = useNavigate()
  let dispatch = useDispatch()
  let {userData} = useSelector(state=>state.user)

  const handleLogout = async () => {
    try {
      const result = await axios.get(serverUrl + "/api/auth/logout" , {withCredentials:true})
      console.log(result.data)
     await dispatch(setUserData(null))
      toast.success("LogOut Successfully")
    } catch (error) {
      console.log(error.response.data.message)
    }
  }
  return (
    <div>
    <nav className='w-full h-20 fixed top-0 px-6 md:px-12 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-gray-100 z-50 transition-all duration-300'>
      <div className='flex items-center gap-2 cursor-pointer' onClick={() => navigate("/")}>
        <img src={logo} className='w-11 h-11 rounded-xl shadow-sm' alt="LMS Logo" />
        <span className='text-gray-900 font-bold text-2xl tracking-tight hidden sm:block'>LearnHub</span>
      </div>
      
      <div className='hidden lg:flex items-center gap-8'>
        <span className='text-gray-600 hover:text-blue-600 cursor-pointer transition-colors font-medium' onClick={() => navigate("/allcourses")}>Courses</span>
        {userData?.role === "educator" && (
          <span className='text-gray-600 hover:text-blue-600 cursor-pointer transition-colors font-medium' onClick={() => navigate("/dashboard")}>Dashboard</span>
        )}
        
        <div className='flex items-center gap-4 border-l border-gray-100 pl-8'>
          {!userData ? (
            <>
              <span className='text-gray-600 hover:text-blue-600 cursor-pointer transition-colors font-medium' onClick={() => navigate("/login")}>Login</span>
              <button 
                className='px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-all shadow-md shadow-blue-100'
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </button>
            </>
          ) : (
            <div className='relative flex items-center gap-4'>
              <div 
                className='w-10 h-10 rounded-full border-2 border-gray-100 overflow-hidden cursor-pointer hover:border-blue-400 transition-all shadow-sm'
                onClick={() => setShowPro(!showPro)}
              >
                {userData.photoUrl ? (
                  <img src={userData.photoUrl} className='w-full h-full object-cover' alt="User Profile" />
                ) : (
                  <div className='w-full h-full bg-gradient-to-br from-blue-500 to-sky-600 flex items-center justify-center text-white font-bold'>
                    {userData?.name?.slice(0,1).toUpperCase()}
                  </div>
                )}
              </div>
              
              <button 
                className='px-5 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-full text-sm font-semibold transition-all'
                onClick={handleLogout}
              >
                Log Out
              </button>

              {showPro && (
                <div className='absolute top-full mt-4 right-0 w-48 bg-white rounded-2xl p-2 shadow-2xl border border-gray-100 flex flex-col gap-1 z-[60] animate-in fade-in slide-in-from-top-2 duration-200'>
                  <span className='px-4 py-3 hover:bg-gray-50 rounded-xl transition-all cursor-pointer text-gray-800 font-medium' onClick={() => {navigate("/profile"); setShowPro(false);}}>My Profile</span>
                  <span className='px-4 py-3 hover:bg-gray-50 rounded-xl transition-all cursor-pointer text-gray-800 font-medium' onClick={() => {navigate("/enrolledcourses"); setShowPro(false);}}>My Courses</span>
                  <span className='px-4 py-3 hover:bg-gray-50 rounded-xl transition-all cursor-pointer text-gray-800 font-medium' onClick={() => {navigate("/student-dashboard"); setShowPro(false);}}>Student Dashboard</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <button className='lg:hidden text-gray-700 p-2 hover:bg-gray-100 rounded-xl transition-all' onClick={() => setShowHam(!showHam)}>
        <GiHamburgerMenu size={28} />
      </button>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-white flex flex-col items-center justify-center gap-8 z-[100] transition-transform duration-500 ease-out ${showHam ? "translate-x-0" : "translate-x-full"}`}>
        <button className='absolute top-8 right-8 text-gray-700 p-2 hover:bg-gray-100 rounded-xl' onClick={() => setShowHam(false)}>
          <GiSplitCross size={32} />
        </button>
        
        <nav className='flex flex-col items-center gap-6'>
          <span className='text-3xl text-gray-900 font-bold mb-4 cursor-pointer' onClick={() => {navigate("/"); setShowHam(false);}}>Home</span>
          <span className='text-2xl text-gray-600 hover:text-blue-600 transition-colors cursor-pointer' onClick={() => {navigate("/allcourses"); setShowHam(false);}}>Courses</span>
          <span className='text-2xl text-gray-600 hover:text-blue-600 transition-colors cursor-pointer' onClick={() => {navigate("/profile"); setShowHam(false);}}>My Profile</span>
          <span className='text-2xl text-gray-600 hover:text-blue-600 transition-colors cursor-pointer' onClick={() => {navigate("/enrolledcourses"); setShowHam(false);}}>My Learning</span>
          <span className='text-2xl text-gray-600 hover:text-blue-600 transition-colors cursor-pointer' onClick={() => {navigate("/student-dashboard"); setShowHam(false);}}>Student Dashboard</span>
          
          {userData?.role === "educator" && (
            <span className='text-2xl text-gray-600 hover:text-blue-600 transition-colors cursor-pointer' onClick={() => {navigate("/dashboard"); setShowHam(false);}}>Educator Dashboard</span>
          )}
          
          <div className='mt-8 flex flex-col gap-4 w-64'>
            {!userData ? (
              <>
                <button className='w-full py-4 bg-blue-600 text-white font-bold rounded-2xl text-xl shadow-lg shadow-blue-100' onClick={() => {navigate("/login"); setShowHam(false);}}>Login</button>
                <button className='w-full py-4 border border-gray-200 text-gray-700 font-bold rounded-2xl text-xl' onClick={() => {navigate("/signup"); setShowHam(false);}}>Sign Up</button>
              </>
            ) : (
              <button className='w-full py-4 bg-red-50 text-red-600 font-bold rounded-2xl text-xl' onClick={() => {handleLogout(); setShowHam(false);}}>Log Out</button>
            )}
          </div>
        </nav>
      </div>
    </nav>
   </div>
      
  )
}

export default Nav