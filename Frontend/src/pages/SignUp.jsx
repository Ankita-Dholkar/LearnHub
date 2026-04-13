import React, { useState } from 'react'
import logo from '../assets/logo.png'
import google from "../assets/google.jpg"
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { IoEye } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners'
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { signInWithPopup } from "firebase/auth"
import { auth, provider } from "../utils/firebase"


const SignUp = () => {
  const [show, setshow] = useState(false);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()

  const handleSignup = async () => {
    setLoading(true)
    try {
      const result = await axios.post(serverUrl + "/api/auth/signup", { name, password, email, role },
        { withCredentials: true }) //by doing withcredentials token gets stored in cookies
      dispatch(setUserData(result.data))
      setLoading(false);
      navigate("/")
      toast.success("Signup successfully")

    } catch (error) {
      console.log(error.response.data);
      setLoading(false);
      toast.error(error.response.data.message)

    }
  }

  const googleSignUp = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      console.log(response);
      let user = response.user;
      let name =  user.displayName;
      let email = user.email;

      const result = await axios.post(serverUrl + "/api/auth/googlesignup",{name,email,role},{withCredentials:true})
      dispatch(setUserData(result.data))
      navigate("/")
      toast.success("Signup successfully")
      
    } catch (error) {
      console.log( error);
      toast.error(error.response.data.message)
    }
  }

  return (
    <div className='relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-blue-50/50 to-white'>
      <div className='absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/30 blur-[120px] rounded-full' />
      <div className='absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-sky-200/30 blur-[120px] rounded-full' />
      
      <div className='relative z-10 w-full max-w-4xl px-4 flex items-center justify-center mt-6 mb-6'>
        <form className='w-full min-h-[600px] bg-white shadow-2xl shadow-blue-100/50 rounded-3xl flex overflow-hidden border border-white/50 backdrop-blur-sm' onSubmit={(e) => e.preventDefault()}>
          {/* left div */}
          <div className='md:w-[50%] w-[100%] h-auto py-8 px-6 sm:px-12 flex flex-col items-center justify-center gap-4'>
            <div className='text-center mb-1'>
              <h1 className='font-bold text-gray-900 text-3xl tracking-tight'>Let's get started</h1>
              <h2 className='text-gray-500 mt-2 text-[16px]'>Create your account</h2>
            </div>
            
            <div className='flex flex-col gap-1 w-full relative'>
              <label htmlFor="name" className='font-semibold text-gray-700 ml-1'>Name</label>
              <input id='name' type="text" className='border w-full h-[45px] rounded-xl border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all px-[20px] text-gray-800' placeholder='Your name' onChange={(e) => setName(e.target.value)} value={name} />
            </div>

            <div className='flex flex-col gap-1 w-full relative'>
              <label htmlFor="email" className='font-semibold text-gray-700 ml-1'>Your Email</label>
              <input id='email' type="email" className='border w-full h-[45px] rounded-xl border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all px-[20px] text-gray-800' placeholder='Your Email' onChange={(e) => setEmail(e.target.value)} value={email} />
            </div>

            <div className='flex flex-col gap-1 w-full relative'>
              <label htmlFor="password" className='font-semibold text-gray-700 ml-1'>Your Password</label>
              <input id='password' type={show ? "text" : "password"} className='border w-full h-[45px] rounded-xl border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all px-[20px] pr-10 text-gray-800' placeholder='••••••••••' onChange={(e) => setPassword(e.target.value)} value={password} />
              {!show ? <MdOutlineRemoveRedEye className='absolute w-[20px] h-[20px] cursor-pointer right-4 bottom-[12px] text-gray-400 hover:text-blue-500 transition-colors' onClick={() => setshow(prev => !prev)} /> :
                <IoEye className='absolute w-[20px] h-[20px] cursor-pointer right-4 bottom-[12px] text-blue-500 hover:text-gray-400 transition-colors' onClick={() => setshow(prev => !prev)} />}
            </div>

            <div className='flex w-full items-center justify-center gap-4 mt-1'>
              <div 
                className={`flex-1 text-center px-4 py-2 border rounded-xl cursor-pointer transition-all font-medium ${role === "student" ? "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-100" : "border-gray-200 text-gray-500 hover:border-blue-300 hover:bg-gray-50"}`} 
                onClick={() => setRole("student")}
              >
                Student
              </div>
              <div 
                className={`flex-1 text-center px-4 py-2 border rounded-xl cursor-pointer transition-all font-medium ${role === "educator" ? "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-100" : "border-gray-200 text-gray-500 hover:border-blue-300 hover:bg-gray-50"}`} 
                onClick={() => setRole("educator")}
              >
                Educator
              </div>
            </div>
            
            <button className='w-full h-[45px] bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg shadow-blue-200 cursor-pointer flex items-center justify-center rounded-xl mt-2' onClick={handleSignup} disabled={loading}>
              {loading ? <ClipLoader size={24} color='white' /> : "Sign Up"}
            </button>
            
            <div className='w-full flex items-center gap-3 my-1'>
              <div className='flex-1 h-[1px] bg-gray-200'></div>
              <div className='text-[14px] text-gray-400 font-medium'>Or continue with</div>
              <div className='flex-1 h-[1px] bg-gray-200'></div>
            </div>
            
            <button className='w-full h-[45px] border border-gray-200 hover:border-blue-200 hover:bg-blue-50/50 rounded-xl flex items-center justify-center gap-3 transition-all' onClick={googleSignUp}>
              <img src={google} className='w-[20px] rounded-full' alt="Google" />
              <span className='text-[15px] font-medium text-gray-700'>Google</span>
            </button>
            
            <div className='text-gray-500 text-[14px] mt-1'>
              Already have an account? 
              <span className='font-semibold text-blue-600 hover:underline cursor-pointer ml-1' onClick={() => navigate("/login")}>Login</span>
            </div>
          </div>
          
          {/* right div */}
          <div className='w-[50%] bg-gradient-to-br from-blue-600 to-sky-600 md:flex items-center justify-center flex-col hidden p-8 relative overflow-hidden'>
            <div className='absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-white/10 blur-[80px] rounded-full'></div>
            <div className='absolute bottom-[-20%] left-[-20%] w-[60%] h-[60%] bg-white/10 blur-[80px] rounded-full'></div>
            
            <img src={logo} alt="LearnHub Logo" className='w-40 drop-shadow-2xl mb-8 relative z-10' />
            <span className='text-white text-5xl font-black tracking-tighter relative z-10'>LearnHub</span>
            <p className='text-blue-100 mt-6 text-center max-w-sm text-lg leading-relaxed relative z-10 font-medium'>
                Begin your learning journey and connect with expert educators.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignUp