import React, { useEffect, useRef } from 'react'
import student2 from "../assets/student2.png"
import { BiSolidBadgeCheck } from "react-icons/bi"

function About() {
  const sectionRef = useRef(null);
  const imgRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-visible');
          }
        });
      },
      { threshold: 0.15 }
    );

    if (imgRef.current) observer.observe(imgRef.current);
    if (textRef.current) observer.observe(textRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .animate-from-left {
          opacity: 0;
          transform: translateX(-60px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .animate-from-right {
          opacity: 0;
          transform: translateX(60px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .animate-visible {
          opacity: 1 !important;
          transform: translateX(0) !important;
        }
        .feature-item {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .feature-item.animate-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .feature-item:nth-child(1) { transition-delay: 0.1s; }
        .feature-item:nth-child(2) { transition-delay: 0.2s; }
        .feature-item:nth-child(3) { transition-delay: 0.3s; }
        .feature-item:nth-child(4) { transition-delay: 0.4s; }
        .img-shine::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%);
          background-size: 200% 200%;
          animation: shine 4s ease infinite;
        }
        @keyframes shine {
          0% { background-position: 200% 0%; }
          100% { background-position: -200% 0%; }
        }
      `}</style>

      <section className='w-full py-24 flex flex-col lg:flex-row items-center justify-between gap-16'>

        {/* Left — Single student image with decorative elements */}
        <div ref={imgRef} className='animate-from-left w-full lg:w-1/2 relative flex justify-center'>
          {/* Decorative blobs */}
          <div className='absolute top-[-8%] left-[-8%] w-56 h-56 bg-blue-100 rounded-full blur-3xl opacity-60 pointer-events-none' />
          <div className='absolute bottom-[-8%] right-[-5%] w-40 h-40 bg-sky-100 rounded-full blur-2xl opacity-60 pointer-events-none' />

          {/* Dashed border ring */}
          <div className='absolute inset-0 rounded-[2.5rem] border-2 border-dashed border-blue-200/60 pointer-events-none' style={{ margin: '-12px' }} />

          {/* Image card */}
          <div className='relative img-shine overflow-hidden rounded-[2rem] border border-gray-100 shadow-2xl shadow-blue-100/70 w-full max-w-md'>
            <img
              src={student2}
              className='w-full h-[480px] object-cover object-top hover:scale-105 transition-transform duration-700'
              alt="LearnHub Student"
            />
            {/* Bottom gradient overlay */}
            <div className='absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-900/30 to-transparent' />
            {/* Bottom caption */}
            <div className='absolute bottom-5 left-5 right-5'>
              <p className='text-white text-sm font-semibold drop-shadow-md'>
                🎓 Learning smarter, growing faster
              </p>
            </div>
          </div>
        </div>

        {/* Right — Text content */}
        <div ref={textRef} className='animate-from-right w-full lg:w-1/2 space-y-8'>
          <div className='flex items-center gap-4 text-blue-600 font-bold uppercase tracking-widest text-sm'>
            <div className='h-px w-12 bg-blue-300' />
            About Our Platform
          </div>

          <h2 className='text-4xl md:text-6xl font-black leading-tight text-gray-900 tracking-tight'>
            Maximize Your <br />
            <span className='bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent'>
              Learning Growth
            </span>
          </h2>

          <p className='text-gray-500 text-lg leading-relaxed'>
            We provide a cutting-edge Learning Management System designed to simplify the educational journey. Our mission is to bridge the gap between students and global experts through interactive AI-enhanced tools.
          </p>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2'>
            {[
              { label: "Simplified Learning", emoji: "📚" },
              { label: "Expert Trainers", emoji: "🧑‍🏫" },
              { label: "Proven Success", emoji: "🏆" },
              { label: "Lifetime Access", emoji: "♾️" }
            ].map((item, idx) => (
              <div
                key={idx}
                className='feature-item animate-visible flex items-center gap-3 text-gray-800 font-semibold text-base bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm hover:shadow-md hover:border-blue-200 hover:-translate-y-0.5 transition-all duration-300'
              >
                <span className='text-xl'>{item.emoji}</span>
                <BiSolidBadgeCheck className='text-blue-500 flex-shrink-0' size={20} />
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default About
