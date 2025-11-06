import { useEffect, useState } from "react";

interface WaitingInQueueProps {
    onLeave: () => void;
}

export default function WaitingInQueue({ onLeave }: WaitingInQueueProps) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const secs = (time % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <div className="flex items-center justify-center">
      <div className="max-w-sm w-full bg-white border border-gray-200 rounded-lg shadow-lg p-6 text-center">
        <h2 className="text-2xl font-semibold mb-3">Searching for Opponent...</h2>
        <p className="text-gray-600 mb-4">
          You've been waiting for {formatTime(seconds)}.
        </p>
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <button
          onClick={onLeave}
          className="w-full py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          Leave Queue
        </button>
      </div>
    </div>
  );
}
