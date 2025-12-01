import { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { useKeycloak } from '@react-keycloak/web';
import Game from './features/game';
import NewProfile from './features/new-profile';
import Play from './features/play';
import WaitingInQueue from './features/waiting-in-queue';
import api from './api';

function App() {
  const [currentScreen, setCurrentScreen] = useState('play');
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [roomId, setRoomId] = useState<number | null>(null);
  const [roomKey, setRoomKey] = useState<string | null>(null);

  const { keycloak, initialized } = useKeycloak();
  
  useEffect(() => {
    if (initialized && keycloak.authenticated) {
      api.get('/users/self')
      .then((response) => {
        setUsername(response.data.username);
        setProfileImage(response.data.profileImage); 
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setCurrentScreen('create');
        }
      });
    }
  }, [keycloak, initialized])

  if (!initialized) {
    return (
      <div className="w-[min(80vw,80vh)] mx-auto p-4">
        <Chessboard />
      </div>
    )
  }

  if (!keycloak.authenticated) {
    keycloak.login();
    return (
      <div className="w-[min(80vw,80vh)] mx-auto p-4">
        <Chessboard />
      </div>
    )
  }

  const onCreateProfile = (username: string, imageLink: string) => {
    api.post('/users', {
      username: username,
      profileImage: imageLink
    }).then((response) => {
      setUsername(response.data.username);
      setProfileImage(response.data.profileImage);
      setCurrentScreen('play');
    });
  }

  const onJoinQueue = (leaveQueue: () => void) => {
    if (keycloak.token === undefined) return;
    const token = keycloak.token;
    if (socket) {
      socket.close();
      setSocket(null);
    }
    const ws = new WebSocket(`wss://play.opensquares.xyz/queue`);
    ws.onopen = () => {
      ws.send(token);
      setCurrentScreen('waiting-in-queue');
    }
    ws.onmessage = (event) => {
      const { roomId, roomKey } = JSON.parse(event.data);
      setRoomId(+roomId);
      setRoomKey(roomKey);
      setCurrentScreen('game');
      ws.close();
      setSocket(null);
    }
    ws.onerror = () => {
      leaveQueue();
    }
    ws.onclose = () => {
      leaveQueue();
    }
    setSocket(ws);
  }

  const onLeaveQueue= () => {
    socket?.send('leave');
    socket?.close();
    setCurrentScreen('play');
  }

  const onLeaveGame = () => {
    setCurrentScreen('play');
    setRoomId(null);
    setRoomKey(null);
  }
  
  function renderScreen() {
    switch (currentScreen) {
      case 'create':
        return <NewProfile onSubmit={onCreateProfile} />;
      case 'play':
        return <Play onSubmit={onJoinQueue} />;
      case 'waiting-in-queue':
        return <WaitingInQueue onLeave={onLeaveQueue} />;
      case 'game':
        return (
          <Game
            token={keycloak.token}
            roomId={roomId}
            roomKey={roomKey}
            onLeave={onLeaveGame}
          />
        );
      default:
        return null;
    }
  }

  return (
    <>
      <div className='flex justify-end p-4'>
      <div className='flex items-center space-x-2'>
        {profileImage && (
          <img
            src={profileImage}
            alt='Profile'
            className='w-10 h-10 rounded-full object-cover mr-2'
          />
        )}
        <span className='font-semibold text-gray-700 mr-4'>{username}</span>
      </div>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => keycloak.logout()}>Logout</button>
      </div>
      {renderScreen()}
    </>
  )
}

export default App
