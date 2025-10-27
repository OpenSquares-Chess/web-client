import { useMatchmaking } from "../../../hooks/useMatchmaking";
import { useQueueTimer } from "../../../hooks/useQueueTimer";

interface QueueScreenProps {
  userId: string;
  username: string;
  onMatchFound: (gameId: string) => void;
  onCancel: () => void;
}

export default function QueueScreen({ 
  userId, 
  username, 
  onMatchFound,
  onCancel 
}: QueueScreenProps) {
  const wsUrl = import.meta.env.VITE_MATCHMAKING_WS_URL || 'wss://play.opensquares.xyz/matchmaking';
  
  const { queueState, isConnected, joinQueue, leaveQueue } = useMatchmaking({
    userId,
    wsUrl,
    onMatchFound,
  });

  const { formatTime } = useQueueTimer(queueState.status === 'queuing');

  const handleJoinQueue = () => {
    joinQueue();
  };

  const handleLeaveQueue = () => {
    leaveQueue();
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-lg">
        {/* Connection Status */}
        <div className="mb-6 flex items-center justify-center gap-2">
          <div className={`w-3 h-3 rounded-full ${
            isConnected ? 'bg-green-500' : 'bg-red-500'
          }`} />
          <span className="text-sm text-[#cccccc] opacity-80">
            {isConnected ? 'Connected' : 'Connecting...'}
          </span>
        </div>

        {/* Main Content */}
        <div className="bg-[#2a2a32] rounded-2xl p-8 shadow-xl border border-[#3a3a42]">
          {/* Idle State - Join Queue Button */}
          {queueState.status === 'idle' && (
            <div className="text-center space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-[#eedc97] mb-2">
                  Ready to Play?
                </h2>
                <p className="text-[#cccccc] opacity-80">
                  Join the queue to find an opponent
                </p>
              </div>

              <button
                onClick={handleJoinQueue}
                disabled={!isConnected}
                className="w-full py-4 px-6 bg-[#964d22] hover:bg-[#7f3f1c] text-white text-lg font-semibold rounded-xl shadow-lg shadow-black/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-[#eedc97]/20"
              >
                Find Match
              </button>

              <button
                onClick={onCancel}
                className="w-full py-2 text-[#cccccc] hover:text-[#eedc97] transition-colors"
              >
                Back
              </button>
            </div>
          )}

          {/* Queuing State - Spinner and Timer */}
          {queueState.status === 'queuing' && (
            <div className="text-center space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[#eedc97] mb-2">
                  Finding Opponent
                </h2>
                <p className="text-[#cccccc] opacity-80">
                  Please wait while we match you with a player
                </p>
              </div>

              {/* Spinner */}
              <div className="flex justify-center py-8">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-4 border-[#3a3a42]" />
                  <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-t-[#964d22] border-r-[#964d22] border-b-transparent border-l-transparent animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg 
                      className="w-12 h-12 text-[#eedc97]" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Timer */}
              <div className="space-y-2">
                <div className="text-4xl font-bold text-[#eedc97] font-mono">
                  {formatTime()}
                </div>
                <div className="text-sm text-[#cccccc] opacity-60">
                  Time in queue
                </div>
              </div>

              {/* Leave Queue Button */}
              <button
                onClick={handleLeaveQueue}
                className="w-full py-3 px-6 bg-[#3a3a42] hover:bg-[#4a4a52] text-[#cccccc] font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-[#964d22]/50"
              >
                Leave Queue
              </button>
            </div>
          )}

          {/* Matched State */}
          {queueState.status === 'matched' && (
            <div className="text-center space-y-6">
              <div className="text-6xl">♟️</div>
              <div>
                <h2 className="text-3xl font-bold text-[#eedc97] mb-2">
                  Match Found!
                </h2>
                <p className="text-[#cccccc]">
                  Starting game...
                </p>
              </div>
              <div className="flex justify-center">
                <div className="w-16 h-1 bg-[#964d22] rounded-full animate-pulse" />
              </div>
            </div>
          )}

          {/* Error State */}
          {queueState.status === 'error' && (
            <div className="text-center space-y-6">
              <div className="text-5xl">⚠️</div>
              <div>
                <h2 className="text-2xl font-bold text-red-400 mb-2">
                  Error
                </h2>
                <p className="text-[#cccccc]">
                  {queueState.error || 'An error occurred'}
                </p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 px-6 bg-[#964d22] hover:bg-[#7f3f1c] text-white font-medium rounded-xl transition-colors"
              >
                Retry
              </button>
            </div>
          )}
        </div>

        {/* Player Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-[#cccccc] opacity-60">
            Playing as <span className="text-[#eedc97] font-medium">{username}</span>
          </p>
        </div>
      </div>
    </div>
  );
}