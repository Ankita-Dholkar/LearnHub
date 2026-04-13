import React, { useEffect, useRef, useState } from 'react'
import img from "../../assets/empty.jpg"
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate, useParams } from 'react-router-dom';
import { serverUrl } from '../../App';
import { MdEdit } from "react-icons/md";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { ClipLoader } from 'react-spinners';
import { setCourseData } from '../../redux/courseSlice';
function AddCourses() {
    const navigate= useNavigate()
    const {courseId} = useParams()
   
    
    const [selectedCourse,setSelectedCourse] = useState(null)
    const [title,setTitle] = useState("")
    const [subTitle,setSubTitle] = useState("")
    const [description,setDescription] = useState("")
    const [category,setCategory] = useState("")
    const [level,setLevel] = useState("")
    const [price,setPrice] = useState("")
    const [isPublished,setIsPublished] = useState(false)
   const thumb=useRef()
   const [frontendImage,setFrontendImage] = useState(null)
   const [backendImage,setBackendImage] = useState(null)
   let [loading,setLoading] = useState(false)
   const dispatch = useDispatch()
   const {courseData} = useSelector(state=>state.course)



    const getCourseById = async () => {
      try {
        const result = await axios.get(serverUrl + `/api/course/getcourse/${courseId}` , {withCredentials:true})
          setSelectedCourse(result.data)
          console.log(result)
        
      } catch (error) {
        console.log(error)
      }
      
    }
    useEffect(() => {
  if (selectedCourse) {
    setTitle(selectedCourse.title || "")
    setSubTitle(selectedCourse.subTitle || "")
    setDescription(selectedCourse.description || "")
    setCategory(selectedCourse.category || "")
    setLevel(selectedCourse.level || "")
    setPrice(selectedCourse.price || "")
    setFrontendImage(selectedCourse.thumbnail || img)
    setIsPublished(selectedCourse?.isPublished)


  }
}, [selectedCourse])

    useEffect(()=>{
      getCourseById()

    },[])
  const handleThumbnail = (e)=>{
    const file = e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }


const editCourseHandler = async () => {
  setLoading(true);
  const formData = new FormData();
  formData.append("title", title);
  formData.append("subTitle", subTitle);
  formData.append("description", description);
  formData.append("category", category);
  formData.append("level", level);
  formData.append("price", price);
  formData.append("thumbnail", backendImage);
  formData.append("isPublished", isPublished);

  try {
    const result = await axios.post(
      `${serverUrl}/api/course/editcourse/${courseId}`,
      formData,
      { withCredentials: true }
    );

    const updatedCourse = result.data;
    if (updatedCourse.isPublished) {
      const updatedCourses = courseData.map(c =>
        c._id === courseId ? updatedCourse : c
      );
      if (!courseData.some(c => c._id === courseId)) {
        updatedCourses.push(updatedCourse);
      }
      dispatch(setCourseData(updatedCourses));
    } else {
      const filteredCourses = courseData.filter(c => c._id !== courseId);
      dispatch(setCourseData(filteredCourses));
    }

    navigate("/courses");
    toast.success("Course Updated");
  } catch (error) {
    console.log(error);
    toast.error(error.response?.data?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};


  const removeCourse = async () => {
    setLoading(true)
    try {
      const result = await axios.delete(serverUrl + `/api/course/removecourse/${courseId}` , {withCredentials:true})
      toast.success("Course Deleted")
       const filteredCourses = courseData.filter(c => c._id !== courseId);
      dispatch(setCourseData(filteredCourses));
      console.log(result)
      navigate("/courses")
      setLoading(false)

    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
      setLoading(false)
    }
  }

    
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto p-8 bg-white rounded-3xl shadow-sm border border-gray-100">
        
      {/* Top Bar */}
      <div className="flex items-center justify-between flex-col md:flex-row mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 cursor-pointer transition-all" onClick={() => navigate("/courses")}>
            <FaArrowLeftLong className="w-5 h-5 text-gray-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Course Details</h2>
        </div>
        <div>
          <button className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-6 py-3 rounded-xl shadow-sm transition-all" onClick={() => navigate(`/createlecture/${selectedCourse?._id}`)}>
            Manage Lectures →
          </button>
        </div>
      </div>

      {/* Form Box */}
      <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Basic Information</h3>
            <p className="text-sm text-gray-500 mt-1">Update your course title, description, and settings.</p>
          </div>
          <div className="flex items-center gap-3">
            {!isPublished ? (
              <button className="bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 font-semibold px-5 py-2.5 rounded-xl transition-all" onClick={() => setIsPublished(prev => !prev)}>
                Publish Course
              </button>
            ) : (
               <button className="bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 font-semibold px-5 py-2.5 rounded-xl transition-all" onClick={() => setIsPublished(prev => !prev)}>
                 Unpublish 
               </button>
            )}
            <button className="bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 font-semibold px-5 py-2.5 rounded-xl transition-all flex items-center justify-center min-w-[140px]" disabled={loading} onClick={removeCourse}>
              {loading ? <ClipLoader size={20} color='#dc2626' /> : "Delete Course"}
            </button>
          </div>
        </div>

        <form className="space-y-6" onSubmit={(e)=>e.preventDefault()}>
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Course Title <span className="text-red-500">*</span></label>
            <input type="text" placeholder="e.g. Complete Web Development Bootcamp" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-gray-100 transition-all text-gray-900" onChange={(e)=>setTitle(e.target.value)} value={title}/>
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Subtitle</label>
            <input type="text" placeholder="A catchy quick summary of the course" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-gray-100 transition-all text-gray-900" onChange={(e)=>setSubTitle(e.target.value)} value={subTitle} />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea placeholder="Write a detailed course description..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-none focus:bg-white focus:ring-4 focus:ring-gray-100 transition-all text-gray-900 h-32" onChange={(e)=>setDescription(e.target.value)} value={description}></textarea>
          </div>

          {/* Category, Level, Price - Flex row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-gray-100 transition-all text-gray-900 cursor-pointer text-sm" onChange={(e)=>setCategory(e.target.value)} value={category}>
                <option value="">Select Category</option>
                 <option value="App Development">App Development</option>
                 <option value="AI/ML">AI/ML</option>
                 <option value="AI Tools">AI Tools</option>
                 <option value="Data Science">Data Science</option>
                 <option value="Data Analytics">Data Analytics</option>
                 <option value="Ethical Hacking">Ethical Hacking</option>
                 <option value="UI UX Designing">UI UX Designing</option>
                 <option value="Web Development">Web Development</option>
                 <option value="Others">Others</option>
              </select>
            </div>

            {/* Level */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Course Level</label>
              <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-gray-100 transition-all text-gray-900 cursor-pointer text-sm" onChange={(e)=>setLevel(e.target.value)} value={level} >
                <option value="">Select Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Price (INR)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₹</span>
                <input type="number" placeholder="0" className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-gray-100 transition-all text-gray-900 font-semibold" onChange={(e)=>setPrice(e.target.value)} value={price} />
              </div>
            </div>
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Course Thumbnail</label>
            <input type="file" ref={thumb} hidden className="w-full border px-4 py-2 rounded-md" onChange={handleThumbnail} accept='image/*' />
            <div className='relative w-full max-w-[340px] h-[190px] mt-2 group rounded-2xl overflow-hidden shadow-sm border border-gray-200'>
              <img src={frontendImage || img} alt="Thumbnail preview" className='w-full h-full object-cover transition-transform group-hover:scale-105 duration-500' onClick={()=>thumb.current.click()} />
              <div className='absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer' onClick={()=>thumb.current.click()}>
                 <div className="bg-white text-gray-900 p-2.5 rounded-full shadow-lg">
                   <MdEdit className='w-5 h-5' />
                 </div>
              </div>
            </div>
          </div>

          <div className='flex items-center justify-end gap-3 pt-6 border-t border-gray-100 mt-8'>
            <button className='px-6 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all' onClick={()=>navigate("/courses")}>Cancel</button>
            <button className='px-8 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-bold shadow-sm transition-all flex items-center justify-center min-w-[120px]' disabled={loading} onClick={editCourseHandler}>{loading ? <ClipLoader size={20} color='white'/>:"Save Changes"}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  )
}

export default AddCourses
