import React from 'react'
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { serverUrl } from '../App'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ClipLoader } from 'react-spinners';

const ForgetPassword = () => {
  const [step, setStep] = useState(1)
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [conPassword, setConPassword] = useState("")
  const [loading, setLoading] = useState(false)

  //for step1
  const sendOtp = async () => {
    setLoading(true)
    try {
      const result = await axios.post(serverUrl + "/api/auth/sendOtp", { email }, { withCredentials: true })
      console.log(result.data);
      setLoading(false)
      setStep(2)
      toast.success(result.data.message)

    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message)
      setLoading(false)
    }
  }


  //step 2
  const verifyOTP = async () => {
    setLoading(true)
    try {
      const result = await axios.post(serverUrl + "/api/auth/verifyotp", { email, otp }, { withCredentials: true })
      console.log(result.data);
      setLoading(false)
      setStep(3)
      toast.success(result.data.message)
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message)
      setLoading(false)
    }
  }

  //step 3
  const resetPassword = async () => {
    setLoading(true)
    try {
      if (newPassword !== conPassword) {
        return toast.error("Password is not matched")
      }
      const result = await axios.post(serverUrl + "/api/auth/resetpassword",
      { email, password: newPassword }, {withCredentials: true })
      console.log(result.data);
      setLoading(false)
      navigate("/login")
      toast.success(result.data.message)

    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message)
      setLoading(false)
    }
  }


  return (
    <div className='relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-blue-50/50 to-white px-4'>
      <div className='absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/30 blur-[120px] rounded-full pointer-events-none' />
      <div className='absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-sky-200/30 blur-[120px] rounded-full pointer-events-none' />
      
      {/* step 1 */}
      {step == 1 && <div className='relative z-10 bg-white shadow-2xl shadow-blue-100/50 rounded-3xl p-8 max-w-md w-full border border-white/50 backdrop-blur-sm'>
        <h2 className='text-2xl font-bold mb-6 text-center
        text-gray-800'>Forget Your Password</h2>
        <form className='space-y-4' onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="email" className='block
          text-sm font-medium text-gray-700'>Enter your email address</label>
            <input id='email' type="text" className='border w-full h-[45px] rounded-xl border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all px-[20px] text-gray-800 mt-1' placeholder='you@example.com' required
              onChange={(e) => setEmail(e.target.value)} value={email} />
          </div>
          <button className='w-full h-[45px] bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg shadow-blue-200 cursor-pointer flex items-center justify-center rounded-xl mt-4' disabled={loading} onClick={sendOtp}>{loading ? <ClipLoader size={24} color='white' /> : "Send OTP"}</button>
        </form>
        <div className='text-sm text-center mt-6 text-gray-500 hover:text-blue-600 cursor-pointer transition-colors' onClick={() => navigate("/login")}>Back to Login</div>

      </div>}

      {/* step 2 */}
      {step == 2 && <div className='relative z-10 bg-white shadow-2xl shadow-blue-100/50 rounded-3xl p-8 max-w-md w-full border border-white/50 backdrop-blur-sm'>
        <h2 className='text-2xl font-bold mb-6 text-center
        text-gray-800'>Enter OTP</h2>
        <form className='space-y-4' onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="otp" className='block
          text-sm font-medium text-gray-700'>Please enter the OTP</label>
            <input id='otp' type="text" className='border w-full h-[45px] rounded-xl border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all px-[20px] text-gray-800 mt-1' placeholder='' required
              onChange={(e) => setOtp(e.target.value)} value={otp} />
          </div>
          <button className='w-full h-[45px] bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg shadow-blue-200 cursor-pointer flex items-center justify-center rounded-xl mt-4' disabled={loading} onClick={verifyOTP}>{loading ? <ClipLoader size={24} color='white' /> : "Verify OTP"}</button>
        </form>
        <div className='text-sm text-center mt-6 text-gray-500 hover:text-blue-600 cursor-pointer transition-colors' onClick={() => navigate("/login")}>Back to Login</div>

      </div>}


      {/* step 3 */}
      {step == 3 && <div className='relative z-10 bg-white shadow-2xl shadow-blue-100/50 rounded-3xl p-8 max-w-md w-full border border-white/50 backdrop-blur-sm'>
        <h2 className='text-2xl font-bold mb-6 text-center
        text-gray-800'>Reset Password</h2>
        <p className='text-sm text-gray-500 text-center
        mb-6'>Enter a new password below to regain access to you account</p>
        <form className='space-y-4' onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="password" className='block
          text-sm font-medium text-gray-700'>New Password</label>
            <input id='password' type="text" className='border w-full h-[45px] rounded-xl border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all px-[20px] text-gray-800 mt-1' placeholder='**********' required
              onChange={(e) => setNewPassword(e.target.value)} value={newPassword} />
          </div>

          <div>
            <label htmlFor="confirmPassword" className='block
          text-sm font-medium text-gray-700'>Confirm Password</label>
            <input id='confirmPassword' type="text" className='border w-full h-[45px] rounded-xl border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all px-[20px] text-gray-800 mt-1' placeholder='**********' required
              onChange={(e) => setConPassword(e.target.value)} value={conPassword} />
          </div>
          <button className='w-full h-[45px] bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg shadow-blue-200 cursor-pointer flex items-center justify-center rounded-xl mt-4' disabled={loading} onClick={(e) => {resetPassword(e)}}>{loading? <ClipLoader size={24} color='white'/> : "Reset Password"}</button>
        </form>
        <div className='text-sm text-center mt-6 text-gray-500 hover:text-blue-600 cursor-pointer transition-colors' onClick={() => navigate("/login")}>Back to Login</div>

      </div>}

    </div>
  )
}

export default ForgetPassword