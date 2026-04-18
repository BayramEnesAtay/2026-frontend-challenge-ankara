// src/pages/PeopleList/index.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllJotformData } from '../../services/api.js';
import { aggregatePeopleData } from '../../utils/jotformParser.js';
import useDebounce from '../../hooks/useDebounce.js';
import GuessModal from '../../components/GuessModal';

export default function PeopleList() {
  const [people, setPeople] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGuessModalOpen, setIsGuessModalOpen] = useState(false);
  // Arama ve Filtreleme Stateleri
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tümü');
  const [locationFilter, setLocationFilter] = useState('Tümü'); // YENİ: Konum Filtresi

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const rawMultiData = await fetchAllJotformData();
        const unifiedPeopleList = aggregatePeopleData(rawMultiData);
        setPeople(unifiedPeopleList);
      } catch (error) {
        console.error("Hata:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // YENİ: Jotform'dan gelen verilerdeki tüm benzersiz KONUMLARI bul
  const availableLocations = useMemo(() => {
    const locations = new Set(people.map(p => p.location));
    return ['Tümü', ...Array.from(locations).filter(Boolean)];
  }, [people]);

  // Statüleri bul
  const availableStatuses = useMemo(() => {
    const statuses = new Set(people.map(p => p.status));
    return ['Tümü', ...Array.from(statuses).filter(Boolean)];
  }, [people]);

  // Debounce edilmiş kelimeye, statüye ve KONUMA göre filtrele
  const filteredPeople = useMemo(() => {
    return people.filter(person => {
      const matchesSearch = person.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'Tümü' || person.status === statusFilter;
      const matchesLocation = locationFilter === 'Tümü' || person.location === locationFilter;
      
      return matchesSearch && matchesStatus && matchesLocation;
    });
  }, [people, debouncedSearchTerm, statusFilter, locationFilter]);

  // ŞOV ANI: SKELETON KART BİLEŞENİ (Yüklenirken Gösterilecek)
  const SkeletonCard = () => (
    <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl flex flex-col h-full animate-pulse">
      <div className="flex justify-between items-start mb-6">
        <div className="w-14 h-14 rounded-2xl bg-slate-800"></div>
        <div className="w-20 h-6 bg-slate-800 rounded-lg"></div>
      </div>
      <div className="w-3/4 h-6 bg-slate-800 rounded mb-4"></div>
      <div className="w-1/2 h-4 bg-slate-800 rounded mb-3"></div>
      <div className="w-1/3 h-3 bg-slate-800 rounded mt-auto"></div>
      <div className="w-full h-11 bg-slate-800/50 rounded-xl mt-6"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-slate-50 to-slate-200 p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* ÜST PANEL: Başlık ve Filtreler */}
        <header className="mb-12 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 bg-white/60 p-6 rounded-3xl border border-white/80 shadow-sm backdrop-blur-md">
          <div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight">Podo Takip Paneli</h1>
            <p className="text-slate-500 font-medium mt-1">
              Filtrelenen Dosyalar: <span className="text-blue-600 font-bold">{filteredPeople.length}</span> / {people.length}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap gap-4 w-full xl:w-auto">
            {/* Arama Kutusu */}
            <div className="relative group flex-1 sm:min-w-[250px]">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">🔍</span>
              <input 
                type="text" 
                placeholder="Şüpheli veya kurban ara..." 
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-700 shadow-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* YENİ: Konum Filtresi */}
            <div className="relative flex-1 sm:min-w-[180px]">
              <select 
                className="w-full appearance-none pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-700 shadow-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all cursor-pointer"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              >
                {availableLocations.map(loc => (
                  <option key={loc} value={loc}>📍 {loc}</option>
                ))}
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">▼</span>
            </div>

            {/* Statü Filtresi */}
            <div className="relative flex-1 sm:min-w-[180px]">
              <select 
                className="w-full appearance-none pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-700 shadow-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {availableStatuses.map(status => (
                  <option key={status} value={status}>🏷️ {status}</option>
                ))}
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">▼</span>
            </div>
          </div>
          <button 
            onClick={() => setIsGuessModalOpen(true)}
            className="bg-red-600 hover:bg-red-500 text-white font-black px-6 py-3 rounded-2xl shadow-lg shadow-red-600/30 transition-all uppercase tracking-widest text-sm">
          🚨 Hedefi Tespit Et
          </button>
        </header>

        {/* İÇERİK ALANI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            // Ekrana dönecek bir çark basmak yerine, 8 tane skeleton kartı basıyoruz
            Array.from({ length: 8 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          ) : filteredPeople.length > 0 ? (
            filteredPeople.map(person => (
              // YENİ KART TASARIMI: Koyu Tema (Slate-900) ve Renkli Vurgular
              <div key={person.id} className="group relative bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col h-full">
                
                {/* Kart içi hafif mavi parlama efekti */}
                <div className="absolute -right-12 -top-12 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-500 pointer-events-none"></div>

                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-900/50">
                    {person.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-slate-700">
                    {person.status}
                  </span>
                </div>
                
                <div className="relative z-10 flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 truncate" title={person.name}>
                    {person.name}
                  </h3>
                  <p className="text-slate-400 text-sm flex items-center gap-2 font-medium">
                    <span className="text-blue-400">📍</span>
                    <span className="truncate">{person.location}</span>
                  </p>
                  <p className="text-slate-500 text-xs mt-4 font-medium flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                    {person.allRecords?.length || 0} dijital iz
                  </p>
                </div>
                
                <Link 
                  to={`/person/${person.id}`} 
                  className="relative z-10 mt-6 w-full text-center bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white py-3 rounded-xl text-sm font-bold transition-all duration-300 shadow-inner hover:shadow-blue-600/50"
                >
                  Dosyayı İncele →
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-white/50 rounded-3xl border border-slate-200">
              <span className="text-6xl mb-4 block">📭</span>
              <h3 className="text-xl font-bold text-slate-700">Eşleşen Kayıt Bulunamadı</h3>
              <p className="text-slate-500 mt-2">Arama kriterlerinizi veya filtrelerinizi değiştirerek tekrar deneyin.</p>
            </div>
          )}
        </div>
      </div>
      <GuessModal 
        isOpen={isGuessModalOpen} 
        onClose={() => setIsGuessModalOpen(false)} 
        suspects={Array.from(new Set(people.map(p => p.name)))} // Jotformdaki isimleri listeler
      />
    </div>
  );
}