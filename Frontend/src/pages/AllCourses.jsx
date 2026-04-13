import React, { useEffect, useState } from 'react';
import { FiFilter, FiSearch } from "react-icons/fi";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import Nav from '../component/Nav';
import Card from '../component/Card';
import { useSelector } from 'react-redux';

const CATEGORIES = [
  'App Development', 'AI/ML', 'AI Tools', 'Data Science',
  'Data Analytics', 'Ethical Hacking', 'UI UX Designing', 'Web Development', 'Others'
];

function AllCourses() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [category, setCategory] = useState([]);
  const [search, setSearch] = useState('');
  const [filterCourses, setFilterCourses] = useState([]);
  const { courseData } = useSelector(state => state.course);
  const navigate = useNavigate();

  const toggleCategory = (val) => {
    setCategory(prev =>
      prev.includes(val) ? prev.filter(c => c !== val) : [...prev, val]
    );
  };

  const clearFilters = () => {
    setCategory([]);
    setSearch('');
  };

  useEffect(() => { setFilterCourses(courseData); }, [courseData]);

  useEffect(() => {
    let result = courseData.slice();
    if (category.length > 0) result = result.filter(c => category.includes(c.category));
    if (search.trim()) result = result.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));
    setFilterCourses(result);
  }, [category, search, courseData]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Nav />

      {/* Mobile filter toggle */}
      <button
        onClick={() => setIsSidebarVisible(p => !p)}
        className="fixed top-[78px] left-4 z-[60] bg-white text-gray-700 text-sm font-medium px-3 py-2 rounded-lg md:hidden border border-gray-200 shadow-sm flex items-center gap-2"
      >
        <FiFilter size={14} />
        {isSidebarVisible ? 'Hide' : 'Filters'}
      </button>

      {/* Sidebar */}
      <aside className={`w-64 h-screen bg-white fixed top-0 left-0 pt-24 pb-6 px-5 border-r border-gray-100 transition-transform duration-300 z-50 overflow-y-auto
        ${isSidebarVisible ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0`}
      >
        {/* Back + Title */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => navigate("/")}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition"
          >
            <FaArrowLeftLong size={14} />
          </button>
          <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Browse Courses</h2>
        </div>

        {/* Search inside sidebar */}
        <div className="relative mb-5">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border border-gray-100 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:bg-white transition"
          />
        </div>

        {/* AI Search button */}
        <button
          onClick={() => navigate("/searchwithai")}
          className="w-full mb-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all"
        >
          ✨ Search with AI
        </button>

        {/* Filter section */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Categories</span>
          {category.length > 0 && (
            <button onClick={clearFilters} className="text-xs text-blue-500 hover:text-blue-700 font-medium transition">
              Clear all
            </button>
          )}
        </div>

        <div className="space-y-1">
          {CATEGORIES.map(cat => {
            const isActive = category.includes(cat);
            return (
              <label
                key={cat}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm transition-all select-none ${isActive ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
              >
                <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all ${isActive ? 'bg-white border-white' : 'border-gray-300'
                  }`}>
                  {isActive && (
                    <svg className="w-2.5 h-2.5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  value={cat}
                  checked={isActive}
                  onChange={() => toggleCategory(cat)}
                />
                {cat}
              </label>
            );
          })}
        </div>

        {/* Result count */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">{filterCourses.length} course{filterCourses.length !== 1 ? 's' : ''} found</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="w-full md:pl-64 pt-24 pb-12 px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">All Courses</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {category.length > 0 || search ? (
                <>{filterCourses.length} result{filterCourses.length !== 1 ? 's' : ''} {category.length > 0 ? `in "${category.join(', ')}"` : ''}</>
              ) : (
                `${filterCourses.length} courses available`
              )}
            </p>
          </div>
        </div>

        {filterCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20 text-center">
            <span className="text-5xl mb-4">🔍</span>
            <h3 className="text-lg font-bold text-gray-700 mb-1">No courses found</h3>
            <p className="text-sm text-gray-400">Try adjusting your filters or search query</p>
            <button onClick={clearFilters} className="mt-4 px-5 py-2 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-5">
            {filterCourses.map((item, index) => (
              <Card
                key={index}
                thumbnail={item.thumbnail}
                title={item.title}
                price={item.price}
                category={item.category}
                id={item._id}
                reviews={item.reviews}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default AllCourses;
