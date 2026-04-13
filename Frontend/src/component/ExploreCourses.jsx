import React from 'react'
import { SiViaplay } from "react-icons/si";
import { TbDeviceDesktopAnalytics } from "react-icons/tb";
import { LiaUikit } from "react-icons/lia";
import { MdAppShortcut } from "react-icons/md";
import { FaHackerrank } from "react-icons/fa";
import { TbBrandOpenai } from "react-icons/tb";
import { SiGoogledataproc } from "react-icons/si";
import { BsClipboardDataFill } from "react-icons/bs";
import { SiOpenaigym } from "react-icons/si";
import { useNavigate } from 'react-router-dom';

const ExploreCourses = () => {
  const navigate = useNavigate();
  const categories = [
    { icon: <TbDeviceDesktopAnalytics size={40} />, name: "Web Development", color: "from-blue-50 to-blue-50", iconColor: "text-blue-600" },
    { icon: <LiaUikit size={40} />, name: "UI/UX Design", color: "from-sky-50 to-pink-50", iconColor: "text-sky-600" },
    { icon: <MdAppShortcut size={35} />, name: "App Development", color: "from-orange-50 to-red-50", iconColor: "text-orange-600" },
    { icon: <FaHackerrank size={35} />, name: "Ethical Hacking", color: "from-green-50 to-teal-50", iconColor: "text-green-600" },
    { icon: <TbBrandOpenai size={35} />, name: "AI/ML", color: "from-cyan-50 to-blue-50", iconColor: "text-cyan-600" },
    { icon: <SiGoogledataproc size={35} />, name: "Data Science", color: "from-blue-50 to-sky-50", iconColor: "text-blue-600" },
    { icon: <BsClipboardDataFill size={35} />, name: "Data Analytics", color: "from-yellow-50 to-orange-50", iconColor: "text-yellow-600" },
    { icon: <SiOpenaigym size={35} />, name: "AI Tools", color: "from-pink-50 to-rose-50", iconColor: "text-rose-600" },
  ];

  return (
    <div className='w-full grid lg:grid-cols-12 gap-12 items-center'>
      <div className='lg:col-span-4 space-y-6'>
        <h2 className='text-5xl font-black tracking-tight text-gray-900'>
          Explore <br />
          <span className='text-blue-600'>Our Courses</span>
        </h2>
        <p className='text-gray-600 text-lg leading-relaxed font-medium'>
          Dive into our diverse range of categories. Master new technologies or refine existing skills with industry-led curriculum.
        </p>
        <button 
          className='group px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl flex items-center gap-3 transition-all shadow-lg shadow-blue-100'
          onClick={() => navigate("/allcourses")}
        >
          Explore Courses
          <SiViaplay className='group-hover:translate-x-1 transition-transform' />
        </button>
      </div>

      <div className='lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4'>
        {categories.map((cat, index) => (
          <div 
            key={index}
            className={`group p-6 bg-gradient-to-br ${cat.color} border border-gray-100 rounded-3xl cursor-pointer hover:bg-white hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50/50 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center gap-4 text-center`}
          >
            <div className={`${cat.iconColor} transition-transform duration-300 group-hover:scale-110`}>
              {cat.icon}
            </div>
            <span className='text-sm font-bold text-gray-700 group-hover:text-gray-900 transition-colors'>
              {cat.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreCourses