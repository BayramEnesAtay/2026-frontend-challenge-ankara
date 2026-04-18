// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PeopleList from './pages/PeopleList/index.jsx'; // Kendi dosya yoluna göre ayarla
import PersonDetail from './pages/PersonDetail/index.jsx';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        {/* Ortak bir Navbar istersen buraya ekleyebilirsin */}
        <main>
          <Routes>
            {/* Ana Sayfa: Doğrudan Kişi Listesine gitsin */}
            <Route path="/" element={<PeopleList />} />
            
            {/* Detay Sayfası: URL'den ID alacak şekilde ayarladık */}
            <Route path="/person/:id" element={<PersonDetail />} />
            
            {/* Yanlış bir URL girilirse Ana Sayfaya atsın (Güvenlik) */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}