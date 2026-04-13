import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { FaPlayCircle, FaCheckCircle } from 'react-icons/fa';
import { FaArrowLeftLong } from "react-icons/fa6";
import axios from 'axios';
import { serverUrl } from '../App';

function ViewLecture() {
  const { courseId } = useParams();
  const { courseData } = useSelector((state) => state.course);
  const { userData } = useSelector((state) => state.user)
  const selectedCourse = courseData?.find((course) => course._id === courseId);

  const [selectedLecture, setSelectedLecture] = useState(selectedCourse?.lectures?.[0] || null);
  const [completedLectures, setCompletedLectures] = useState([]);
  const navigate = useNavigate()
  const courseCreator = userData?._id === selectedCourse?.creator ? userData : null;

  const markLectureAsCompleted = async (lectureId) => {
    try {
      if (courseId && lectureId) {
        await axios.post(`${serverUrl}/api/course/progress/mark-lecture`, { courseId, lectureId }, { withCredentials: true });
        setCompletedLectures((prev) => prev.includes(lectureId) ? prev : [...prev, lectureId]);
      }
    } catch (error) {
      console.log('Error marking lecture as complete:', error);
    }
  };

  const handleSelectLecture = (lecture) => {
    setSelectedLecture(lecture);
    markLectureAsCompleted(lecture._id);
  };

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/course/progress/${courseId}`, { withCredentials: true });
        if (response.data.progress) setCompletedLectures(response.data.progress.completedLectures);
      } catch (error) { console.log('Error fetching progress:', error); }
    };
    fetchProgress();
  }, [courseId]);

  useEffect(() => {
    if (selectedLecture?._id) markLectureAsCompleted(selectedLecture._id);
    // eslint-disable-next-line
  }, [selectedLecture?._id]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 flex flex-col md:flex-row gap-5">

      {/* Left - Video & Course Info */}
      <div className="w-full md:w-2/3 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="mb-5">
          <h1 className="text-xl font-bold flex items-center gap-4 text-gray-900">
            <FaArrowLeftLong className='text-gray-400 hover:text-gray-700 transition-colors w-5 h-5 cursor-pointer flex-shrink-0' onClick={() => navigate("/")} />
            {selectedCourse?.title}
          </h1>
          <div className="mt-2 flex gap-4 text-sm text-gray-400 font-medium">
            <span>Category: {selectedCourse?.category}</span>
            <span>Level: {selectedCourse?.level}</span>
          </div>
        </div>

        {/* Video Player */}
        <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden mb-4">
          {selectedLecture?.videoUrl ? (
            <video src={selectedLecture.videoUrl} controls className="w-full h-full object-cover" crossOrigin="anonymous" />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">Select a lecture to start watching</div>
          )}
        </div>

        {/* Lecture Info */}
        <div className="mt-4">
          <h2 className="text-lg font-bold text-gray-900 mb-2">{selectedLecture?.lectureTitle}</h2>
          {selectedLecture?.transcript && (
            <div className="mt-5 bg-gray-50 p-5 rounded-xl border border-gray-100">
              <h3 className="text-base font-bold text-gray-700 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                Lecture Notes & Transcript
              </h3>
              <div className="text-gray-600 leading-relaxed whitespace-pre-wrap text-sm">{selectedLecture.transcript}</div>
            </div>
          )}
        </div>
      </div>

      {/* Right - Lecture List */}
      <div className="w-full md:w-1/3 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 h-fit">
        <h2 className="text-base font-bold mb-4 text-gray-800">Course Lectures</h2>
        <div className="flex flex-col gap-2 mb-5">
          {selectedCourse?.lectures?.length > 0 ? (
            selectedCourse.lectures.map((lecture, index) => (
              <button
                key={index}
                onClick={() => handleSelectLecture(lecture)}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                  selectedLecture?._id === lecture._id
                    ? 'bg-gray-900 border-gray-900 text-white'
                    : 'hover:bg-gray-50 border-gray-100 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FaPlayCircle className={selectedLecture?._id === lecture._id ? "text-white text-sm flex-shrink-0" : "text-gray-300 text-sm flex-shrink-0"} />
                  <h4 className="text-sm font-medium line-clamp-1">{lecture.lectureTitle}</h4>
                </div>
                {completedLectures.includes(lecture._id) && (
                  <FaCheckCircle className="text-green-500 text-sm flex-shrink-0 ml-2" />
                )}
              </button>
            ))
          ) : (
            <p className="text-gray-400 text-sm">No lectures available.</p>
          )}
        </div>

        {/* AI Quiz Button */}
        <button
          onClick={() => navigate(`/course/${courseId}/quiz`)}
          className="w-full mb-5 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          Take Final Quiz
        </button>

        {/* Creator Info */}
        {courseCreator && (
          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">Instructor</h3>
            <div className="flex items-center gap-3">
              <img src={courseCreator.photoUrl || '/default-avatar.png'} alt="Instructor" className="w-12 h-12 rounded-full object-cover border border-gray-100" />
              <div>
                <h4 className="text-sm font-semibold text-gray-800">{courseCreator.name}</h4>
                <p className="text-xs text-gray-400">{courseCreator.description || 'No bio available.'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewLecture;
