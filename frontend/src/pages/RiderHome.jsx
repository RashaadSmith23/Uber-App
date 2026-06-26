import { useState } from 'react';
import MapView from '../components/Map/MapView';
import RideSelector from '../components/RideSelector';
import { useRide } from '../contexts/RideContext';
import { useSocket } from '../contexts/SocketContext';
import DriverLocationMarker from '../components/Map/DriverLocationMarker';

export default function RiderHome() {
  const [pickup, setPickup] = useState(null);
  const [dropoff, setDropoff] = useState(null);
  const [step, setStep] = useState('select'); // select, confirm, tracking, rating
  const { trip, driverLocation, requestRide } = useRide();

  const handleMapClick = (coords) => {
    if (!pickup) setPickup(coords);
    else if (!dropoff) setDropoff(coords);
  };

  const handleRequest = async (rideType, fare) => {
    if (!pickup || !dropoff) return;
    await requestRide(pickup, dropoff, rideType, fare);
    setStep('tracking');
  };

  return (
    <div className="rider-home">
      <MapView
        markers={[
          pickup && { lat: pickup.lat, lng: pickup.lng, label: 'Pickup' },
          dropoff && { lat: dropoff.lat, lng: dropoff.lng, label: 'Dropoff' },
          driverLocation && { lat: driverLocation.lat, lng: driverLocation.lng, label: 'Driver' }
        ].filter(Boolean)}
        onMapClick={handleMapClick}
      />
      {step === 'select' && (
        <div className="overlay">
          {!pickup ? <p>Tap to set pickup</p> : !dropoff ? <p>Tap to set dropoff</p> : (
            <RideSelector onRequest={handleRequest} />
          )}
        </div>
      )}
      {step === 'tracking' && (
        <div className="overlay tracking">
          <h3>Finding your driver...</h3>
          {driverLocation && <DriverLocationMarker position={driverLocation} />}
        </div>
      )}
    </div>
  );
}