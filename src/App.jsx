// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // <-- İŞTE EKSİK OLAN HAYAT KURTARICI SATIR BU!

// Sayfalarımızı import ediyoruz
import Welcome from './pages/Welcome/index.jsx';
import PeopleList from './pages/PeopleList/index.jsx';
import PersonDetail from './pages/PersonDetail/index.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/panel" element={<PeopleList />} />
        <Route path="/person/:id" element={<PersonDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;