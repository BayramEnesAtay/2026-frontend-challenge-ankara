// src/components/GuessModal/index.jsx
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';

const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({ click(e) { setPosition(e.latlng); } });
  return position === null ? null : <Marker position={position}></Marker>;
};

export default function GuessModal({ isOpen, onClose, suspects }) {
  const navigate = useNavigate();
  const [selectedSuspect, setSelectedSuspect] = useState('');
  const [guessPosition, setGuessPosition] = useState(null);
  const [gameState, setGameState] = useState('playing'); // 'playing', 'success', 'failed'
  const [distance, setDistance] = useState(null);

  if (!isOpen) return null;

  // HEDEF VERİLERİ
  const TARGET = {
    suspect: "kağan",
    lat: 39.9392,
    lng: 32.8643, // Ankara Kalesi
    radius: 1.5 // 1.5 km tolerans
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
  };

  const handleVerify = () => {
    if (!selectedSuspect || !guessPosition) return;

    const d = calculateDistance(TARGET.lat, TARGET.lng, guessPosition.lat, guessPosition.lng);
    setDistance(d);

    if (selectedSuspect.toLowerCase() === TARGET.suspect && d <= TARGET.radius) {
      setGameState('success');
    } else {
      setGameState('failed');
    }
  };

  // OYUN SONU: TEBRİKLER EKRANI
  if (gameState === 'success') {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950 p-6 text-center animate-in fade-in duration-500">
        <div className="max-w-md w-full">
          <div className="text-8xl mb-6">🎉</div>
          <h1 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">Operasyon Başarılı!</h1>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Harika iş çıkardın dedektif! <span className="text-white font-bold">Kağan</span> kıskıvrak yakalandı ve Podo, <span className="text-white font-bold">Ankara Kalesi</span> civarında sağ salim bulundu. Hedefe sadece {distance.toFixed(2)} km mesafedeydin.
          </p>
          <button 
            onClick={() => {
              setGameState('playing');
              navigate('/'); // Başlangıç ekranına dön
            }}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 transition-all"
          >
            YENİ GÖREVE BAŞLA
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-white/20">
        
        <div className="bg-slate-900 p-8 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Hedef Tespiti</h2>
            <p className="text-slate-400 text-sm font-medium">Kanıtları birleştir ve operasyonu başlat.</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white text-4xl font-light transition-colors">&times;</button>
        </div>

        <div className="p-8 space-y-6">
          {gameState === 'failed' && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 animate-bounce">
              <span className="text-xl">⚠️</span>
              <p className="text-red-700 text-sm font-bold">İstihbarat Hatalı! Fail veya Lokasyon uyuşmuyor. Tekrar dene.</p>
            </div>
          )}

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Faili Belirle</label>
            <select 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
              value={selectedSuspect}
              onChange={(e) => {
                setSelectedSuspect(e.target.value);
                setGameState('playing');
              }}
            >
              <option value="">-- Şüpheli Seç --</option>
              {suspects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Lokasyonu İşaretle (Ankara)</label>
            <div className="h-[250px] w-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
              <MapContainer center={[39.93, 32.85]} zoom={11} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationMarker position={guessPosition} setPosition={(pos) => {
                  setGuessPosition(pos);
                  setGameState('playing');
                }} />
              </MapContainer>
            </div>
          </div>

          <button 
            onClick={handleVerify}
            disabled={!selectedSuspect || !guessPosition}
            className="w-full py-5 bg-red-600 hover:bg-red-500 disabled:bg-slate-200 text-white font-black rounded-2xl shadow-lg shadow-red-600/20 transition-all uppercase tracking-widest"
          >
            Operasyonu Başlat
          </button>
        </div>
      </div>
    </div>
  );
}