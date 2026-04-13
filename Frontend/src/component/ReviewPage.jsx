import React, { useEffect, useRef } from 'react'

const testimonials = [
  {
    name: "Priya S.",
    role: "Frontend Developer",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    text: "LearnHub gave me the flexibility I needed while working full-time. I completed  2 courses in 6 months and landed a better-paying role. The AI quiz feature is brilliant!"
  },
  {
    name: "Rahul M.",
    role: "Data Science Student",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    text: "The course quality here is unmatched. With each lecture, I get more value out of my subscription. The dashboard progress tracking keeps me motivated every single day."
  },
  {
    name: "Aisha K.",
    role: "UI/UX Designer",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    text: "I really appreciate the structured learning path. I can try any course and switch to another one easily. This flexibility motivates me to learn even more!"
  },
  {
    name: "Arjun D.",
    role: "Full Stack Developer",
    avatar: "https://randomuser.me/api/portraits/men/76.jpg",
    text: "The AI-powered search helped me find exactly what I needed within seconds. Expert trainers, clear explanations — LearnHub is my go-to platform for upskilling."
  },
  {
    name: "Sneha P.",
    role: "Digital Marketer",
    avatar: "https://randomuser.me/api/portraits/women/25.jpg",
    text: "Incredibly well-structured content and very affordable. I've tried Udemy and Coursera but LearnHub feels more personal and focused. Absolutely love it!"
  },
  {
    name: "Vikram N.",
    role: "Backend Engineer",
    avatar: "https://randomuser.me/api/portraits/men/54.jpg",
    text: "Lecture progress tracking is such a thoughtful feature. Knowing exactly where I stopped and how close I am to finishing a course really helps me stay consistent."
  }
]

function ReviewPage() {
  const headingRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('card-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (headingRef.current) observer.observe(headingRef.current);
    cardsRef.current.forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .card-hidden {
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .card-visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        .heading-hidden {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        ${testimonials.map((_, i) => `.card-delay-${i} { transition-delay: ${i * 0.08}s; }`).join('\n')}
      `}</style>

      <div className='flex flex-col items-start py-6 w-full'>

        {/* Section heading — left aligned like Coursera */}
        <div ref={headingRef} className='heading-hidden card-visible mb-10 w-full'>
          <h2 className='text-2xl md:text-3xl font-bold text-gray-900'>
            What our students are achieving through learning
          </h2>
        </div>

        {/* Cards grid */}
        <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
          {testimonials.map((item, index) => (
            <div
              key={index}
              ref={(el) => (cardsRef.current[index] = el)}
              className={`card-hidden card-delay-${index} group bg-white border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-400 rounded-xl p-6 flex flex-col gap-4 cursor-default`}
            >
              {/* Avatar + name row */}
              <div className='flex items-center gap-3'>
                <img
                  src={item.avatar}
                  alt={item.name}
                  className='w-12 h-12 rounded-full object-cover border-2 border-gray-100 group-hover:border-blue-300 transition-colors duration-300'
                />
                <div>
                  <p className='font-semibold text-gray-900 text-sm'>{item.name}</p>
                  <p className='text-xs text-gray-400'>{item.role}</p>
                </div>
              </div>

              {/* Quote */}
              <p className='text-gray-600 text-sm leading-relaxed'>
                "{item.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default ReviewPage
