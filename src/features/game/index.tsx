import { useState, useEffect } from 'react'
import { Chessboard } from 'react-chessboard';
import type { PieceDropHandlerArgs } from 'react-chessboard';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { Chess } from 'chess.js';
import type { Square } from 'chess.js';

function Game() {
  const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  const [orientation, setOrientation] = useState('white');
  const [room, setRoom] = useState(0);
  const { sendMessage, lastMessage, readyState } = useWebSocket('wss://play.opensquares.xyz', {
    shouldReconnect: () => true,
    heartbeat: {
      message: 'ping',
      returnMessage: 'pong',
      timeout: 50000,
      interval: 20000,
    },
  });

  function connect() {
      console.log(`Connecting to room ${room}`);
      const message = {
          'room': room,
          'uuid': 'test'
      }
      sendMessage(JSON.stringify(message));
  }

  useEffect(() => {
    if (readyState === ReadyState.OPEN) connect();
  }, [readyState, room]);

  useEffect(() => {
    if (lastMessage !== null) {
      if (lastMessage.data === 'pong') return;
      const data = JSON.parse(lastMessage.data);
      console.log(data);
      switch (data.type) {
        case 'fen':
          setFen(data.fen);
          break;
        case 'color':
          setOrientation(data.color);
          break;
        case 'room_full':
          setRoom(prevRoom => (prevRoom + 1) % 10);
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
      <span className="text-lg font-bold">Room: {room}</span>
      <Chessboard options={chessboardOptions} />
    </div>
  )
}

export default Game;
