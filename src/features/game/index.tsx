import { useState, useEffect } from 'react'
import { Chessboard } from 'react-chessboard';
import type { PieceDropHandlerArgs } from 'react-chessboard';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { Chess } from 'chess.js';
import type { Square } from 'chess.js';
import GameOverPopup from './GameOverPopup';
import ChessClock from './ChessClock';

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

  // Time sync internals
  const [syncCount, setSyncCount] = useState(0);
  const [offsetSum, setOffsetSum] = useState(0);
  const [syncTime, setSyncTime] = useState(0);
  const [clockOffset, setClockOffset] = useState(0);

  // Player Clock internals
  const [startTime, setStartTime] = useState(0); // also applies to opponent
  const [isActive, setIsActive] = useState(false);
  const [initialTime, setInitialTime] = useState(0);

  // Opponent Clock internals
  const [oppIsActive, setOppIsActive] = useState(false);
  const [oppInitialTime, setOppInitialTime] = useState(0);

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

  const requestTimeSync = () => {
    if (syncCount >= 5) return;
    const message = {
      'type': 'time_sync',
    }
    sendMessage(JSON.stringify(message));
    setSyncTime(performance.now());
  }

  const joinRoom = () => {
    if (gameResult !== null) return;
    console.log(`Joining room ${roomId}`);
    const message = {
      'type': 'join_room',
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
          if(gameResult !== null) return;
          onLeave();
          break;
        case 'token_validated':
          requestTimeSync();
          break;
        case 'time_sync':
          const now = performance.now();
          const offset = (2*data.timestamp - syncTime - now) / 2;
          const offsetSumTemp = offsetSum + offset;
          const syncCountTemp = syncCount + 1;
          console.log(`Clock offset: ${offset}`);
          if (syncCountTemp === 5) {
            setClockOffset(offsetSumTemp / 5);
            console.log(`Avg Clock offset: ${offsetSumTemp / 5}`);
            joinRoom();
          } else {
            requestTimeSync();
          }
          setOffsetSum(offsetSumTemp);
          setSyncCount(syncCountTemp);
          break;
        case 'room_not_active':
          onLeave();
          break;
        case 'invalid_key':
          onLeave();
          break;
        case 'fen':
          setFen(data.fen);
          const whiteToMove = data.fen.split(' ')[1] === 'w';
          setStartTime(data.timestamp - clockOffset);
          if (orientation === 'white') {
            setInitialTime(data.white_time / 1000);
            setIsActive(whiteToMove);
            setOppInitialTime(data.black_time / 1000);
            setOppIsActive(!whiteToMove);
          } else {
            setInitialTime(data.black_time / 1000);
            setIsActive(!whiteToMove);
            setOppInitialTime(data.white_time / 1000);
            setOppIsActive(whiteToMove);
          }
          break;
        case 'color':
          setOrientation(data.color);
          break;
        case 'game_canceled':
          onLeave();
          break;
        case 'game_over':
          let delay: number;
          if (data.timeout) {
            if(isActive) setInitialTime(0);
            if(oppIsActive) setOppInitialTime(0);
            delay = 0;
          } else {
            delay = isActive ? 500 : 0
          }
          setIsActive(false);
          setOppIsActive(false);
          setTimeout(() => {
            setGameResult(data.winner);
          }, delay);
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
    <div className="flex flex-col gap-2 w-[min(73vw,73vh)] mx-auto py-2 px-4 text-center">
      <div className="flex flex-row justify-between items-center">
        <b>Opponent</b>
        <ChessClock
          initialTime={oppInitialTime}
          isActive={oppIsActive}
          startTimestamp={startTime}
        />
      </div><Chessboard options={chessboardOptions} />
      <div className="flex flex-row justify-between items-center">
        <b>You</b>
        <ChessClock
          initialTime={initialTime}
          isActive={isActive}
          startTimestamp={startTime}
        />
      </div>
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
