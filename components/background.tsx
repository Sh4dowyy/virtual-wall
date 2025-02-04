"use client"

import { Heart, Stethoscope, Flower2 } from "lucide-react"

const Background = () => {
  return (
    <div className="fixed inset-0 bg-light-pink z-[-1]">
      {/* Animated background patterns */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute w-full h-full animate-float-slow">
          {Array.from({ length: 15 }).map((_, i) => (
            <Heart
              key={`heart-${i}`}
              className="absolute text-rose-400"
              size={40}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                transform: `scale(${1 + Math.random()})`,
                opacity: 0.7 + Math.random() * 0.3,
              }}
            />
          ))}
        </div>
        <div className="absolute w-full h-full animate-float-slower">
          {Array.from({ length: 8 }).map((_, i) => (
            <Stethoscope
              key={`stethoscope-${i}`}
              className="absolute text-blue-400"
              size={48}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                transform: `scale(${1 + Math.random()})`,
                opacity: 0.6 + Math.random() * 0.4,
              }}
            />
          ))}
        </div>
        <div className="absolute w-full h-full animate-float">
          {Array.from({ length: 12 }).map((_, i) => (
            <Flower2
              key={`flower-${i}`}
              className="absolute text-purple-400"
              size={36}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                transform: `scale(${0.8 + Math.random() * 0.5})`,
                opacity: 0.6 + Math.random() * 0.4,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Background;