export type QueueStatus = 'idle' | 'queuing' | 'matched' | 'error';

export interface QueueState {
  status: QueueStatus;
  startTime: number | null;
  matchedGameId: string | null;
  error: string | null;
}

export interface QueueMessage {
  type: 'join_queue' | 'leave_queue' | 'match_found' | 'queue_status';
  userId?: string;
  gameId?: string;
  position?: number;
  estimatedWait?: number;
}