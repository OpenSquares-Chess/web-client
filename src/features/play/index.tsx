import { useState } from "react";

interface PlayProps {
    onSubmit: (leaveQueue: () => void) => void;
}

function Play({ onSubmit }: PlayProps) {
  const [isJoining, setIsJoining] = useState(false);

  const joinQueue = () => {
    setIsJoining(true);
    onSubmit(() => {
      setIsJoining(false);
    });
  };

  return (
    <div className="flex items-center justify-center">
      <div className="max-w-sm w-full bg-white border border-gray-200 rounded-lg shadow-lg p-6 text-center">
        <h2 className="text-2xl font-semibold mb-3">Ready to Play?</h2>
        <p className="text-gray-600 mb-6">Find your next chess opponent.</p>
        <button
          onClick={joinQueue}
          disabled={isJoining}
          className={`w-full py-2 text-white rounded-md transition ${
            isJoining
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isJoining ? "Joining..." : "Play"}
        </button>
      </div>
    </div>
  );
}

export default Play;
