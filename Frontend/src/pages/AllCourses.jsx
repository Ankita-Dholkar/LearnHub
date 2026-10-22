import React, { useEffect, useState } from 'react';
import { FiFilter, FiSearch, FiX } from "react-icons/fi";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Sparkles, BookOpen } from "lucide-react";
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
  const { courseData = [] } = useSelector(state => state.course);
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

  // Pre-calculate count of courses per category for rich UI
  const categoryCounts = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = (courseData || []).filter(c => c.category === cat).length;
    return acc;
  }, {});

  useEffect(() => { 
    setFilterCourses(courseData || []); 
  }, [courseData]);

  useEffect(() => {
    let result = (courseData || []).slice();
    if (category.length > 0) result = result.filter(c => category.includes(c.category));
    if (search.trim()) result = result.filter(c => c.title?.toLowerCase().includes(search.toLowerCase()));
    setFilterCourses(result);
  }, [category, search, courseData]);

  const renderSidebarContent = () => (
    <>
      <div>
        {/* Back + Title */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              title="Back to Home"
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <FaArrowLeftLong size={14} />
            </button>
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Browse Courses</h2>
              <p className="text-xs text-slate-400">Filter by category or keyword</p>
            </div>
          </div>
        </div>

        {/* Search inside sidebar */}
        <div className="relative mb-4">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="w-full pl-10 pr-9 py-2.5 text-sm bg-slate-50 border border-slate-200/80 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <FiX size={15} />
            </button>
          )}
        </div>

        {/* AI Search button */}
        <button
          onClick={() => navigate("/searchwithai")}
          className="w-full mb-6 py-3 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm shadow-blue-200 hover:shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Sparkles size={16} className="text-amber-300" />
          <span>Search with AI</span>
        </button>

        {/* Filter section header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Categories</span>
            {category.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[11px] font-bold flex items-center justify-center">
                {category.length}
              </span>
            )}
          </div>
          {category.length > 0 && (
            <button
              onClick={clearFilters}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold transition"
            >
              Reset
            </button>
          )}
        </div>

        {/* Category List */}
        <div className="space-y-1.5">
          {CATEGORIES.map(cat => {
            const isActive = category.includes(cat);
            const count = categoryCounts[cat] || 0;
            return (
              <label
                key={cat}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer text-sm transition-all select-none border ${
                  isActive
                    ? 'bg-blue-50/80 border-blue-200 text-blue-700 font-semibold shadow-xs'
                    : 'border-transparent text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-md border flex items-center justify-center flex-shrink-0 transition-all ${
                      isActive ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isActive && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="truncate">{cat}</span>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    isActive ? 'bg-blue-200/60 text-blue-800' : 'text-slate-400 bg-slate-100'
                  }`}
                >
                  {count}
                </span>
                <input
                  type="checkbox"
                  className="hidden"
                  value={cat}
                  checked={isActive}
                  onChange={() => toggleCategory(cat)}
                />
              </label>
            );
          })}
        </div>
      </div>

      {/* Sidebar Footer count */}
      <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <span>Results Filtered</span>
        <span className="font-semibold text-slate-700">{filterCourses.length} of {courseData.length}</span>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50/70">
      <Nav />

      {/* Mobile filter toggle */}
      <button
        onClick={() => setIsSidebarVisible(p => !p)}
        className="fixed top-24 left-4 z-50 bg-white text-slate-800 text-sm font-semibold px-4 py-2.5 rounded-xl md:hidden border border-slate-200 shadow-md flex items-center gap-2"
      >
        <FiFilter size={16} className="text-blue-600" />
        {isSidebarVisible ? 'Close Filters' : 'Filter Courses'}
      </button>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarVisible && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden"
          onClick={() => setIsSidebarVisible(false)}
        />
      )}

      {/* Flex container below fixed navbar */}
      <div className="pt-20 flex min-h-[calc(100vh-80px)]">
        {/* Desktop In-Flow Sticky Sidebar: CAN NEVER OVERLAP */}
        <aside className="hidden md:flex flex-col justify-between w-72 lg:w-80 shrink-0 sticky top-20 h-[calc(100vh-80px)] bg-white border-r border-slate-200/80 shadow-xs p-6 overflow-y-auto custom-scrollbar z-30">
          {renderSidebarContent()}
        </aside>

        {/* Mobile Slide-Out Drawer */}
        <aside
          className={`fixed inset-y-0 left-0 w-72 bg-white z-50 pt-24 p-6 flex flex-col justify-between overflow-y-auto custom-scrollbar md:hidden transition-transform duration-300 shadow-2xl ${
            isSidebarVisible ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {renderSidebarContent()}
        </aside>

        {/* Main Content: Takes 100% of the remaining width side-by-side */}
        <main className="flex-1 min-w-0 py-8 px-6 sm:px-8 lg:px-10 xl:px-12">
          {/* Header Section */}
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200/70">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                  <BookOpen size={13} />
                  Course Catalog
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">All Courses</h1>
              <p className="text-sm text-slate-500 mt-1">
                Explore our curated selection of verified courses taught by industry leaders.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-xs">
                {filterCourses.length} {filterCourses.length === 1 ? 'Course' : 'Courses'} Available
              </span>
            </div>
          </div>

          {/* Active Filter Chips */}
          {(category.length > 0 || search) && (
            <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-white border border-slate-200/70 rounded-2xl shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 mr-1">Active:</span>
              {search && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                  <span>Search: <strong>"{search}"</strong></span>
                  <button onClick={() => setSearch('')} className="hover:text-red-500"><FiX size={13} /></button>
                </span>
              )}
              {category.map(cat => (
                <span key={cat} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  <span>{cat}</span>
                  <button onClick={() => toggleCategory(cat)} className="hover:text-red-500"><FiX size={13} /></button>
                </span>
              ))}
              <button
                onClick={clearFilters}
                className="text-xs text-red-600 hover:text-red-700 font-semibold ml-auto px-2 py-1"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Courses Display Grid */}
          {filterCourses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 bg-white border border-slate-200/70 rounded-3xl text-center shadow-xs mt-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-3xl mb-4 text-blue-600">
                🔍
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">No courses match your criteria</h3>
              <p className="text-sm text-slate-400 max-w-sm mb-6">
                Try searching with different keywords or remove selected category filters.
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-100 transition-all"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 lg:gap-8">
              {filterCourses.map((item, index) => (
                <Card
                  key={item._id || index}
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
    </div>
  );
}
export default AllCourses;
