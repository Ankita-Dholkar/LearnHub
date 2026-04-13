import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { FaGithub, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-950 text-gray-400 pt-16 pb-8 px-6 mt-8">
      <div className="max-w-7xl mx-auto">

        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="space-y-5 lg:col-span-1">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
              <img src={logo} alt="LearnHub Logo" className="h-10 rounded-xl" />
              <span className="text-2xl font-black text-white tracking-tight">LearnHub</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Empowering learners worldwide with AI-driven education, expert instructors, and lifetime access to world-class content.
            </p>
            {/* Socials */}
            <div className="flex items-center gap-4 pt-1">
              {[
                { icon: <FaGithub size={18} />, href: "#" },
                { icon: <FaTwitter size={18} />, href: "#" },
                { icon: <FaLinkedin size={18} />, href: "#" },
                { icon: <FaInstagram size={18} />, href: "#" },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-800 hover:bg-blue-600 hover:text-white text-gray-400 transition-all duration-300"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Platform</h4>
            <ul className="space-y-3 text-sm">
              {[
                { label: "Home", path: "/" },
                { label: "Explore Courses", path: "/allcourses" },
                { label: "AI Course Search", path: "/searchwithai" },
                { label: "My Dashboard", path: "/student-dashboard" },
              ].map((link, i) => (
                <li
                  key={i}
                  onClick={() => navigate(link.path)}
                  className="cursor-pointer hover:text-blue-400 transition-colors duration-200"
                >
                  {link.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Categories</h4>
            <ul className="space-y-3 text-sm">
              {["Web Development", "Data Science", "UI/UX Design", "AI & Machine Learning", "Digital Marketing"].map((cat, i) => (
                <li
                  key={i}
                  className="hover:text-blue-400 cursor-pointer transition-colors duration-200"
                  onClick={() => navigate("/allcourses")}
                >
                  {cat}
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Stay in the Loop</h4>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Get notified about new courses, features, and learning tips.
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 flex-1">
                  <MdEmail className="text-gray-500 flex-shrink-0" size={16} />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="bg-transparent text-sm text-white placeholder-gray-500 outline-none w-full"
                  />
                </div>
                <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all duration-200 shadow-lg shadow-blue-900/30 whitespace-nowrap">
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-gray-600">No spam, unsubscribe anytime.</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-7 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-600">
          <p>© {new Date().getFullYear()} <span className="text-gray-400 font-semibold">LearnHub</span>. All rights reserved. Built with ❤️ for learners.</p>
          <div className="flex gap-6">
            <span className="hover:text-blue-400 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-blue-400 cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-blue-400 cursor-pointer transition-colors">Cookie Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
