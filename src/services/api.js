// src/services/api.js

// .env dosyasındaki anahtarları bir dizi (array) içine alıyoruz. 
// filter(Boolean) kısmı, eğer yedek key girilmemişse boş olanları siler.
const API_KEYS = [
  import.meta.env.VITE_JOTFORM_KEY_PRIMARY,
  import.meta.env.VITE_JOTFORM_KEY_BACKUP_1,
  import.meta.env.VITE_JOTFORM_KEY_BACKUP_2,
  import.meta.env.VITE_JOTFORM_KEY_BACKUP_3,
  import.meta.env.VITE_JOTFORM_KEY_BACKUP_4
].filter(Boolean);

// Sadece Form ID'lerimiz (Anahtarlara gerek kalmadı, onları yukarıdan dinamik alacağız)
export const FORM_CONFIG = [
  { type: 'Checkins', id: '261065067494966' }, // Senin gerçek Checkin ID'n
  { type: 'Messages', id: '261065765723966' },
  { type: 'Sightings', id: '261065244786967' },
  { type: 'Personal Notes', id: '261065509008958' },
  { type: 'Anonymous Tips', id: '261065875889981' },
];

// 🚀 ŞOV KISMI: Rate Limit'e Takılmayan Akıllı Fetch Fonksiyonu
const safeFetchWithFallback = async (formId) => {
  // Elimizdeki tüm anahtarları sırayla deniyoruz
  for (let i = 0; i < API_KEYS.length; i++) {
    try {
      const currentKey = API_KEYS[i];
      const url = `https://api.jotform.com/form/${formId}/submissions?apiKey=${currentKey}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.responseCode === 200) {
        return data.content || []; // Başarılıysa veriyi dön ve döngüden çık
      } 
      
      if (data.responseCode === 429) {
        // Limit aşıldıysa konsola bilgi ver ve döngüye (bir sonraki anahtara) devam et
        console.warn(`[API UYARI] Anahtar ${i + 1} limiti doldu! Yedek anahtara geçiliyor...`);
        continue; 
      }
      
      // 429 dışında başka bir hata varsa (örn: 401 Yetkisiz), zorlama ve hatayı fırlat
      throw new Error(data.message || "Bilinmeyen API Hatası");

    } catch (error) {
      console.error("İstek sırasında bir hata oluştu:", error);
    }
  }

  // Eğer tüm anahtarlar bittiyse ve hala veri alamadıysak:
  console.error(`[KRİTİK HATA] Form ${formId} için tüm API anahtarlarının limiti doldu!`);
  return [];
};

// 5 formu AYNI ANDA çeken üst fonksiyon
export const fetchAllJotformData = async () => {
  try {
    // Tüm formlar için yukarıdaki akıllı fonksiyonu tetikliyoruz
    const requests = FORM_CONFIG.map(form => 
      safeFetchWithFallback(form.id).then(content => ({
        formType: form.type,
        content: content
      }))
    );

    // Promise.all ile 5 işlemi paralel yapıp süreyi 5'te 1'ine indiriyoruz
    const allResults = await Promise.all(requests);
    return allResults;
    
  } catch (error) {
    console.error("Çoklu veri çekiminde global hata:", error);
    return [];
  }
};