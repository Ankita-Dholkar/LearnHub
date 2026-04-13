import React from 'react'
import Nav from '../component/Nav'
import { SiViaplay } from "react-icons/si";
import Logos from '../component/Logos';
import home from "../assets/home.png"
import ai from "../assets/ai.png"
import ai1 from "../assets/SearchAi.png"
import { useNavigate } from 'react-router-dom';
import ExploreCourses from '../component/ExploreCourses';
import Card from '../component/Card';
import Cardpage from '../component/CardPage';
import About from '../component/About';
import ReviewPage from '../component/ReviewPage';
import Footer from '../component/Footer';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className='w-full min-h-screen bg-white text-gray-900 selection:bg-blue-100'>
      <Nav />
      
      {/* Hero Section */}
      <section className='relative w-full min-h-screen flex flex-col items-center justify-center pt-24 px-6 overflow-hidden bg-gradient-to-b from-blue-50/50 to-white'>
        {/* Background Accents */}
        <div className='absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/30 blur-[120px] rounded-full' />
        <div className='absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-sky-200/30 blur-[120px] rounded-full' />
        
        <div className='z-10 text-center max-w-5xl mx-auto'>
          <h1 className='text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-1000'>
            <span className='text-gray-900'>
              Learn Today.
            </span>
            <br />
            <span className='bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent'>
              Lead Tomorrow.
            </span>
          </h1>
          
          <p className='text-gray-600 text-lg md:text-2xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200'>
           Build real skills with expert-led courses designed to help you learn, practice, and grow.
          </p>
          
          <div className='flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-400'>
            <button 
              className='group relative px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl text-lg flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-blue-200 overflow-hidden'
              onClick={() => navigate("/allcourses")}
            >
              <span className='relative z-10'>Get Started Now</span>
              <SiViaplay className='relative z-10 w-6 h-6' />
            </button>
            
            <button 
              className='px-8 py-4 bg-white border border-gray-200 hover:border-blue-200 hover:bg-blue-50/30 rounded-2xl text-lg font-bold flex items-center gap-3 transition-all text-gray-700'
              onClick={() => navigate("/searchwithai")}
            >
              Search with AI
              <img src={ai} className='w-8 h-8 rounded-full border border-gray-100' alt="AI Icon" />
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className='relative z-10 space-y-8 pb-8'>
        <section className='container mx-auto px-6'>
          <Logos />
        </section>

        <section className='container mx-auto px-6'>
          <ExploreCourses />
        </section>

        <div className='bg-gray-50/50 py-12'>
          <section className='container mx-auto px-6'>
            <Cardpage />
          </section>
        </div>

        <section className='container mx-auto px-6'>
          <About />
        </section>

        <section className='container mx-auto px-6'>
          <ReviewPage />
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Home