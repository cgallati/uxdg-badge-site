'use client';

import { useState } from 'react';
import AuthAnimation from './components/AuthAnimation';
import PortfolioGallery from './components/PortfolioGallery';

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
        <div className="w-full md:max-w-4xl lg:max-w-6xl md:mx-auto">
          {/* Header with Logo */}
          <header className="p-4 text-center md:p-8 lg:p-12">
            <img
              src="/SCADUX.svg"
              alt="SCAD UX Design Program"
              className="h-16 md:h-20 lg:h-24 mx-auto"
            />
          </header>

          {/* Main Content */}
          <main className="px-4 pb-8 md:px-8 lg:px-12">
            {/* Portfolio Gallery */}
            <PortfolioGallery />
          </main>

          {/* Footer */}
          <footer className="p-4 text-center text-gray-500 text-xs md:text-sm md:p-8">
            <p>© 2024 Savannah College of Art and Design</p>
          </footer>
        </div>
      </div>
    </>
  );
}
