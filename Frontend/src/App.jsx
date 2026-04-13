import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import Profile from './pages/Profile'
import ForgetPassword from './pages/ForgetPassword'
import './App.css'
import { ToastContainer } from "react-toastify"
import getCurrentUser from './customHooks/getCurrentUser'
import { useSelector } from 'react-redux'
import EditProfile from './pages/EditProfile'
import Dashboard from './pages/Educator/Dashboard'
import Courses from './pages/Educator/Courses'
import CreateCourse from './pages/Educator/CreateCourses'
import getCreatorCourseData from './customHooks/getCreatorCourseData'
import AddCourses from './pages/Educator/AddCourse'
import getCourseData from './customHooks/getCourseData'
import AllCourses from './pages/AllCourses'
import CreateLecture from './pages/Educator/CreateLecture'
import EditLecture from './pages/Educator/EditLecture'
import ViewCourse from './pages/ViewCourse'
import ViewLecture from './pages/ViewLecture'
import EnrolledCourse from './pages/EnrolledCourse'
import getAllReviews from './customHooks/getAllReviews'
import SearchWithAi from './pages/SearchWithAi'
import ForgotPassword from './pages/ForgetPassword'
import CourseQuiz from './pages/CourseQuiz'
import StudentDashboard from './pages/StudentDashboard'


export const serverUrl = "http://localhost:8000"

function App() {
  getCurrentUser()
  getCreatorCourseData()
  getCourseData()
  getAllReviews()
  const { userData } = useSelector(state => state.user)
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={!userData ? <SignUp /> : <Navigate to={"/"} />} />
        <Route path='/login' element={<Login />} />
        <Route path='/profile' element={userData ? <Profile /> : <Navigate to={"/signup"} />} />
        <Route path='/forget' element={userData ? <ForgetPassword /> : <Navigate to={"/signup"} />} />
        <Route path='/editprofile' element={userData ? <EditProfile /> : <Navigate to={"/signup"} />} />
        {/* <Route path='/enrolledcourses' element={userData?<EnrolledCourse/>:<Navigate to={"/signup"}/>}/> */}
        <Route path='/dashboard' element={userData?.role === 'educator' ? <Dashboard /> : <Navigate to={"/signup"} />} />
        <Route path='/courses' element={userData?.role === 'educator' ? <Courses /> : <Navigate to={"/signup"} />} />
        <Route path='/createcourses' element={userData?.role === 'educator' ? <CreateCourse /> : <Navigate to={"/signup"} />} />
        <Route path='/addcourses/:courseId' element={userData?.role === "educator" ? <AddCourses /> : <Navigate to={"/signup"} />} />
        <Route path='/allcourses' element={<AllCourses />} />
        <Route path='/createlecture/:courseId' element={userData ? <CreateLecture /> : <Navigate to={"/login"} />} />
        <Route path='/editlecture/:courseId/:lectureId' element={userData ? <EditLecture /> : <Navigate to={"/login"} />} />
        <Route path='/viewcourse/:courseId' element={<ViewCourse />} />
        <Route path='/viewlecture/:courseId' element={userData ? <ViewLecture /> : <Navigate to={"/login"} />} />
         <Route path='/enrolledcourses' element={userData?<EnrolledCourse/>:<Navigate to={"/login"}/>}/>
         <Route path='/searchwithai' element={<SearchWithAi/>}/>
         <Route path='/course/:courseId/quiz' element={userData?<CourseQuiz/>:<Navigate to={"/login"}/>}/>
         <Route path='/student-dashboard' element={userData?<StudentDashboard/>:<Navigate to={"/login"}/>}/>
         <Route path='/forgotpassword' element={<ForgotPassword/>}/>
      </Routes>
    </>
  )
}

export default App
