// src/pages/PersonDetail/index.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as S from './styles.js';

export default function PersonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Hangi sekmenin (formun) aktif olduğunu tutan state
  const [activeTab, setActiveTab] = useState('Checkins');
  
  // Jotform'daki form isimlerimiz
  const tabs = ['Checkins', 'Messages', 'Sightings', 'Personal Notes', 'Anonymous Tips'];

  // Geri dönüş butonu işlevi
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className={S.wrapper}>
      
      {/* Üst Profil Alanı */}
      <div className={S.headerCard}>
        <div className={S.headerDecoration}></div>
        
        {/* Şık bir geri dönüş butonu */}
        <button 
          onClick={handleGoBack}
          className="text-slate-300 hover:text-white mb-6 text-sm font-semibold flex items-center gap-2 relative z-10 transition-colors"
        >
          ← Listeye Dön
        </button>

        <h2 className={S.headerTitle}>Şüpheli Dosyası #{id}</h2>
        <p className={S.headerSubtitle}>Sistem Kayıt Tarihi: 18.04.2026</p>
      </div>

      {/* Menü: Form Sekmeleri */}
      <nav className={S.tabContainer}>
        {tabs.map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              ${S.tabBtnBase} 
              ${activeTab === tab ? S.tabActive : S.tabInactive}
            `}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* İçerik Gösterim Alanı */}
      <div className={S.contentArea}>
        <h3 className={S.contentTitle}>{activeTab} Kayıtları</h3>
        
        {/* Seçilen sekmeye göre değişecek olan alan. 
            İleride buraya activeTab değerine göre ilgili Jotform yanıtlarını map'leyeceğiz. */}
        <div className="space-y-4">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <p className="text-xs text-blue-600 font-bold tracking-wider mb-2">SİSTEM MESAJI</p>
            <p className="text-slate-700">
              Bu alanda <span className="font-bold">{activeTab}</span> formuna ait Jotform verileri listelenecektir. API bağlandığında bu statik metin yerini dinamik kayıtlara bırakacak.
            </p>
          </div>
        </div>
      </div>
      
    </div>
  );
}