'use client';

import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for missing marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: typeof window !== 'undefined' ? require('leaflet/dist/images/marker-icon-2x.png') : '',
  iconUrl: typeof window !== 'undefined' ? require('leaflet/dist/images/marker-icon.png') : '',
  shadowUrl: typeof window !== 'undefined' ? require('leaflet/dist/images/marker-shadow.png') : '',
});

const Map = () => {
  return (
    <MapContainer center={[59.39543670246066, 24.66422566060926]} zoom={16} scrollWheelZoom={true} style={{ height: '500px', width: '800px' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[59.39543670246066, 24.66422566060926]}>
        <Popup>I study here!</Popup>
      </Marker>

    </MapContainer>
  );
};

export default Map;
