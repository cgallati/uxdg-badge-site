'use client';

import { useState } from 'react';
import AuthAnimation from './components/AuthAnimation';

export default function Home() {
  const [showAnimation, setShowAnimation] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const handleAnimationComplete = () => {
    setShowAnimation(false);
    setTimeout(() => {
      setShowContent(true);
    }, 500); // Brief delay before content appears
  };

  return (
    <>
      {showAnimation && <AuthAnimation onComplete={handleAnimationComplete} />}
      
      <div className={`min-h-screen bg-black text-white font-sans transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-md mx-auto md:max-w-2xl lg:max-w-4xl">
          {/* Header */}
          <header className="p-6 text-center md:p-8 lg:p-12">
            <div className="mb-4">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">SCAD</h1>
              <p className="text-sm md:text-base text-gray-300 mt-1">UX DESIGN PROGRAM</p>
            </div>
          </header>

          {/* Main Content */}
          <main className="px-6 pb-8 md:px-8 lg:px-12">
            {/* Access Status */}
            <div className="text-center mb-8 md:mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-green-500 mb-4">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-2">ACCESS GRANTED</h2>
              <p className="text-gray-400 text-sm md:text-base">Welcome to the exclusive UX Design program area</p>
            </div>

            {/* Program Info */}
            <div className="space-y-6 mb-8 md:grid md:grid-cols-2 md:gap-6 md:space-y-0 lg:gap-8">
              <div className="bg-gray-900 rounded-lg p-6 md:p-8">
                <h3 className="text-lg md:text-xl font-semibold mb-3 text-red-500">Program Overview</h3>
                <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                  Join the Savannah College of Art and Design's premier UX Design program. 
                  Learn from industry professionals and build portfolio-ready projects that 
                  solve real-world problems.
                </p>
              </div>

              <div className="bg-gray-900 rounded-lg p-6 md:p-8">
                <h3 className="text-lg md:text-xl font-semibold mb-3 text-red-500">What You'll Learn</h3>
                <ul className="text-gray-300 text-sm md:text-base space-y-2">
                  <li>• User Research & Testing</li>
                  <li>• Interface Design & Prototyping</li>
                  <li>• Design Systems & Accessibility</li>
                  <li>• Industry Tools & Workflows</li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 md:grid md:grid-cols-3 md:gap-4 md:space-y-0">
              <button className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-4 px-6 rounded-lg transition-colors text-sm md:text-base">
                Explore Program Details
              </button>
              
              <button className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-4 px-6 rounded-lg transition-colors border border-gray-600 text-sm md:text-base">
                View Student Work
              </button>
              
              <button className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-4 px-6 rounded-lg transition-colors border border-gray-600 text-sm md:text-base">
                Apply Now
              </button>
            </div>
          </main>

          {/* Footer */}
          <footer className="p-6 text-center text-gray-500 text-xs md:text-sm md:p-8">
            <p>© 2024 Savannah College of Art and Design</p>
          </footer>
        </div>
      </div>
    </>
  );
}
