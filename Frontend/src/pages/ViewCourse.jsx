import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { serverUrl } from '../App';
import { FaArrowLeftLong } from "react-icons/fa6";
import img from "../assets/empty.jpg"
import { setSelectedCourseData } from '../redux/courseSlice';
import { FaLock, FaPlayCircle } from "react-icons/fa";
import { toast } from 'react-toastify';
import { FaStar } from "react-icons/fa6";
import Card from '../component/Card';


function ViewCourse() {

  const { courseId } = useParams();
  const navigate = useNavigate()
  const { courseData } = useSelector(state => state.course)
  const { userData } = useSelector(state => state.user)
  const { allReview } = useSelector(state => state.review)
  const [creatorData, setCreatorData] = useState(null)
  const dispatch = useDispatch()
  const [selectedLecture, setSelectedLecture] = useState(null);
  const { lectureData } = useSelector(state => state.lecture)
  const { selectedCourseData } = useSelector(state => state.course)
  const [selectedCreatorCourse, setSelectedCreatorCourse] = useState([])
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");



  const handleReview = async () => {
    try {
      const result = await axios.post(serverUrl + "/api/review/givereview", { rating, comment, courseId }, { withCredentials: true })
      toast.success("Review Added")
      console.log(result.data)
      setRating(0)
      setComment("")

    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }


  // Compute average rating from the populated allReview state (which has actual rating numbers)
  const courseReviews = allReview?.filter(r =>
    r.course?.toString() === courseId || r.course?._id?.toString() === courseId
  ) || [];

  const avgRating = courseReviews.length > 0
    ? (courseReviews.reduce((sum, r) => sum + r.rating, 0) / courseReviews.length).toFixed(1)
    : null;



  const fetchCourseData = async () => {
    courseData.map((item) => {
      if (item._id === courseId) {
        dispatch(setSelectedCourseData(item))
        console.log(selectedCourseData)


        return null;
      }

    })

  }
  const checkEnrollment = () => {
    const verify = userData?.enrolledCourses?.some(c => {
      const enrolledId = typeof c === 'string' ? c : c._id;
      return enrolledId?.toString() === courseId?.toString();
    });

    console.log("Enrollment verified:", verify);
    if (verify) {
      setIsEnrolled(true);
    }
  };
  useEffect(() => {
    fetchCourseData()
    checkEnrollment()
  }, [courseId, courseData, lectureData])


  // Fetch creator info once course data is available
  useEffect(() => {
    const getCreator = async () => {
      if (selectedCourseData?.creator) {
        try {
          const result = await axios.post(
            `${serverUrl}/api/course/getCreator`,
            { userId: selectedCourseData.creator },
            { withCredentials: true }
          );
          setCreatorData(result.data);
          console.log(result.data)
        } catch (error) {
          console.error("Error fetching creator:", error);
        }
      }
    };

    getCreator();


  }, [selectedCourseData]);





  useEffect(() => {
    if (creatorData?._id && courseData.length > 0) {
      const creatorCourses = courseData.filter(
        (course) =>
          course.creator === creatorData._id && course._id !== courseId // Exclude current course
      );
      setSelectedCreatorCourse(creatorCourses);

    }
  }, [creatorData, courseData]);


  const handleEnroll = async (courseId, userId) => {
    try {
      // 1. Create Order
      const orderData = await axios.post(serverUrl + "/api/payment/create-order", {
        courseId,
        userId
      }, { withCredentials: true });
      console.log(orderData)

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // from .env
        amount: orderData.data.amount,
        currency: "INR",
        name: "LearnHub",
        description: "Course Enrollment Payment",
        image: `${window.location.origin}/logo.png`,
        order_id: orderData.data.id,
        handler: async function (response) {
          console.log("Razorpay Response:", response);
          try {
            const verifyRes = await axios.post(serverUrl + "/api/payment/verify-payment", {
              ...response,
              courseId,
              userId
            }, { withCredentials: true });

            setIsEnrolled(true)
            toast.success(verifyRes.data.message);
          } catch (verifyError) {
            toast.error("Payment verification failed.");
            console.error("Verification Error:", verifyError);
          }
        },
      };

      const rzp = new window.Razorpay(options)
      rzp.open()

    } catch (err) {
      const errorMessage = err.response?.data?.message || "Something went wrong while enrolling.";
      toast.error(errorMessage);
      console.error("Enroll Error:", err);
    }
  };

  return (
    <div className='relative min-h-screen bg-gradient-to-b from-blue-50/50 to-white p-6 overflow-hidden'>
      <div className='absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/30 blur-[120px] rounded-full pointer-events-none' />
      <div className='absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-sky-200/30 blur-[120px] rounded-full pointer-events-none' />

      <div className="max-w-6xl mx-auto bg-white shadow-2xl shadow-blue-100/50 rounded-3xl border border-white/50 backdrop-blur-sm p-6 space-y-8 relative z-10">

        {/* Top Section */}
        <div className="flex flex-col md:flex-row gap-6 ">

          {/* Thumbnail */}
          <div className="w-full md:w-1/2 relative">
            <div className='absolute top-2 left-2 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-md z-10 cursor-pointer hover:bg-white transition-all'>
              <FaArrowLeftLong className='text-gray-700 hover:text-blue-600 w-[20px] h-[20px]' onClick={() => navigate("/")} />
            </div>
            {selectedCourseData?.thumbnail ? <img
              src={selectedCourseData?.thumbnail}
              alt="Course Thumbnail"
              className="rounded-xl w-full object-cover"
            /> : <img
              src={img}
              alt="Course Thumbnail"
              className="rounded-xl  w-full  object-cover"
            />}
          </div>

          {/* Course Info */}
          <div className="flex-1 space-y-2 mt-[20px]">
            <h1 className="text-2xl font-bold">{selectedCourseData?.title}</h1>
            <p className="text-gray-600">{selectedCourseData?.subTitle}</p>

            {/* Educator Badge */}
            {creatorData && (
              <div className="flex items-center gap-2.5 py-2">
                {creatorData.photoUrl ? (
                  <img src={creatorData.photoUrl} alt={creatorData.name} className="w-8 h-8 rounded-full object-cover border border-gray-200 flex-shrink-0" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-sm flex-shrink-0">
                    {creatorData.name?.slice(0, 1).toUpperCase()}
                  </div>
                )}
                <span className="text-sm text-gray-500">Created by <span className="font-semibold text-gray-800 hover:underline cursor-pointer">{creatorData.name}</span></span>
              </div>
            )}

            {/* Rating & Price */}
            <div className="flex items-start flex-col justify-between">
              <div className="flex items-center gap-2">
                {avgRating ? (
                  <>
                    <span className="text-yellow-500">⭐</span>
                    <span className="font-semibold text-gray-900">{avgRating}</span>
                    <div className="flex gap-0.5">
                      {Array(5).fill(0).map((_, i) => (
                        <FaStar key={i} size={12} className={i < Math.round(avgRating) ? 'text-amber-400' : 'text-gray-200'} />
                      ))}
                    </div>
                    <span className="text-gray-400 text-sm">({courseReviews.length} review{courseReviews.length !== 1 ? 's' : ''})</span>
                  </>
                ) : (
                  <span className="text-gray-400 text-sm">No ratings yet</span>
                )}
              </div>
              <div>
                <span className="text-lg font-semibold text-black">{selectedCourseData?.price}</span>{" "}
                <span className="line-through text-sm text-gray-400">₹599</span>
              </div>
            </div>

            {/* Highlights */}
            <ul className="text-sm text-gray-700 space-y-1 pt-2">
              <li>✅ 10+ hours of video content</li>
              <li>✅ Lifetime access to course materials</li>

            </ul>

            {/* Enroll Button / Manage Course */}
            {userData && userData._id === selectedCourseData?.creator ? (
              <button className="bg-gray-900 border border-gray-800 text-white font-bold px-8 py-3 rounded-xl hover:bg-gray-800 transition-all shadow-sm mt-4 flex items-center justify-center" onClick={() => navigate(`/addcourses/${courseId}`)}>
                Manage Course
              </button>
            ) : !isEnrolled ? (
              <button
                className="bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 mt-4 flex items-center justify-center"
                onClick={() => {
                  if (!userData) {
                    navigate("/login");
                  } else {
                    handleEnroll(courseId, userData._id);
                  }
                }}
              >
                {userData ? "Enroll Now" : "Login to Enroll"}
              </button>
            ) : (
              <button className="bg-green-50 border border-green-200 text-green-700 font-bold px-8 py-3 rounded-xl hover:bg-green-100 transition-all shadow-sm mt-4 flex items-center justify-center" onClick={() => navigate(`/viewlecture/${courseId}`)}>
                Watch Now
              </button>
            )}
          </div>
        </div>

        {/* What You'll Learn */}
        <div>
          <h2 className="text-xl font-semibold mb-2">What You’ll Learn</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Learn {selectedCourseData?.category} from Beginning</li>

          </ul>
        </div>

        {/* Requirements */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Requirements</h2>
          <p className="text-gray-700">Basic programming knowledge is helpful but not required.</p>
        </div>

        {/* Who This Course Is For */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Who This Course is For</h2>
          <p className="text-gray-700">
            Beginners, aspiring developers, and professionals looking to upgrade skills.
          </p>
        </div>

        {/* course lecture   */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Side - Curriculum */}
          <div className="bg-white w-full md:w-2/5 p-6 rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-1 text-gray-800">Course Curriculum</h2>
            <p className="text-sm text-gray-500 mb-4">{selectedCourseData?.lectures?.length} Lectures</p>

            <div className="flex flex-col gap-3">
              {selectedCourseData?.lectures?.map((lecture, index) => (
                <button
                  key={index}
                  disabled={!lecture.isPreviewFree}
                  onClick={() => {
                    if (lecture.isPreviewFree) {
                      setSelectedLecture(lecture);
                    }
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200 text-left ${lecture.isPreviewFree
                    ? "hover:bg-gray-100 cursor-pointer border-gray-300"
                    : "cursor-not-allowed opacity-60 border-gray-200"
                    } ${selectedLecture?.lectureTitle === lecture.lectureTitle
                      ? "bg-gray-100 border-gray-400"
                      : ""
                    }`}
                >
                  <span className="text-lg text-gray-700">
                    {lecture.isPreviewFree ? <FaPlayCircle /> : <FaLock />}
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {lecture.lectureTitle}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Side - Video + Info */}
          <div className="bg-white w-full md:w-3/5 p-6 rounded-2xl shadow-lg border border-gray-200">
            <div className="aspect-video w-full rounded-lg overflow-hidden mb-4 bg-black flex items-center justify-center">
              {selectedLecture?.videoUrl ? (
                <video
                  src={selectedLecture.videoUrl}
                  controls
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-sm">Select a preview lecture to watch</span>
              )}
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {selectedLecture?.lectureTitle || "Lecture Title"}
            </h3>
            <p className="text-gray-600 text-sm">
              {selectedCourseData?.title}
            </p>
          </div>
        </div>
        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-semibold mb-2">Write a Review</h2>
          <div className="mb-4">
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (

                <FaStar key={star}
                  onClick={() => setRating(star)} className={star <= rating ? "fill-yellow-500" : "fill-gray-300"} />

              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your comment here..."
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all text-gray-700"
              rows="3"
            />
            <button

              className="bg-blue-600 text-white mt-3 px-6 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-all shadow-md shadow-blue-200/50" onClick={handleReview}
            >
              Submit Review
            </button>
          </div>


          <div>
            <p className='text-xl font-semibold mb-2'>Other Published Courses by the Educator -</p>
            <div className='w-full transition-all duration-300 py-[20px]   flex items-start justify-center lg:justify-start flex-wrap gap-6 lg:px-[80px] '>

              {
                selectedCreatorCourse?.map((item, index) => (
                  <Card key={index} thumbnail={item.thumbnail} title={item.title} id={item._id} price={item.price} category={item.category} />
                ))
              }
            </div>
          </div>

          {/* ===== Course Reviews Section ===== */}
          <div className="mt-8 border-t pt-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-900">Student Reviews</h2>
              {courseReviews.length > 0 && (
                <span className="text-sm text-gray-400">{courseReviews.length} review{courseReviews.length !== 1 ? 's' : ''}</span>
              )}
            </div>

            {courseReviews.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-2xl border border-gray-100">
                <span className="text-3xl">💬</span>
                <p className="text-gray-400 text-sm mt-2">No reviews yet. Be the first to review this course!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courseReviews.map((review, index) => (
                  <div key={index} className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-gray-200 hover:shadow-sm transition-all">
                    {/* Reviewer info */}
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={review.user?.photoUrl || img}
                        alt={review.user?.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-100 flex-shrink-0"
                      />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{review.user?.name || 'Anonymous'}</p>
                        <p className="text-xs text-gray-400 capitalize">{review.user?.role || 'Student'}</p>
                      </div>
                      {/* Stars on the right */}
                      <div className="ml-auto flex gap-0.5">
                        {Array(5).fill(0).map((_, i) => (
                          <FaStar key={i} size={12} className={i < review.rating ? 'text-amber-400' : 'text-gray-200'} />
                        ))}
                      </div>
                    </div>
                    {/* Comment */}
                    <p className="text-sm text-gray-600 leading-relaxed italic">"{review.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default ViewCourse
