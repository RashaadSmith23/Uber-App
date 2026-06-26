import { createContext, useContext, useEffect, useState } from 'react';
import socket from '../services/socket';
import { useAuth } from './AuthContext';

const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (user && !socket.connected) {
      socket.connect();
      socket.on('connect', () => setConnected(true));
      socket.on('disconnect', () => setConnected(false));

      // If driver, emit driver:online to join drivers room
      if (user.role === 'driver') {
        socket.emit('driver:online', user.id);
      }
    }
    return () => {
      // Don't disconnect on unmount, just cleanup listeners
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
};