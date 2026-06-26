import { io } from 'socket.io-client';

const socket = io({          // no URL = current origin
  autoConnect: false,
});

export default socket;