import { useState, useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { useRide } from '../contexts/RideContext';
import API from '../services/api';
import MapView from '../components/Map/MapView';

export default function DriverHome() {
  const { socket } = useSocket();
  const { acceptRide, completeRide, trip, setTrip } = useRide();
  const [online, setOnline] = useState(false);
  const [incomingRequest, setIncomingRequest] = useState(null);

  useEffect(() => {
    if (!socket) return;
    socket.on('ride:request', (data) => {
      setIncomingRequest(data);
    });
    return () => socket.off('ride:request');
  }, [socket]);

  const goOnline = async () => {
    await API.put('/drivers/status', { online: true });
    setOnline(true);
    socket.emit('driver:online', 'your-driver-id'); // use actual user id
  };

  const handleAccept = async () => {
    if (!incomingRequest) return;
    await acceptRide(incomingRequest.tripId);
    setTrip(incomingRequest); // local tracking
    setIncomingRequest(null);
  };

  return (
    <div className="driver-home">
      <MapView markers={trip ? [
        { lat: trip.pickup.lat, lng: trip.pickup.lng, label: 'Pickup' },
        { lat: trip.dropoff.lat, lng: trip.dropoff.lng, label: 'Dropoff' }
      ] : []} />
      {!online ? (
        <button onClick={goOnline}>Go Online</button>
      ) : (
        <>
          {incomingRequest && (
            <div className="request-popup">
              <h4>New Ride Request</h4>
              <p>Pickup: {incomingRequest.pickup.lat}, {incomingRequest.pickup.lng}</p>
              <p>Fare: ${incomingRequest.fare}</p>
              <button onClick={handleAccept}>Accept</button>
              <button onClick={() => setIncomingRequest(null)}>Decline</button>
            </div>
          )}
          {trip && (
            <div className="active-trip">
              <button onClick={() => completeRide(trip.id)}>Complete Trip</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}