import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { FaArrowLeftLong } from "react-icons/fa6";

function CourseQuiz() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { courseData } = useSelector(state => state.course);
  const courseTitle = courseData?.find(c => c._id === courseId)?.title || 'Course';

  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(null);

  const generateQuiz = async () => {
    setLoading(true);
    try {
      const result = await axios.get(`${serverUrl}/api/ai/generate-quiz/${courseId}`, { withCredentials: true });
      setQuestions(result.data);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to generate AI Quiz");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateQuiz();
    // eslint-disable-next-line
  }, []);

  const handleSelectOption = (qIdx, option) => {
    setSelectedAnswers({ ...selectedAnswers, [qIdx]: option });
  };

  const calculateScore = () => {
    let finalScore = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        finalScore += 1;
      }
    });
    setScore(finalScore);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <div className="relative z-10 flex flex-col items-center">
          <ClipLoader size={42} color={'#374151'} />
          <h2 className="mt-6 text-lg font-bold text-gray-700 animate-pulse">Generating your Quiz...</h2>
        </div>
      </div>
    );
  }

  if (questions.length === 0 && !loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <div className="relative z-10 flex flex-col items-center gap-4">
          <h2 className="text-lg font-bold text-red-500">Failed to load quiz.</h2>
          <button className="px-8 py-3 bg-gray-900 hover:bg-gray-800 font-bold transition-all text-white rounded-xl text-sm" onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </div>
    );
  }

  const isCompleted = score !== null;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="relative z-10 max-w-3xl mx-auto bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">

        {/* Header */}
        <div className="bg-gray-900 p-5 flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <button className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition" onClick={() => navigate(-1)}>
              <FaArrowLeftLong size={14} />
            </button>
            <h1 className="text-xl font-bold">{courseTitle} Quiz</h1>
          </div>
          <div className="font-medium bg-white/10 px-3 py-1 rounded-full text-xs">
            {questions.length} Questions
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-10">
          {isCompleted ? (
            <div className="flex flex-col items-center justify-center text-center py-10 animate-in fade-in zoom-in duration-500">
              <h2 className="text-4xl font-black text-gray-900 mb-2">Quiz Complete!</h2>
              <p className="text-lg text-gray-600 mb-8">Here is how you did based on the AI assessment:</p>

              <div className="w-40 h-40 rounded-full border-8 flex items-center justify-center text-5xl font-black mb-8 shadow-inner shadow-gray-200"
                style={{ borderColor: score >= 7 ? '#22c55e' : score >= 4 ? '#eab308' : '#ef4444', color: score >= 7 ? '#16a34a' : score >= 4 ? '#ca8a04' : '#dc2626' }}>
                {score}/{questions.length}
              </div>

              <div className="flex gap-4 mb-12">
                <button className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition" onClick={() => navigate(-1)}>Back to Course</button>
                <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition" onClick={() => { setScore(null); setSelectedAnswers({}); setCurrentIdx(0); }}>Retry Quiz</button>
              </div>

              {/* Review Section */}
              <div className="w-full text-left animate-in fade-in slide-in-from-bottom-8 duration-700">
                <h3 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-6">Review Answers</h3>
                <div className="space-y-6">
                  {questions.map((q, idx) => {
                    const isCorrect = selectedAnswers[idx] === q.correctAnswer;
                    const isUnanswered = !selectedAnswers[idx];

                    return (
                      <div key={idx} className={`p-6 rounded-2xl border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <div className="flex gap-3 items-start">
                          <div className={`mt-0.5 rounded-full flex-shrink-0 ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                            {isCorrect ? (
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                            ) : (
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 mb-3 text-lg leading-snug">{idx + 1}. {q.question}</h4>

                            <div className="space-y-2 text-[15px]">
                              <p className="flex items-start gap-2">
                                <span className="font-medium text-gray-500 mt-0.5 whitespace-nowrap">Your Answer:</span>
                                <span className={`font-bold ${isUnanswered ? 'text-gray-400 italic' : (isCorrect ? 'text-green-700' : 'text-red-700')}`}>
                                  {isUnanswered ? 'Skipped / Unanswered' : selectedAnswers[idx]}
                                </span>
                              </p>

                              {!isCorrect && (
                                <p className="flex items-start gap-2 mt-2 pt-2 border-t border-red-100">
                                  <span className="font-medium text-gray-500 mt-0.5 whitespace-nowrap">Correct Answer:</span>
                                  <span className="font-bold text-green-700">{q.correctAnswer}</span>
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Question {currentIdx + 1} of {questions.length}</span>
                <span className="text-blue-600 font-medium">{Math.round(((currentIdx + 1) / questions.length) * 100)}%</span>
              </div>

              <div className="w-full bg-gray-100 rounded-full h-1.5 mb-8 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-sky-400 h-1.5 rounded-full transition-all duration-500" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}></div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-8 leading-tight">{questions[currentIdx]?.question}</h2>

              <div className="flex flex-col gap-3">
                {questions[currentIdx]?.options?.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectOption(currentIdx, opt)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${selectedAnswers[currentIdx] === opt ? 'border-blue-500 bg-blue-50 shadow-sm shadow-blue-100' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/30'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedAnswers[currentIdx] === opt ? 'border-blue-500' : 'border-gray-300'}`}>
                        {selectedAnswers[currentIdx] === opt && <div className="w-3 h-3 bg-blue-500 rounded-full"></div>}
                      </div>
                      <span className={`text-lg font-medium ${selectedAnswers[currentIdx] === opt ? 'text-blue-900' : 'text-gray-700'}`}>{opt}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-10 flex justify-between border-t border-gray-100 pt-6">
                <button
                  className={`px-6 py-2.5 font-bold rounded-xl transition ${currentIdx === 0 ? 'opacity-0 pointer-events-none' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                  onClick={() => setCurrentIdx(prev => prev - 1)}
                >
                  Previous
                </button>

                {currentIdx === questions.length - 1 ? (
                  <button
                    className={`px-8 py-2.5 font-bold rounded-xl transition shadow-lg ${selectedAnswers[currentIdx] ? 'bg-green-500 hover:bg-green-600 shadow-green-200 text-white' : 'bg-gray-300 pointer-events-none text-gray-500'}`}
                    onClick={calculateScore}
                  >
                    Finish Quiz
                  </button>
                ) : (
                  <button
                    className={`px-8 py-2.5 font-bold rounded-xl transition shadow-lg ${selectedAnswers[currentIdx] ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200 text-white' : 'bg-gray-300 pointer-events-none text-gray-500'}`}
                    onClick={() => setCurrentIdx(prev => prev + 1)}
                  >
                    Next Question
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseQuiz;
