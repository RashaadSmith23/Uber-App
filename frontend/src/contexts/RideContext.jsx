import { createContext, useContext, useState, useEffect } from 'react';
import { useSocket } from './SocketContext';
import API from '../services/api';

const RideContext = createContext();
export const useRide = () => useContext(RideContext);

export const RideProvider = ({ children }) => {
  const { socket } = useSocket();
  const [trip, setTrip] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);

  useEffect(() => {
    if (!socket) return;
    socket.on('ride:accepted', (data) => {
      setTrip((prev) => ({ ...prev, status: 'accepted', driverId: data.driverId }));
    });
    socket.on('driver:location', (data) => {
      setDriverLocation({ lat: data.lat, lng: data.lng });
    });
    return () => {
      socket.off('ride:accepted');
      socket.off('driver:location');
    };
  }, [socket]);

  const requestRide = async (pickup, dropoff, rideType, fareEstimate) => {
    const { data } = await API.post('/rides/request', {
      pickup_lat: pickup.lat,
      pickup_lng: pickup.lng,
      dropoff_lat: dropoff.lat,
      dropoff_lng: dropoff.lng,
      ride_type: rideType,
      fare_estimate: fareEstimate
    });
    setTrip(data.trip);
    // join trip room
    socket.emit('join:trip', data.trip.id);
    return data;
  };

  const acceptRide = async (tripId) => {
    await API.post(`/rides/${tripId}/accept`);
    // No need to update trip here, socket will handle
  };

  const completeRide = async (tripId) => {
    await API.post(`/rides/${tripId}/complete`);
    setTrip((prev) => ({ ...prev, status: 'completed' }));
  };

  return (
    <RideContext.Provider value={{ trip, driverLocation, requestRide, acceptRide, completeRide, setTrip }}>
      {children}
    </RideContext.Provider>
  );
};