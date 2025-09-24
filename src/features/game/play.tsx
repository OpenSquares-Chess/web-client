import React, { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

const Play: React.FC = () => {
  const [username, setUsername] = useState("Guest");
  const [status, setStatus] = useState("Disconnected");
  const [color, setColor] = useState("WHITE");
  const [game, setGame] = useState(new Chess());

  useEffect(() => {
    // Get username from localStorage
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }

    // Simulate WebSocket connection
    const timer = setTimeout(() => {
      setStatus("Connected");
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Handle piece moves
  const onDrop = (sourceSquare: string, targetSquare: string) => {
    const gameCopy = new Chess(game.fen());
    const move = gameCopy.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // auto promote to queen
    });
    if (move === null) return false; // illegal move
    setGame(gameCopy);
    return true;
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        background: "linear-gradient(135deg, #f0d9b5, #b58863)",
        padding: "20px",
      }}
    >
      {/* Title */}
      <h1
        style={{
          fontSize: "2.5rem",
          fontWeight: "bold",
          marginBottom: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ fontSize: "2rem", marginRight: "10px" }}>♟</span> Game
        Room
      </h1>

      {/* Player Info */}
      <p style={{ fontSize: "1.2rem" }}>
        Welcome, <strong>{username}</strong> 🎉
      </p>
      <p style={{ fontSize: "1rem" }}>
        WebSocket Status:{" "}
        <span
          style={{
            color: status === "Connected" ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          {status}
        </span>
      </p>
      <p style={{ fontSize: "1.1rem" }}>
        You are playing as:{" "}
        <strong style={{ color: color === "WHITE" ? "blue" : "black" }}>
          {color}
        </strong>
      </p>

      {/* Chessboard */}
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Chessboard
          position={game.fen()}
          onPieceDrop={onDrop}
          boardWidth={500}
        />
      </div>
    </div>
  );
};

export default Play;

