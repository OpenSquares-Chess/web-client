import { useEffect, useState } from 'react';

interface ChessClockProps {
  initialTime: number;
  isActive: boolean;
  startTimestamp: number;
}

function ChessClock({
  initialTime,
  isActive,
  startTimestamp
}: ChessClockProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    let animationFrameId: number;

    const updateTime = () => {
      const now = performance.now();
      const elapsedSeconds = (now - startTimestamp) / 1000;
      const newTimeLeft = Math.max(0, initialTime - elapsedSeconds);

      setTimeLeft(newTimeLeft);

      if (newTimeLeft > 0) {
        animationFrameId = requestAnimationFrame(updateTime);
      }
    };

    animationFrameId = requestAnimationFrame(updateTime);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isActive, startTimestamp, initialTime]);

  useEffect(() => {
    if (!isActive) {
      setTimeLeft(initialTime);
    }
  }, [initialTime, isActive]);

  const formatTime = (seconds: number): string => {
    if (seconds <= 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    if (seconds >= 10) {
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    const secs = Math.floor((seconds % 60) * 10) / 10;
    return `${mins}:${secs.toFixed(1).padStart(4, '0')}`
  };

  const baseClasses = "rounded-lg border-2 px-2 text-center transition-all duration-200 font-mono";
  const activeClasses = "bg-green-500 border-green-500 text-white shadow-lg scale-105";
  const inactiveClasses = "bg-gray-200 border-gray-400 text-gray-800 opacity-75";

  return (
    <div className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
      <div className="text-lg font-bold tracking-wider">
        {formatTime(timeLeft)}
      </div>
    </div>
  );
};

export default ChessClock;
