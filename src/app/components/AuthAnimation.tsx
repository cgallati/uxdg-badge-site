'use client';

import { useState, useEffect } from 'react';

interface AuthAnimationProps {
  onComplete: () => void;
}

type AnimationPhase = 'verifying' | 'accessing' | 'granted';

export default function AuthAnimation({ onComplete }: AuthAnimationProps) {
  const [phase, setPhase] = useState<AnimationPhase>('verifying');
  const [progress, setProgress] = useState(0);

  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const phaseTimings = {
      verifying: 3000,   // 3 seconds
      accessing: 2500,   // 2.5 seconds
      granted: 3000      // 3 seconds, then fade
    };

    let progressInterval: NodeJS.Timeout;
    let phaseTimeout: NodeJS.Timeout;

    const startPhase = (currentPhase: AnimationPhase) => {
      // Only run progress animation for phases that need it
      if (currentPhase !== 'granted') {
        setProgress(0);
        
        // Progress bar animation
        progressInterval = setInterval(() => {
          setProgress(prev => {
            if (prev >= 100) {
              clearInterval(progressInterval);
              return 100;
            }
            return prev + (100 / (phaseTimings[currentPhase] / 50));
          });
        }, 50);
      }

      // Phase transition
      phaseTimeout = setTimeout(() => {
        clearInterval(progressInterval);
        
        switch (currentPhase) {
          case 'verifying':
            setPhase('accessing');
            break;
          case 'accessing':
            setPhase('granted');
            break;
          case 'granted':
            // Start fade out and call onComplete after fade duration
            setIsComplete(true);
            setTimeout(() => {
              onComplete();
            }, 1000); // 1 second fade duration
            break;
        }
      }, phaseTimings[currentPhase]);
    };

    startPhase(phase);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(phaseTimeout);
    };
  }, [phase, onComplete]);

  const getPhaseConfig = (currentPhase: AnimationPhase) => {
    switch (currentPhase) {
      case 'verifying':
        return {
          title: 'VERIFYING IDENTITY',
          subtitle: 'Checking badge authorization...',
          icon: (
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 border-6 md:border-8 border-yellow-500 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-3 md:inset-4 w-18 h-18 md:w-24 md:h-24 bg-yellow-500 rounded-full animate-pulse"></div>
            </div>
          ),
          color: 'yellow'
        };
      case 'accessing':
        return {
          title: 'ACCESSING SYSTEM',
          subtitle: 'Establishing secure connection...',
          icon: (
            <div className="flex space-x-2 md:space-x-3">
              <div className="w-4 h-16 md:w-6 md:h-24 bg-orange-500 animate-pulse" style={{ animationDelay: '0ms' }}></div>
              <div className="w-4 h-16 md:w-6 md:h-24 bg-orange-500 animate-pulse" style={{ animationDelay: '150ms' }}></div>
              <div className="w-4 h-16 md:w-6 md:h-24 bg-orange-500 animate-pulse" style={{ animationDelay: '300ms' }}></div>
              <div className="w-4 h-16 md:w-6 md:h-24 bg-orange-500 animate-pulse" style={{ animationDelay: '450ms' }}></div>
            </div>
          ),
          color: 'orange'
        };
      case 'granted':
        return {
          title: 'ACCESS GRANTED',
          subtitle: 'Welcome to SCAD UX Design',
          icon: (
            <div className="w-24 h-24 md:w-32 md:h-32 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 md:w-16 md:h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={3} 
                  d="M5 13l4 4L19 7"
                  style={{
                    strokeDasharray: '24',
                    strokeDashoffset: '24',
                    animation: 'drawCheck 1s ease-out 0.5s forwards'
                  }}
                />
              </svg>
              <style jsx>{`
                @keyframes drawCheck {
                  to {
                    stroke-dashoffset: 0;
                  }
                }
              `}</style>
            </div>
          ),
          color: 'green'
        };
      default:
        return {
          title: '',
          subtitle: '',
          icon: null,
          color: 'green'
        };
    }
  };

  const config = getPhaseConfig(phase);
  const progressColor = {
    yellow: 'bg-yellow-500',
    orange: 'bg-orange-500',
    green: 'bg-green-500'
  }[config.color];

  return (
    <div className={`fixed inset-0 bg-black z-50 flex items-center justify-center transition-opacity duration-1000 ${isComplete ? 'opacity-0' : 'opacity-100'}`}>
      <div className="text-center text-white w-full max-w-lg mx-auto px-8 md:px-12 flex flex-col justify-center min-h-screen">
        {/* UXDG Header - Fixed height */}
        <div className="h-24 md:h-32 flex flex-col justify-center mb-8 md:mb-12">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-2">UXDG</h1>
          <p className="text-lg md:text-xl text-gray-400">SECURITY AUTHORIZATION</p>
        </div>

        {/* Animation Icon - Fixed height */}
        <div className="h-24 md:h-32 flex justify-center items-center mb-8 md:mb-12">
          {config.icon}
        </div>

        {/* Phase Title - Fixed height */}
        <div className="h-32 md:h-40 flex flex-col justify-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 md:mb-6">{config.title}</h2>
          <p className="text-gray-400 text-lg md:text-xl">{config.subtitle}</p>
        </div>

        {/* Progress Bar Section - Fixed height to prevent layout shift */}
        <div className="h-16 md:h-20 flex flex-col justify-center">
          {phase !== 'granted' && (
            <>
              <div className="w-full bg-gray-800 rounded-full h-3 md:h-4 mb-6">
                <div 
                  className={`h-3 md:h-4 rounded-full transition-all duration-100 ease-out ${progressColor}`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              {/* Progress Text */}
              <p className="text-sm md:text-base text-gray-500 font-mono">
                {Math.round(progress)}% COMPLETE
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}