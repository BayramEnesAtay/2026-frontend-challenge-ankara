// src/components/GuessModal/index.jsx
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Harita tıklamalarını yakalayan ufak bileşen
const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return position === null ? null : <Marker position={position}></Marker>;
};

export default function GuessModal({ isOpen, onClose, suspects }) {
  const [selectedSuspect, setSelectedSuspect] = useState('');
  const [guessPosition, setGuessPosition] = useState(null);
  const [result, setResult] = useState(null);

  if (!isOpen) return null;

  // --- OYUNUN GİZLİ KURALLARI ---
  const SECRET_SUSPECT = "kağan"; // Küçük harfle yazıyoruz kontrol için
  const SECRET_LOCATION = { lat: 39.9392, lng: 32.8643 }; // Ankara Kalesi
  const SUCCESS_RADIUS_KM = 2; // 2 Km yakınına tıklarsa kabul et

  // Haversine Formülü: Dünya üzerindeki iki nokta arası gerçek kuş uçuşu mesafe (KM)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c; 
  };

  const handleVerify = () => {
    if (!selectedSuspect || !guessPosition) {
      setResult({ status: 'error', message: 'Lütfen hem faili seçin hem de haritadan lokasyon işaretleyin.' });
      return;
    }

    const distance = calculateDistance(SECRET_LOCATION.lat, SECRET_LOCATION.lng, guessPosition.lat, guessPosition.lng);
    const isSuspectCorrect = selectedSuspect.toLowerCase().trim() === SECRET_SUSPECT;
    const isLocationCorrect = distance <= SUCCESS_RADIUS_KM;

    if (isSuspectCorrect && isLocationCorrect) {
      setResult({ 
        status: 'success', 
        message: `GÖREV BAŞARILI! Fail Kağan tespit edildi ve Podo, hedef noktanın ${distance.toFixed(1)} km yakınında sağ olarak bulundu.` 
      });
    } else if (!isSuspectCorrect && isLocationCorrect) {
      setResult({ status: 'warning', message: `LOKASYON DOĞRU, FAİL YANLIŞ! Hedefi buldunuz ama masum birini suçluyorsunuz.` });
    } else if (isSuspectCorrect && !isLocationCorrect) {
      setResult({ status: 'warning', message: `FAİL DOĞRU, LOKASYON YANLIŞ! Kağan'ın arkasında olduğu kesin ama hedef bölgeden ${distance.toFixed(1)} km uzaktasınız.` });
    } else {
      setResult({ status: 'failed', message: `GÖREV BAŞARISIZ! Tamamen yanlış iz üzerindesiniz.` });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Başlık */}
        <div className="bg-slate-900 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black text-white tracking-widest uppercase">Çözümü Bildir</h2>
            <p className="text-slate-400 text-sm">Elde ettiğiniz istihbarat verilerini doğrulayın.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-3xl font-light">&times;</button>
        </div>

        <div className="p-6 overflow-y-auto">
          {/* Adım 1: Faili Seç */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-700 uppercase mb-2">1. Birinci Derece Şüpheli (Fail)</label>
            <select 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedSuspect}
              onChange={(e) => setSelectedSuspect(e.target.value)}
            >
              <option value="">-- Listeden Şüpheli Seçin --</option>
              {suspects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Adım 2: Haritada İşaretle */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-700 uppercase mb-2">2. Podo'nun Saklandığı Lokasyon (Haritaya Tıkla)</label>
            <div className="h-[300px] w-full rounded-xl overflow-hidden border-2 border-slate-200">
              <MapContainer center={[39.9208, 32.8541]} zoom={11} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationMarker position={guessPosition} setPosition={setGuessPosition} />
              </MapContainer>
            </div>
            {guessPosition && (
              <p className="text-xs text-blue-600 mt-2 font-bold">📍 Koordinat Kilitlendi: {guessPosition.lat.toFixed(4)}, {guessPosition.lng.toFixed(4)}</p>
            )}
          </div>

          {/* Sonuç Ekranı */}
          {result && (
            <div className={`p-4 rounded-xl mb-6 border font-bold ${
              result.status === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
              result.status === 'warning' ? 'bg-orange-50 text-orange-700 border-orange-200' :
              result.status === 'failed' ? 'bg-red-50 text-red-700 border-red-200' :
              'bg-slate-50 text-slate-700 border-slate-200'
            }`}>
              {result.message}
            </div>
          )}
        </div>

        {/* Butonlar */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
          <button onClick={onClose} className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-200 rounded-xl transition-colors">İptal Et</button>
          <button 
            onClick={handleVerify}
            className="px-8 py-3 font-black text-white bg-red-600 hover:bg-red-500 rounded-xl shadow-lg shadow-red-600/30 transition-colors uppercase tracking-wider"
          >
            Karargaha İlet
          </button>
        </div>

      </div>
    </div>
  );
}