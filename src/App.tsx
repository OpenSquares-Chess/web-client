import useWebSocket, { ReadyState } from "react-use-websocket";

function App() {
  const { sendMessage, lastMessage, readyState } = useWebSocket("ws://localhost:8080");

  return (
    <div>
      <h1>Chess Client</h1>
      <p>Connection status: {ReadyState[readyState]}</p>
      <button onClick={() => sendMessage(JSON.stringify({ room: 0, uuid: "test-user" }))}>
        Join Room
      </button>
      <div>
        <p>Last message: {lastMessage ? lastMessage.data : "No messages yet"}</p>
      </div>
    </div>
  );
}

export default App;

