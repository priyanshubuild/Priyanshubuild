"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";

const words = [
  "Hello",
  "Bonjour",
  "स्वागत है",
  "नमस्कार",
  "Ciao",
  "Olá",
  "おい",
  "Hallå",
  "Guten tag"
];

const WordPreloader = ({ onFinish }: { onFinish: () => void }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [closing, setClosing] = useState(false);
  const finishedRef = useRef(false);

  const finish = useCallback(() => {
    if (!finishedRef.current) {
      finishedRef.current = true;
      onFinish();
    }
  }, [onFinish]);

  useEffect(() => {
    if (currentWordIndex < words.length - 1) {
      const timer = setTimeout(() => {
        setCurrentWordIndex((prev) => prev + 1);
      }, 95);
      return () => clearTimeout(timer);
    } else {
      const closingTimer = setTimeout(() => setClosing(true), 120);
      const fallbackTimer = setTimeout(() => finish(), 120 + 550);
      return () => {
        clearTimeout(closingTimer);
        clearTimeout(fallbackTimer);
      };
    }
  }, [currentWordIndex, finish]);

  const handleAnimationEnd = () => {
    if (closing) {
      finish();
    }
  };

  return (
    <>
      <style>{`
        @keyframes shutterUp {
          0% {
            transform: translateY(0%);
          }
          100% {
            transform: translateY(-100%);
          }
        }

        .shutter-panel {
          animation: shutterUp 0.45s cubic-bezier(0.77, 0, 0.175, 1) forwards;
        }
      `}</style>

      <div
        className={`fixed inset-0 bg-[#09090B] z-9999999999 flex items-center justify-center ${closing ? "shutter-panel" : ""}`}
        onAnimationEnd={handleAnimationEnd}
      >
        <p
          role="status"
          aria-live="polite"
          className="text-white text-4xl md:text-6xl tracking-tight transition-opacity duration-300"
        >
          • {words[currentWordIndex]}
        </p>
      </div>
    </>
  );
};

export default WordPreloader;