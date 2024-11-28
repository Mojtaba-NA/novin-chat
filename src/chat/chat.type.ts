import type { JWTPayload } from '@/lib/jwt/auth.middleware';
import type { Socket } from 'socket.io';

export interface AuthSocket extends Socket {
  user: JWTPayload;
}

export const SUBSCRIBE = <const>{
  JOIN_ROOM: 'room.join',
  LEAVE_ROOM: 'room.leave',
  CREATE_MESSAGE: 'message.create',
};

export const EMIT = <const>{
  NEW_MESSAGE: 'message.new',
};
