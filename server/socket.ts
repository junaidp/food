import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';

let io: Server;

export function initSocket(httpServer: HttpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log('Client connected:', socket.id);

    // User joins their personal room
    socket.on('join', (userId: string) => {
      socket.join(`user_${userId}`);
      console.log(`User ${userId} joined room user_${userId}`);
    });

    // Join claim tracking room (for live location)
    socket.on('join_claim', (claimId: string) => {
      socket.join(`claim_${claimId}`);
    });

    // Location update for live tracking during pickup
    socket.on('location_update', (data: { userId: string; claimId: string; latitude: number; longitude: number }) => {
      socket.to(`claim_${data.claimId}`).emit('location_updated', {
        userId: data.userId,
        latitude: data.latitude,
        longitude: data.longitude,
      });
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
}

export function getIO(): Server {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
}
