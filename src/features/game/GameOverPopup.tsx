import { useState } from 'react';

interface GameOverPopupProps {
  winner: 'white' | 'black' | 'draw' | null;
  reason?: string;
  whitePlayer: string;
  blackPlayer: string;
  whiteRating?: number;
  blackRating?: number;
  ratingChange?: {
    white: number;
    black: number;
  };
  onLeave: () => void;
  onPlayAgain: () => void;
}

function GameOverPopup({
  winner,
  reason,
  whitePlayer,
  blackPlayer,
  whiteRating,
  blackRating,
  ratingChange,
  onLeave,
  onPlayAgain,
}: GameOverPopupProps) {
  const [isJoining, setIsJoining] = useState(false);

  const getWinnerText = () => {
    switch (winner) {
      case 'white':
        return 'White Wins!';
      case 'black':
        return 'Black Wins!';
      case 'draw':
        return 'Draw!';
      default:
        return 'Game Over';
    }
  };

  const getWinnerColor = () => {
    switch (winner) {
      case 'white':
        return 'text-gray-800 bg-white border-2 border-gray-300';
      case 'black':
        return 'text-white bg-gray-900 border-2 border-gray-700';
      case 'draw':
        return 'text-gray-700 bg-yellow-100 border-2 border-yellow-300';
      default:
        return 'text-gray-700 bg-gray-100 border-2 border-gray-300';
    }
  };

  const formatRatingChange = (change: number) => {
    if (change === undefined || change === null) return '';
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change}`;
  };

  const playAgain = () => {
    setIsJoining(true);
    onPlayAgain();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto">
        {/* Header */}
        <div className={`px-6 py-4 rounded-t-lg ${getWinnerColor()}`}>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">{getWinnerText()}</h2>
            <button
              onClick={onLeave}
              className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm opacity-90 mt-1">{reason}</p>
        </div>

        {/* Player Stats */}
        <div className="p-6 space-y-4">
          {/* White Player */}
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-white border-2 border-gray-400 rounded-sm"></div>
              <div>
                <div className="font-semibold text-gray-800">{whitePlayer}</div>
                {whiteRating && (
                  <div className="text-sm text-gray-600">
                    {whiteRating}
                    {ratingChange?.white && (
                      <span className={`ml-1 ${ratingChange.white >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ({formatRatingChange(ratingChange.white)})
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            {winner === 'white' && (
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                Winner
              </span>
            )}
          </div>

          {/* Black Player */}
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-gray-800 border-2 border-gray-600 rounded-sm"></div>
              <div>
                <div className="font-semibold text-gray-800">{blackPlayer}</div>
                {blackRating && (
                  <div className="text-sm text-gray-600">
                    {blackRating}
                    {ratingChange?.black && (
                      <span className={`ml-1 ${ratingChange.black >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ({formatRatingChange(ratingChange.black)})
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            {winner === 'black' && (
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                Winner
              </span>
            )}
          </div>

          <button
            onClick={playAgain}
            disabled={isJoining}
            className={`w-full py-2 text-white rounded-md transition ${
              isJoining
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isJoining ? "Joining..." : "Play Again"}
          </button>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 rounded-b-lg border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Thank you for playing!
          </p>
        </div>
      </div>
    </div>
  );
};

export default GameOverPopup;
