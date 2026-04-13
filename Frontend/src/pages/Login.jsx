import React, { useState } from 'react'
import logo from '../assets/logo.png'
import google from '../assets/google.jpg'
import axios from 'axios'
import { serverUrl } from '../App'
import { MdOutlineRemoveRedEye } from "react-icons/md";

import { MdRemoveRedEye } from "react-icons/md";
import { useNavigate } from 'react-router-dom'
import { signInWithPopup } from 'firebase/auth'
import { toast } from 'react-toastify'
import { ClipLoader } from 'react-spinners'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'
import { auth, provider } from '../utils/firebase'

function Login() {
    const [email,setEmail]= useState("")
    const [password,setPassword]= useState("")
    const navigate = useNavigate()
    let [show,setShow] = useState(false)
     const [loading,setLoading]= useState(false)
     let dispatch = useDispatch()
    const handleLogin = async () => {
        setLoading(true)
        try {
            const result = await axios.post(serverUrl + "/api/auth/login" , {email , password} ,{withCredentials:true})
            dispatch(setUserData(result.data))
            navigate("/")
            setLoading(false)
            toast.success("Login Successfully")
        } catch (error) {
            console.log(error)
            setLoading(false)
            toast.error(error.response.data.message)
        }
        
    }
     const googleLogin = async () => {
            try {
                const response = await signInWithPopup(auth,provider)
                
                let user = response.user
                let name = user.displayName;
                let email=user.email
                let role=""
                
                
                const result = await axios.post(serverUrl + "/api/auth/googlesignup" , {name , email , role}
                    , {withCredentials:true}
                )
                dispatch(setUserData(result.data))
                navigate("/")
                toast.success("Login Successfully")
            } catch (error) {
                console.log(error)
                toast.error(error.response.data.message)
            }
            
        }
  return (
    <div className='relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-blue-50/50 to-white'>
        <div className='absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/30 blur-[120px] rounded-full' />
        <div className='absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-sky-200/30 blur-[120px] rounded-full' />
        
        <div className='relative z-10 w-full max-w-4xl px-4 flex items-center justify-center'>
            <form className='w-full min-h-[600px] bg-white shadow-2xl shadow-blue-100/50 rounded-3xl flex overflow-hidden border border-white/50 backdrop-blur-sm' onSubmit={(e)=>e.preventDefault()}>
                <div className='md:w-[50%] w-[100%] h-auto py-10 px-6 sm:px-12 flex flex-col items-center justify-center gap-5'>
                    <div className='text-center mb-2'>
                        <h1 className='font-bold text-gray-900 text-3xl tracking-tight'>Welcome back</h1>
                        <h2 className='text-gray-500 mt-2 text-[16px]'>Login to your account</h2>
                    </div>
                     <div className='flex flex-col gap-1 w-full relative'>
                        <label htmlFor="email" className='font-semibold text-gray-700 ml-1'>
                            Email
                        </label>
                        <input id='email' type="email" className='border w-full h-[45px] rounded-xl border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all px-[20px] text-gray-800' placeholder='Your email' onChange={(e)=>setEmail(e.target.value)} value={email} />
                    </div>
                     <div className='flex flex-col gap-1 w-full relative'>
                        <label htmlFor="password" className='font-semibold text-gray-700 ml-1'>
                            Password
                        </label>
                        <input id='password' type={show?"text":"password"} className='border w-full h-[45px] rounded-xl border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all px-[20px] pr-10 text-gray-800' placeholder='••••••••••' onChange={(e)=>setPassword(e.target.value)} value={password} />
                        {!show && <MdOutlineRemoveRedEye className='absolute w-[20px] h-[20px] cursor-pointer right-4 bottom-[12px] text-gray-400 hover:text-blue-500 transition-colors' onClick={()=>setShow(prev => !prev)}/>}
                        {show && <MdRemoveRedEye className='absolute w-[20px] h-[20px] cursor-pointer right-4 bottom-[12px] text-blue-500 hover:text-gray-400 transition-colors' onClick={()=>setShow(prev => !prev)} />}
                    </div>
                     
                    <button className='w-full h-[45px] bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg shadow-blue-200 cursor-pointer flex items-center justify-center rounded-xl mt-2' disabled={loading} onClick={handleLogin}>{loading?<ClipLoader size={24} color='white' /> : "Login"}</button>
                    
                    <span className='text-[13px] hover:text-blue-600 transition-colors cursor-pointer text-gray-500 mt-[-5px]' onClick={()=>navigate("/forgotpassword")}>Forgot your password?</span>
    
                    <div className='w-full flex items-center gap-3 my-2'>
                        <div className='flex-1 h-[1px] bg-gray-200'></div>
                        <div className='text-[14px] text-gray-400 font-medium'>Or continue with</div>
                        <div className='flex-1 h-[1px] bg-gray-200'></div>
                    </div>
                
                    <button className='w-full h-[45px] border border-gray-200 hover:border-blue-200 hover:bg-blue-50/50 rounded-xl flex items-center justify-center gap-3 transition-all' onClick={googleLogin} >
                        <img src={google} alt="Google" className='w-[20px] rounded-full' />
                        <span className='text-[15px] font-medium text-gray-700'>Google</span> 
                    </button>
                     
                    <div className='text-gray-500 text-[14px] mt-2'>
                        Don't have an account? <span className='font-semibold text-blue-600 hover:underline cursor-pointer ml-1' onClick={()=>navigate("/signup")}>Sign up</span>
                    </div>
                </div>
                
                <div className='w-[50%] bg-gradient-to-br from-blue-600 to-sky-600 md:flex items-center justify-center flex-col hidden p-8 relative overflow-hidden'>
                    <div className='absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-white/10 blur-[80px] rounded-full'></div>
                    <div className='absolute bottom-[-20%] left-[-20%] w-[60%] h-[60%] bg-white/10 blur-[80px] rounded-full'></div>
                    
                    <img src={logo} className='w-40 drop-shadow-2xl mb-8 relative z-10' alt="LearnHub Logo" />
                    <span className='text-white text-5xl font-black tracking-tighter relative z-10'>LearnHub</span>
                    <p className='text-blue-100 mt-6 text-center max-w-sm text-lg leading-relaxed relative z-10 font-medium'>
                        Join our community of learners and unleash your potential today.
                    </p>
                </div>
            </form>
        </div>
    </div>
  )
}

export default Login
