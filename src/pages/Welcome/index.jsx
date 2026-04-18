// src/pages/Welcome/index.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Arka plan siber güvenlik radar efekti */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
      
      <div className="relative z-10 max-w-2xl text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest mb-8 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
          JotForm Gizli
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6">
          OPERASYON: <br/><span className="text-blue-500">PODO</span>
        </h1>
        
        <p className="text-slate-400 text-lg md:text-xl font-medium mb-10 leading-relaxed">
          Sistemlerimize yetkisiz erişim sağlandı. Dijital izler, şüphelinin Ankara sınırları içinde olduğunu gösteriyor. Göreviniz; istihbarat panelini kullanarak <span className="text-white font-bold">faili tespit etmek</span> ve kurbanın tutulduğu <span className="text-white font-bold">gizli lokasyonu</span> bulmaktır.
        </p>

        <button 
          onClick={() => navigate('/panel')} // Burası ana panelimize gidecek
          className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg rounded-2xl transition-all duration-300 shadow-[0_0_40px_rgba(37,99,235,0.4)] hover:shadow-[0_0_60px_rgba(37,99,235,0.6)] hover:-translate-y-1"
        >
          <span className="flex items-center gap-3">
            Sisteme Giriş Yap 
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </span>
        </button>
      </div>

      <div className="absolute bottom-8 text-slate-600 text-xs font-bold tracking-widest">
        TÜRKİYE CUMHURİYETİ İSTİHBARAT AĞI © 2026
      </div>
    </div>
  );
}