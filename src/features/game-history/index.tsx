import { useEffect, useState } from "react";
import api from "../../api";

type GameResult = "white" | "black" | "draw";

interface GameHistoryItem {
  gameId: string;
  playerOneId: string;
  playerTwoId: string;
  playerOneRating: number;
  playerTwoRating: number;
  date: string;
  pgn: string;
  result: GameResult;
}

interface GameHistoryProps {
  userId: string;
  onBack: () => void;
}

function formatResult(result: GameResult) {
  switch (result) {
    case "white":
      return "1–0";
    case "black":
      return "0–1";
    case "draw":
      return "1/2-1/2";
    default:
      return result;
  }
}

interface PageResponse<T> {
  content: T[];
  totalPages: number;
  number: number;
  size: number;
  totalElements: number;
}

export default function GameHistory({ userId, onBack }: GameHistoryProps) {
  const [games, setGames] = useState<GameHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<PageResponse<GameHistoryItem>>(`/users/${userId}/history`, {
        params: { page: 0, size: 20 },
      })
      .then((response) => {
        setGames(response.data.content);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load game history");
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return <div className="p-4">Loading history...</div>;
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-red-500 mb-2">{error}</p>
        <button
          onClick={onBack}
          className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Game History</h2>
        <button
          onClick={onBack}
          className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
        >
          Back
        </button>
      </div>

      {games.length === 0 ? (
        <p className="text-gray-600">No games played yet.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Players</th>
              <th className="text-left py-2">Result</th>
              <th className="text-left py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {games.map((g) => {
              const isUserWhite = g.playerOneId === userId;
              const isUserBlack = g.playerTwoId === userId;

              const whiteLabel = isUserWhite
                ? `${g.playerOneUsername} (You)`
                : g.playerOneUsername;
              const blackLabel = isUserBlack
                ? `${g.playerTwoUsername} (You)`
                : g.playerTwoUsername;

              const score = formatResult(g.result);

              return (
                <tr key={g.gameId} className="border-b">
                  <td className="py-2">
                    <span className="font-semibold">White:</span> {whiteLabel}
                    <br />
                    <span className="font-semibold">Black:</span> {blackLabel}
                  </td>
                  <td className="py-2">{score}</td>
                  <td className="py-2 text-gray-600">
                    {new Date(g.date).toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
