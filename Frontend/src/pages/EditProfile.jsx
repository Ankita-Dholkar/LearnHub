import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { serverUrl } from '../App'
import { setUserData } from '../redux/userSlice'
import { toast } from 'react-toastify'
import { ClipLoader } from 'react-spinners'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeftLong } from "react-icons/fa6";

const EditProfile = () => {
  const { userData } = useSelector(state => state.user)
  const [name, setName] = useState(userData?.name || "")
  const [description, setDescription] = useState(userData?.description || "")
  const [role, setRole] = useState(userData?.role || "student")
  const [photoUrl, setPhotoUrl] = useState(null)
  const [previewUrl, setPreviewUrl] = useState("")
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (userData) {
      if (userData.name) setName(userData.name)
      if (userData.description) setDescription(userData.description)
      if (userData.role) setRole(userData.role)
    }
  }, [userData])

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoUrl(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const updateProfile = async () => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("description", description)
      formData.append("role", role)
      if (photoUrl) {
        formData.append("photoUrl", photoUrl)
      }

      const result = await axios.post(serverUrl + "/api/user/updateprofile", formData, { withCredentials: true })
      dispatch(setUserData(result.data))
      toast.success("Profile Updated Successfully")
      navigate("/profile")
    } catch (error) {
      console.error("Profile update error:", error)
      toast.error(error?.response?.data?.message || error?.message || "Profile Update Error")
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50/50 to-white px-4 py-10 overflow-hidden">
      <div className='absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/30 blur-[120px] rounded-full pointer-events-none' />
      <div className='absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-sky-200/30 blur-[120px] rounded-full pointer-events-none' />

      <div className="relative z-10 bg-white shadow-2xl shadow-blue-100/50 rounded-3xl p-8 max-w-xl w-full border border-white/50 backdrop-blur-sm">
        <FaArrowLeftLong className='absolute top-8 left-8 w-[20px] h-[20px] cursor-pointer text-gray-700 hover:text-blue-600 transition-colors' onClick={() => navigate("/profile")} />
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Edit Profile</h2>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          {/* Profile Photo */}

          <div className="flex flex-col items-center text-center">
            {previewUrl || userData?.photoUrl ? (
              <img
                src={previewUrl || userData?.photoUrl}
                alt="Profile Avatar"
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg shadow-blue-100 object-cover"
              />
            ) : (
              <div className='w-24 h-24 rounded-full text-blue-600 bg-blue-50 flex items-center justify-center text-[30px] font-bold border-4 border-white shadow-lg shadow-blue-100 cursor-pointer'>
                {userData?.name?.slice(0, 1)?.toUpperCase() || "U"}
              </div>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Select Avatar</label>
            <input
              type="file"
              name="photoUrl"
              accept="image/*"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all cursor-pointer"
              onChange={handleFileChange}
            />
          </div>

          {/* Name */}
          <div>
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"

              className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all text-gray-800"
              placeholder={userData.name}
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              readOnly
              className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
              placeholder={userData?.email}
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className="text-sm font-medium text-gray-700">Account Role</label>
            <div className='flex w-full items-center justify-center gap-4 mt-2'>
              <div
                className={`flex-1 text-center px-4 py-2.5 border rounded-xl cursor-pointer transition-all font-medium text-sm ${role === "student" ? "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-100" : "border-gray-200 text-gray-500 hover:border-blue-300 hover:bg-gray-50"}`}
                onClick={() => setRole("student")}
              >
                Student
              </div>
              <div
                className={`flex-1 text-center px-4 py-2.5 border rounded-xl cursor-pointer transition-all font-medium text-sm ${role === "educator" ? "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-100" : "border-gray-200 text-gray-500 hover:border-blue-300 hover:bg-gray-50"}`}
                onClick={() => setRole("educator")}
              >
                Educator
              </div>
            </div>
          </div>



          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"

              className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all text-gray-800"
              rows={3}
              placeholder="Tell us about yourself"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full h-[45px] bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg shadow-blue-200 cursor-pointer flex items-center justify-center rounded-xl mt-6" disabled={loading} onClick={updateProfile}
          >
            {loading ? <ClipLoader size={24} color='white' /> : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditProfile