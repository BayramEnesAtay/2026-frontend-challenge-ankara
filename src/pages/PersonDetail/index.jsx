// src/pages/PersonDetail/index.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAllJotformData } from '../../services/api.js';
import { aggregatePeopleData } from '../../utils/jotformParser.js';
import * as S from './styles.js';

export default function PersonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [person, setPerson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Checkins');
  
  const tabs = ['Checkins', 'Messages', 'Sightings', 'Personal Notes', 'Anonymous Tips'];

  // Sayfa yüklendiğinde veriyi çekip URL'deki ID'ye sahip şüpheliyi buluyoruz
  useEffect(() => {
    const loadPersonDetails = async () => {
      setIsLoading(true);
      try {
        const rawMultiData = await fetchAllJotformData();
        const unifiedPeopleList = aggregatePeopleData(rawMultiData);
        
        // URL'den gelen ID ile eşleşen kişiyi bul
        const foundPerson = unifiedPeopleList.find(p => p.id === id);
        
        if (foundPerson) {
          setPerson(foundPerson);
        } else {
          console.error("Kişi bulunamadı!");
        }
      } catch (error) {
        console.error("Detaylar çekilirken hata:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPersonDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4 bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
        <p className="text-slate-500 font-medium animate-pulse">Dosya Çözümleniyor...</p>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-red-600">Dosya Bulunamadı</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-blue-500 underline">Listeye Dön</button>
      </div>
    );
  }

  // Aktif sekmeye ait kayıtları filtrele
  const activeRecords = person.allRecords.filter(record => record.formType === activeTab);


  // --- RİSK ANALİZ ALGORİTMASI ---
  const calculateRiskScore = (records) => {
    let score = 0;
    records.forEach(record => {
      if (record.formType === 'Anonymous Tips') score += 30; // İhbarlar çok şüpheli
      if (record.formType === 'Messages') score += 15;       // Mesajlar orta şüpheli
      if (record.formType === 'Sightings') score += 20;      // Görülmeler orta şüpheli
      if (record.formType === 'Checkins') score += 5;        // Checkin normal aktivite
      if (record.formType === 'Personal Notes') score += 10;
    });
    
    // Skor maksimum 100 olabilir
    return Math.min(score, 100); 
  };

  const riskScore = person ? calculateRiskScore(person.allRecords) : 0;
  
  // Podo'yu isminden tespit ediyoruz (Büyük/küçük harf duyarlılığını kaldırdık)
  const isVictim = person?.name.toLowerCase().includes('podo');

  // Skora göre renk belirleme (Eğer kurbansa Mavi/Mor tonları, Şüpheliyse Kırmızı/Yeşil)
  const getRiskColor = (score) => {
    if (isVictim) return 'bg-indigo-500 text-indigo-400'; // Podo için özel renk
    
    if (score >= 75) return 'bg-red-500 text-red-500';
    if (score >= 40) return 'bg-orange-500 text-orange-500';
    return 'bg-emerald-500 text-emerald-500';
  };


  
 

  return (
    <div className={S.wrapper}>
      
      {/* Üst Profil Alanı */}
      <div className={S.headerCard}>
        <div className={S.headerDecoration}></div>
        
        <button 
          onClick={() => navigate('/')}
          className="text-slate-300 hover:text-white mb-6 text-sm font-semibold flex items-center gap-2 relative z-10 transition-colors"
        >
          ← Listeye Dön
        </button>

        <h2 className={S.headerTitle}>{person.name}</h2>
        <div className="flex gap-4 relative z-10 mt-2">
          <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-sm font-medium border border-slate-700">
            Dosya ID: #{person.id.slice(-6)}
          </span>
          <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-sm font-medium border border-blue-500/30">
            Son Görülme: {person.location}
          </span>
          <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-lg text-sm font-medium border border-orange-500/30">
            Durum: {person.status}
          </span>
        </div>

        {/* YENİ EKLENEN AKILLI ANALİZ ÇUBUĞU */}
        <div className="relative z-10 bg-slate-950/50 p-5 rounded-2xl border border-slate-700/50 backdrop-blur-sm mt-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-slate-300 font-bold text-sm tracking-wide uppercase">
              {isVictim ? 'Kayıp Şahıs İz Yoğunluğu' : 'Yapay Zeka Risk Analizi'}
            </span>
            <span className={`text-2xl font-black ${getRiskColor(riskScore).split(' ')[1]}`}>
              %{riskScore}
            </span>
          </div>
          
          {/* Çubuk (Track) */}
          <div className="w-full bg-slate-800 rounded-full h-3 border border-slate-700 overflow-hidden">
            {/* Dolgu (Fill) */}
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,0,0,0.5)] ${getRiskColor(riskScore).split(' ')[0]}`}
              style={{ width: `${riskScore}%` }}
            ></div>
          </div>
          
          <p className="text-xs text-slate-400 mt-3 font-medium">
            {isVictim 
              ? `* Podo'nun sistemde bıraktığı ${person.allRecords.length} adet dijital ayak izi analiz ediliyor.` 
              : `* Puanlama, şüphelinin ${person.allRecords.length} adet sistem kaydının ağırlığına göre otomatik hesaplanmıştır.`}
          </p>
        </div>
      </div>
      {/* Menü: Form Sekmeleri */}
      <nav className={S.tabContainer}>
        {tabs.map(tab => {
          // O sekmede kaç tane kayıt olduğunu hesapla
          const recordCount = person.allRecords.filter(r => r.formType === tab).length;
          
          return (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                ${S.tabBtnBase} flex items-center gap-2
                ${activeTab === tab ? S.tabActive : S.tabInactive}
              `}
            >
              {tab}
              <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                {recordCount}
              </span>
            </button>
          );
        })}
      </nav>

      {/* İçerik Gösterim Alanı */}
      <div className={S.contentArea}>
        <h3 className={S.contentTitle}>{activeTab} Raporları</h3>
        
        <div className="space-y-4">
          {activeRecords.length === 0 ? (
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 text-center">
              <p className="text-slate-500 font-medium">Bu kategoriye ait herhangi bir kayıt bulunamadı.</p>
            </div>
          ) : (
            // Kayıtları tarihe göre (en yeni en üstte) sıralayıp ekrana basıyoruz
            activeRecords
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((record, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="border-b border-slate-100 pb-3 mb-3 flex justify-between items-center">
                    <p className="text-sm font-bold text-blue-600">
                      Sistem Kaydı: {new Date(record.createdAt).toLocaleString('tr-TR')}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Jotform'dan gelen soru ve cevapları döngüyle basıyoruz */}
                    {Object.values(record.rawDetails).map((ans, i) => {
                      if (!ans.text || !ans.answer) return null; // Boş soruları atla
                      
                      return (
                        <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <span className="block text-xs font-bold text-slate-400 uppercase mb-1">{ans.text}</span>
                          <span className="block text-sm text-slate-800 font-medium">{ans.answer}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
            ))
          )}
        </div>
      </div>
      
    </div>
  );
}