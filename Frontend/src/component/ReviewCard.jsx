import React from "react";
import { FaStar } from "react-icons/fa6";
import { FaRegStar } from "react-icons/fa";
const ReviewCard = ({ text, name, image, rating, role }) => {
  return (
    <div className="group relative bg-white p-8 rounded-[2rem] border border-gray-100 hover:border-blue-200 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-50 flex flex-col justify-between">
      <div>
        {/* ⭐ Rating Stars */}
        <div className="flex items-center mb-6 text-yellow-500 gap-1">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <span key={i} className={i < rating ? "text-yellow-500" : "text-gray-200"}>
                <FaStar size={14} />
              </span>
            ))}
        </div>

        {/* 💬 Review Text */}
        <p className="text-gray-600 text-lg italic leading-relaxed mb-8 group-hover:text-gray-900 transition-colors">
          "{text}"
        </p>
      </div>

      {/* 👤 Reviewer Info */}
      <div className="flex items-center gap-4 pt-6 border-t border-gray-50">
        <div className="relative">
          <img
            src={image}
            alt={name}
            className="w-12 h-12 rounded-full object-cover border-2 border-gray-100 group-hover:border-indigo-500 transition-colors"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
        </div>
        <div>
          <h4 className="font-bold text-gray-900 tracking-tight">{name}</h4>
          <p className="text-xs text-indigo-600 font-bold uppercase tracking-widest">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
