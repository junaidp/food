import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function connectSocket(userId: string): Socket {
  if (socket?.connected) {
    return socket;
  }

  const url = import.meta.env.PROD ? '' : 'http://localhost:3001';
  socket = io(url, {
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    console.log('Socket connected');
    socket?.emit('join', userId);
  });

  return socket;
}

export function getSocket(): Socket | null {
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
