import { useState, useEffect } from 'react'
import { Chessboard } from 'react-chessboard';
import type { PieceDropHandlerArgs } from 'react-chessboard';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { Chess } from 'chess.js';
import type { Square } from 'chess.js';
import GameOverPopup from './GameOverPopup';

interface GameProps {
    token?: string;
    roomId: number | null;
    roomKey: string | null;
    onLeave: () => void;
    onPlayAgain: () => void;
}

function Game({ token, roomId, roomKey, onLeave, onPlayAgain }: GameProps) {
  const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  const [orientation, setOrientation] = useState('white');
  const [gameResult, setGameResult] = useState<string | null>(null);
  const { sendMessage, lastMessage, readyState } = useWebSocket(import.meta.env.VITE_GAME_URL, {
    shouldReconnect: () => true,
  });
  
  const connect = () => {
    if (roomId === null) return;
    if (roomKey === null) return;
    if (token) {
      sendMessage(token);
    }
  }

  const joinRoom = () => {
    if (gameResult !== null) return;
    console.log(`Joining room ${roomId}`);
    const message = {
      'room': roomId,
      'key': roomKey
    }
    sendMessage(JSON.stringify(message));
  }

  useEffect(() => {
    if (readyState === ReadyState.OPEN) connect();
  }, [readyState, roomId, roomKey]);

  useEffect(() => {
    if (lastMessage !== null) {
      const data = JSON.parse(lastMessage.data);
      console.log(data);
      switch (data.type) {
        case 'invalid_token':
          onLeave();
          break;
        case 'token_validated':
          joinRoom();
          break;
        case 'room_not_active':
          onLeave();
          break;
        case 'fen':
          setFen(data.fen);
          break;
        case 'color':
          setOrientation(data.color);
          break;
        case 'game_canceled':
          onLeave();
          break;
        case 'game_over':
          setTimeout(() => {
            setGameResult(data.winner);
          }, 500);
          break;
      }
    }
  }, [lastMessage]);

  function onPieceDrop({
    sourceSquare,
    targetSquare,
  }: PieceDropHandlerArgs) {
    if (targetSquare === null) return false;
    let uci = sourceSquare + targetSquare;
    const chess = new Chess(fen);

    const possibleMoves = chess.moves({
      square: sourceSquare as Square
    });
    if (possibleMoves.some(move => move.includes(`${targetSquare}=`))) {
      uci += 'q';
    }
    
    try {
      chess.move(uci);
    } catch (e) {
      return false;
    }

    sendMessage(uci);
    return true;
  }

  const chessboardOptions = {
    position: fen,
    boardOrientation: orientation as 'white' | 'black',
    onPieceDrop
  };

  return (
    <div className="flex flex-col gap-2 w-[min(80vw,80vh)] mx-auto py-2 px-4 text-center">
      <span className="text-lg font-bold">Room: {roomId}</span>
      <Chessboard options={chessboardOptions} />
      {gameResult !== null && (
        <GameOverPopup
          winner={gameResult}
          onLeave={onLeave}
          onPlayAgain={onPlayAgain}
          whitePlayer={orientation === 'white' ? "You" : "Opponent"}
          blackPlayer={orientation === 'white' ? "Opponent" : "You"}
        />
      )}
    </div>
  )
}

export default Game;
