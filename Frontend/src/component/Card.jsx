import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Card = ({ thumbnail, title, category, price, id }) => {
  const navigate = useNavigate();
  const { allReview } = useSelector(state => state.review);

  // Filter reviews from the populated Redux state
  const courseReviews = allReview?.filter(r =>
    r.course?.toString() === id || r.course?._id?.toString() === id
  ) || [];

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return null;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const avgRating = calculateAverageRating(courseReviews);

  return (
    <div
      onClick={() => navigate(`/viewcourse/${id}`)}
      className="group w-[280px] bg-white border border-gray-100 rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg hover:border-gray-200 transition-all duration-300 flex flex-col"
    >
      {/* Thumbnail */}
      <div className="relative h-44 overflow-hidden bg-gray-100">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">No image</div>
        )}
        {/* Category badge */}
        <span className="absolute top-3 left-3 bg-white/95 text-gray-700 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
          {category}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug mb-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>

        {/* Rating row */}
        {avgRating ? (
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-xs font-bold text-amber-600">{avgRating}</span>
            <div className="flex">
              {Array(5).fill(0).map((_, i) => (
                <svg key={i} className={`w-3 h-3 ${i < Math.round(avgRating) ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-[10px] text-gray-400">({courseReviews.length})</span>
          </div>
        ) : (
          <p className="text-[10px] text-gray-400 mb-3">No reviews yet</p>
        )}

        {/* Price row */}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-50">
          <div>
            <p className="text-[9px] text-gray-400 uppercase font-bold tracking-widest">Enrollment Fee</p>
            <p className="text-base font-black text-gray-900">₹{price}</p>
          </div>
          <span className="text-xs text-blue-600 font-semibold group-hover:underline">View Course →</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
