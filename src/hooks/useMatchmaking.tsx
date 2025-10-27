import { useState, useEffect, useCallback } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import type { QueueState } from '../types/matchmaking';

interface UseMatchmakingProps {
  userId: string;
  wsUrl: string;
  onMatchFound?: (gameId: string) => void;
}

export function useMatchmaking({ 
  userId, 
  wsUrl, 
  onMatchFound 
}: UseMatchmakingProps) {
  const [queueState, setQueueState] = useState<QueueState>({
    status: 'idle',
    startTime: null,
    matchedGameId: null,
    error: null,
  });

  const { sendMessage, lastMessage, readyState } = useWebSocket(wsUrl, {
    shouldReconnect: () => true,
    reconnectAttempts: 10,
    reconnectInterval: 3000,
  });

  const isConnected = readyState === ReadyState.OPEN;
  const isQueuing = queueState.status === 'queuing';

  // Handle incoming messages
  useEffect(() => {
    if (!lastMessage) return;

    try {
      const data = JSON.parse(lastMessage.data);
      console.log('Matchmaking message:', data);

      switch (data.type) {
        case 'queue_joined':
          setQueueState({
            status: 'queuing',
            startTime: Date.now(),
            matchedGameId: null,
            error: null,
          });
          break;

        case 'match_found':
          setQueueState((prev) => ({
            ...prev,
            status: 'matched',
            matchedGameId: data.gameId,
          }));
          if (data.gameId && onMatchFound) {
            onMatchFound(data.gameId);
          }
          break;

        case 'queue_left':
          setQueueState({
            status: 'idle',
            startTime: null,
            matchedGameId: null,
            error: null,
          });
          break;

        case 'error':
          setQueueState((prev) => ({
            ...prev,
            status: 'error',
            error: data.message || 'An error occurred',
          }));
          break;
      }
    } catch (error) {
      console.error('Failed to parse matchmaking message:', error);
    }
  }, [lastMessage, onMatchFound]);

  const joinQueue = useCallback(() => {
    if (!isConnected || isQueuing) return;

    sendMessage(JSON.stringify({
      type: 'join_queue',
      userId,
    }));
  }, [isConnected, isQueuing, sendMessage, userId]);

  const leaveQueue = useCallback(() => {
    if (!isConnected || !isQueuing) return;

    sendMessage(JSON.stringify({
      type: 'leave_queue',
      userId,
    }));

    setQueueState({
      status: 'idle',
      startTime: null,
      matchedGameId: null,
      error: null,
    });
  }, [isConnected, isQueuing, sendMessage, userId]);

  return {
    queueState,
    isConnected,
    joinQueue,
    leaveQueue,
  };
}