import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; 

export default function MapSection({ sightings, isMultiColor = true }) {
  if (!sightings || sightings.length === 0) return null;

  const center = [sightings[0].lat, sightings[0].lng];

  // Form tiplerine göre renk ataması
  const getColor = (type) => {
    switch (type) {
      case 'Checkins': return '#3b82f6'; // Mavi
      case 'Sightings': return '#10b981'; // Yeşil
      case 'Anonymous Tips': return '#ef4444'; // Kırmızı
      case 'Messages': return '#f59e0b'; // Turuncu
      default: return '#6366f1'; // Indigo
    }
  };

  return (
    // h-[400px] veya h-[500px] vererek haritaya kesin bir yükseklik tanımladık
    <div className="h-[450px] w-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative z-0">
      <MapContainer 
        center={center} 
        zoom={13} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%' }}//parca parca degıl tum gozukmesını sagladık
      >
        <TileLayer 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {sightings.map((point, idx) => (
          <CircleMarker 
            key={idx} 
            center={[point.lat, point.lng]}
            radius={8}
            pathOptions={{ 
              fillColor: isMultiColor ? getColor(point.type) : '#3b82f6', 
              color: 'white', 
              weight: 2, 
              fillOpacity: 0.9 
            }}
          >
            <Popup>
              <div className="font-sans min-w-[120px]">
                <p className="font-bold text-sm border-b pb-1 mb-1" style={{ color: getColor(point.type) }}>
                  {point.type}
                </p>
                <p className="text-xs text-slate-600 font-medium">
                  {new Date(point.date).toLocaleDateString('tr-TR')} - {new Date(point.date).toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}
                </p>
                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">
                  Sistem Kaydı
                </p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}