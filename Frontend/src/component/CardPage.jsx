import React, { useEffect, useState } from 'react'
import Card from "./Card.jsx"
import { useSelector } from 'react-redux';
import { SiViaplay } from "react-icons/si";
import { useNavigate } from 'react-router-dom';

function Cardpage() {
  const [popularCourses, setPopularCourses] = useState([]);
  const { courseData } = useSelector(state => state.course)
  const navigate = useNavigate()

  useEffect(() => {
    setPopularCourses(courseData.slice(0, 6));
  }, [courseData])

  return (
    <div className='w-full'>
      <div className='flex flex-col md:flex-row items-end justify-between gap-6 mb-12'>
        <div className='space-y-4'>
          <h2 className='text-4xl md:text-5xl font-black text-gray-900 tracking-tight'>
            Our Popular <span className='text-blue-600'>Courses</span>
          </h2>
          <p className='text-gray-600 text-lg font-medium'>
            Join thousands of students learning from industry experts.
          </p>
        </div>
        <button
          className='px-6 py-3 border-2 border-blue-600 text-blue-600 font-bold rounded-2xl hover:bg-blue-600 hover:text-white transition-all duration-300'
          onClick={() => navigate("/allcourses")}
        >
          View All Courses
        </button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
        {popularCourses.map((item, index) => (
          <Card
            key={index}
            id={item._id}
            thumbnail={item.thumbnail}
            title={item.title}
            price={item.price}
            category={item.category}
            reviews={item.reviews}
          />
        ))}
      </div>
    </div>
  )
}

export default Cardpage
