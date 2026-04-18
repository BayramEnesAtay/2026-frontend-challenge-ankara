// src/hooks/useDebounce.js
import { useState, useEffect } from 'react';

// Kullanıcı yazmayı bitirene kadar (delay süresi kadar) bekleyen akıllı kanca (hook)
export default function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Kullanıcı her tuşa bastığında bir zamanlayıcı başlat
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Eğer kullanıcı delay süresi bitmeden yeni bir tuşa basarsa, eski zamanlayıcıyı iptal et! (İşte Debounce budur)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}