// src/pages/PeopleList/index.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as S from './styles.js';

export default function PeopleList() {
  const [people, setPeople] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Sayfa ilk açıldığında Jotform'dan verileri çekiyoruz
  useEffect(() => {
    const fetchPeople = async () => {
      try {
        // TODO: API key ve URL buraya eklenecek. Şimdilik mock data basıyoruz.
        const mockData = [
          { id: 1, name: 'Ahmet Yılmaz', location: 'Kızılay Meydanı', status: 'Şüpheli' },
          { id: 2, name: 'Mehmet Demir', location: 'Tunalı Hilmi', status: 'Temiz' },
          { id: 3, name: 'Aslı Kaya', location: 'Bilkent Center', status: 'Aranıyor' },
        ];
        
        // Veri geliyormuş hissi vermek için ufak bir gecikme ekledik
        setTimeout(() => {
          setPeople(mockData);
          setIsLoading(false);
        }, 800);

      } catch (error) {
        console.error("Veri çekilirken patladık:", error);
        setIsLoading(false);
      }
    };

    fetchPeople();
  }, []);

  // Kullanıcı arama kutusuna bir şey yazdığında listeyi anında daraltıyoruz
  const filteredPeople = people.filter(person => 
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={S.container}>
      {/* Üst Kısım: Başlık ve Arama */}
      <header className={S.header}>
        <h1 className={S.title}>Podo Takip Paneli</h1>
        <div className={S.searchWrapper}>
          <input 
            type="text" 
            placeholder="Şüpheli ismi ara..." 
            className={S.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {/* Yükleniyor Durumu (Jotform API'si bazen geç yanıt verebilir, kullanıcı boş sayfa görmesin) */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        /* Veriler Geldiğinde Gösterilecek Kart Grid'i */
        <div className={S.grid}>
          {filteredPeople.map(person => (
            <div key={person.id} className={S.card}>
              
              <div className="flex justify-between items-start mb-6">
                {/* İsim baş harfini avatar olarak kullanıyoruz */}
                <div className={S.avatar}>{person.name.charAt(0)}</div>
                
                {/* Duruma göre değişen dinamik rozet (badge) rengi */}
                <span className={`
                  ${S.badgeBase} 
                  ${person.status === 'Şüpheli' ? 'bg-orange-100 text-orange-700' : ''}
                  ${person.status === 'Aranıyor' ? 'bg-red-100 text-red-700' : ''}
                  ${person.status === 'Temiz' ? 'bg-emerald-100 text-emerald-700' : ''}
                `}>
                  {person.status}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 mb-1">{person.name}</h3>
              <p className="text-slate-500 text-sm mb-6 flex-1">
                Son Görülme: <span className="font-medium text-slate-700">{person.location}</span>
              </p>
              
              {/* Detay sayfasına ID'yi yolluyoruz */}
              <Link to={`/person/${person.id}`} className={S.detailBtn + " text-center block"}>
                Dosyayı İncele
              </Link>
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
}