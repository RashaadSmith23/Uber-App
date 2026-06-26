import { useEffect, useRef } from 'react';
import { Marker } from 'react-leaflet';
import L from 'leaflet';

export default function DriverLocationMarker({ position }) {
  const markerRef = useRef(null);

  // Create a custom icon that uses our CSS class
  const pulseIcon = L.divIcon({
    className: '', // clear default styles
    html: '<div class="pulse-dot"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

  // Smoothly move the marker when position updates
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLatLng([position.lat, position.lng]);
    }
  }, [position]);

  return <Marker ref={markerRef} position={[position.lat, position.lng]} icon={pulseIcon} />;
}