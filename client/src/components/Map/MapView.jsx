import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

const DEFAULT_CENTER = [40.7128, -74.0060]; // NYC

export default function MapView({ markers, onMapClick, center }) {
  return (
    <MapContainer center={center || DEFAULT_CENTER} zoom={13} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers && markers.map((m, i) => (
        <Marker key={i} position={[m.lat, m.lng]}>
          <Popup>{m.label}</Popup>
        </Marker>
      ))}
      <ClickHandler onMapClick={onMapClick} />
    </MapContainer>
  );
}

function ClickHandler({ onMapClick }) {
  useMap().on('click', (e) => {
    onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
  });
  return null;
}