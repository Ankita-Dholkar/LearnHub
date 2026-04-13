import React, { useState } from 'react'
import ai from "../assets/ai.png"
import ai1 from "../assets/SearchAi.png"
import { RiMicAiFill } from "react-icons/ri";
import axios from 'axios';
import { serverUrl } from '../App';
import { useNavigate } from 'react-router-dom';
import start from "../assets/start.mp3"
import { FaArrowLeftLong } from "react-icons/fa6";
function SearchWithAi() {
  const [input, setInput] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [listening, setListening] = useState(false)
  const navigate = useNavigate();
  const startSound = new Audio(start)
  function speak(message) {
    let utterance = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(utterance);
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  if (!recognition) {
    console.log("Speech recognition not supported");
  }

  const handleSearch = async () => {

    if (!recognition) return;
    setListening(true)
    startSound.play()
    recognition.start();
    recognition.onresult = async (e) => {
      const transcript = e.results[0][0].transcript.trim();
      setInput(transcript);
      await handleRecommendation(transcript);
    };



  };

  const handleRecommendation = async (query) => {
    try {
      const result = await axios.post(`${serverUrl}/api/ai/search`, { input: query }, { withCredentials: true });
      setRecommendations(result.data);
      if (result.data.length > 0) {
        speak("These are the top courses I found for you")
      } else {
        speak("No courses found")
      }

      setListening(false)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-50/50 to-white text-gray-900 flex flex-col items-center px-4 py-16 overflow-hidden">
      <div className='absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/30 blur-[120px] rounded-full pointer-events-none' />
      <div className='absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-sky-200/30 blur-[120px] rounded-full pointer-events-none' />

      {/* Search Container */}
      <div className="relative z-10 bg-white shadow-2xl shadow-blue-100/50 rounded-3xl p-6 sm:p-8 w-full max-w-2xl text-center border border-white/50 backdrop-blur-sm">
        <FaArrowLeftLong className='text-gray-700 hover:text-blue-600 transition-colors w-[22px] h-[22px] cursor-pointer absolute' onClick={() => navigate("/")} />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 flex items-center justify-center gap-2">
          <img src={ai} className='w-8 h-8 sm:w-[30px] sm:h-[30px]' alt="AI" />
          Search with <span className='text-blue-600'>AI</span>
        </h1>

        <div className="flex items-center bg-white border-2 border-blue-100 rounded-full shadow-lg shadow-blue-50/50 relative w-full focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50 transition-all">

          <input
            type="text"
            className="flex-grow px-6 py-4 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none text-sm sm:text-base font-medium"
            placeholder="What do you want to learn? (e.g. AI, MERN, Cloud...)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />


          {input && (
            <button
              onClick={() => handleRecommendation(input)}
              className="absolute right-14 sm:right-16 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
            >
              <img src={ai} className='w-10 h-10 p-2 rounded-full' alt="Search" />
            </button>
          )}

          <button
            className="absolute right-2 bg-blue-50 hover:bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
            onClick={handleSearch}
          >
            <RiMicAiFill className="w-5 h-5 text-blue-600 hover:text-blue-700" />
          </button>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 ? (
        <div className="w-full max-w-6xl mt-12 px-2 sm:px-4 relative z-10">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-900 text-center flex items-center justify-center gap-3">
            <img src={ai1} className="w-10 h-10 sm:w-[60px] sm:h-[60px] p-2 rounded-full bg-blue-50" alt="AI Results" />
            AI Search Results
          </h2>


          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {recommendations.map((course, index) => (
              <div
                key={index}
                className="bg-white text-gray-900 p-6 rounded-3xl shadow-lg border border-gray-100 hover:border-blue-200 hover:shadow-blue-200 cursor-pointer hover:-translate-y-1 transition-all duration-300"
                onClick={() => navigate(`/viewcourse/${course._id}`)}
              >
                <h3 className="text-lg font-bold sm:text-xl">{course.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{course.category}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        listening ? <h1 className='text-center text-xl sm:text-2xl mt-10 text-gray-500 font-medium relative z-10'>Listening...</h1> : <h1 className='text-center text-xl sm:text-2xl mt-10 text-gray-500 font-medium relative z-10'>No Courses Found</h1>

      )}
    </div>
  );
}

export default SearchWithAi;
