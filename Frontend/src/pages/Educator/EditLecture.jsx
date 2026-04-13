import axios from 'axios'
import React, { useState } from 'react'
import { FaArrowLeft } from "react-icons/fa"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { serverUrl } from '../../App'
import { setLectureData } from '../../redux/lectureSlice'
import { toast } from 'react-toastify'
import { ClipLoader } from 'react-spinners'

function EditLecture() {
  const [loading, setLoading] = useState(false)
  const [loading1, setLoading1] = useState(false)
  const { courseId, lectureId } = useParams()
  const { lectureData } = useSelector(state => state.lecture)
  const dispatch = useDispatch()
  const selectedLecture = lectureData?.find(lecture => lecture._id === lectureId)
  const [videoUrl, setVideoUrl] = useState(null)
  const [lectureTitle, setLectureTitle] = useState(selectedLecture?.lectureTitle)
  const [isPreviewFree, setIsPreviewFree] = useState(selectedLecture?.isPreviewFree || false)
  const [transcript, setTranscript] = useState(selectedLecture?.transcript || "")

  const formData = new FormData()
  formData.append("lectureTitle", lectureTitle)
  if (videoUrl) formData.append("videoUrl", videoUrl)
  formData.append("isPreviewFree", isPreviewFree)
  formData.append("transcript", transcript)


  const editLecture = async () => {
    setLoading(true)
    try {
      const result = await axios.post(serverUrl + `/api/course/editlecture/${lectureId}`, formData, { withCredentials: true })
      console.log(result.data)
      dispatch(setLectureData([...lectureData, result.data]))
      toast.success("Lecture Updated")
      navigate("/courses")
      setLoading(false)
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
      setLoading(false)
    }
  }

  const removeLecture = async () => {
    setLoading1(true)
    try {
      const result = await axios.delete(serverUrl + `/api/course/removelecture/${lectureId}`, { withCredentials: true })
      console.log(result.data)
      toast.success("Lecture Removed")
      navigate(`/createlecture/${courseId}`)
      setLoading1(false)
    } catch (error) {
      console.log(error)
      toast.error("Lecture remove error")
      setLoading1(false)
    }

  }


  const navigate = useNavigate()
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10 overflow-hidden">
      
      <div className="relative z-10 bg-white shadow-sm rounded-3xl p-8 md:p-10 max-w-3xl w-full border border-gray-100 space-y-8">

        <div className="flex items-center justify-between border-b border-gray-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 cursor-pointer transition-all" onClick={() => navigate(`/createlecture/${courseId}`)}>
              <FaArrowLeft className="w-5 h-5 text-gray-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Update Lecture</h2>
          </div>
          <button className="px-5 py-2.5 min-w-[150px] flex items-center justify-center bg-red-50 text-red-600 font-semibold rounded-xl border border-red-100 hover:bg-red-100 transition-all text-sm" disabled={loading1} onClick={removeLecture}>
            {loading1 ? <ClipLoader size={20} color='#dc2626' /> : "Remove Lecture"}
          </button>
        </div>

        {/* Input Fields */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Lecture Title</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-gray-300 focus:ring-4 focus:ring-gray-100 transition-all text-gray-900"
              placeholder={selectedLecture.lectureTitle}
              onChange={(e) => setLectureTitle(e.target.value)}
              value={lectureTitle}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Transcript / Notes</label>
            <textarea
              className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl resize-none focus:outline-none focus:bg-white focus:border-gray-300 focus:ring-4 focus:ring-gray-100 transition-all text-gray-900 h-32"
              placeholder="Enter lecture transcript or detailed notes here..."
              onChange={(e) => setTranscript(e.target.value)}
              value={transcript}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Video Resource <span className="text-red-500">*</span></label>
            <div className="flex border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <input
                type="file"
                required
                accept='video/*'
                className="w-full p-2 bg-gray-50 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 transition-all text-sm text-gray-500 cursor-pointer"
                onChange={(e) => setVideoUrl(e.target.files[0])}
              />
            </div>
          </div>

          {/* Toggle */}
          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <input
              type="checkbox"
              className="w-5 h-5 accent-gray-900 cursor-pointer rounded"
              onChange={() => setIsPreviewFree(prev => !prev)}
              checked={isPreviewFree}
            />
            <label htmlFor="isFree" className="text-sm font-semibold text-gray-800 cursor-pointer" onClick={() => setIsPreviewFree(prev => !prev)}>Mark this video as FREE preview</label>
          </div>
        </div>
        
        <div>
          {loading ? <p className="text-sm text-gray-500 font-medium">Uploading video... Please wait.</p> : ""}
        </div>
        
        {/* Submit Button */}
        <div className="pt-4 border-t border-gray-100 mt-6 flex justify-end">
          <button className="px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold transition-all shadow-sm cursor-pointer flex items-center justify-center rounded-xl min-w-[160px]" disabled={loading} onClick={editLecture}>
            {loading ? <ClipLoader size={20} color='white' /> : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditLecture
