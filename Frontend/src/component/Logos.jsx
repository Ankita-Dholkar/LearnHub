import React from 'react'
import { MdCastForEducation } from "react-icons/md";
import { SiOpenaccess } from "react-icons/si";
import { FaSackDollar } from "react-icons/fa6";
import { BiSupport } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";

const Logos = () => {
  const features = [
    { icon: <MdCastForEducation size={30} />, text: "20k+ Online Courses", color: "text-blue-600", bg: "bg-blue-50/50" },
    { icon: <SiOpenaccess size={28} />, text: "Lifetime Access", color: "text-green-600", bg: "bg-green-50/50" },
    { icon: <FaSackDollar size={26} />, text: "Value For Money", color: "text-yellow-600", bg: "bg-yellow-50/50" },
    { icon: <BiSupport size={28} />, text: "Lifetime Support", color: "text-red-600", bg: "bg-red-50/50" },
    { icon: <FaUsers size={28} />, text: "Community Support", color: "text-sky-600", bg: "bg-sky-50/50" }
  ];

  return (
    <div className='w-full py-10 flex flex-wrap items-center justify-center gap-6'>
      {features.map((feature, index) => (
        <div 
          key={index} 
          className={`group flex items-center gap-4 px-6 py-4 ${feature.bg} border border-gray-100 rounded-2xl cursor-pointer hover:bg-white hover:border-blue-100 hover:shadow-lg hover:shadow-blue-50 transition-all duration-300`}
        >
          <div className={`${feature.color} group-hover:scale-110 transition-transform`}>
            {feature.icon}
          </div>
          <span className='text-gray-700 font-semibold group-hover:text-gray-900 transition-colors'>
            {feature.text}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Logos