import { io } from 'socket.io-client';

// Connect to the backend socket
const socket = io('http://localhost:5000');

// Event handler to join a specific lift room
export const joinLiftRoom = (liftId) => {
  socket.emit('join_lift', liftId);
};

// Event handler to leave a specific lift room
export const leaveLiftRoom = (liftId) => {
  socket.emit('leave_lift', liftId);
};

// Listening for lift data updates
export const listenForLiftUpdates = (liftId, callback) => {
  socket.on('lift_data_update', (data) => {
    if (data && data.id === liftId) {
      callback(data);
    }
  });
};

// Send message to the room
export const sendLiftMessage = (message) => {
  socket.emit('message', message);
};

export default socket;
