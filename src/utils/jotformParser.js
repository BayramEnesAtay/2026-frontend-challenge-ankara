// src/utils/jotformParser.js

export const aggregatePeopleData = (multiFormData) => {
  if (!multiFormData || multiFormData.length === 0) return [];

  const peopleMap = new Map();

  multiFormData.forEach((formResult) => {
    const { formType, content } = formResult;

    content.forEach((submission) => {
      const answers = submission.answers || {};
      
      let personName = "Bilinmeyen Şahıs";
      let currentLocation = "Konum Bilinmiyor";
      let currentStatus = "Araştırılıyor";

      // Bütün soruları (answers) gezip içinde "name" veya "isim" geçen sorunun cevabını buluyoruz
      Object.values(answers).forEach(ans => {
        if (!ans.text) return;
        
        const questionText = ans.text.toLowerCase();
        
        // İsim bulma
        if ((questionText.includes("name") || questionText.includes("isim") || questionText.includes("şüpheli")) && ans.answer) {
          personName = ans.answer;
        }
        
        // Konum bulma
        if ((questionText.includes("location") || questionText.includes("konum")) && ans.answer) {
          currentLocation = ans.answer;
        }

        // Durum/Not bulma
        if ((questionText.includes("status") || questionText.includes("durum")) && ans.answer) {
          currentStatus = ans.answer;
        }
      });

      // Kişi ilk defa listeye giriyorsa profilini oluştur
      if (!peopleMap.has(personName)) {
        peopleMap.set(personName, {
          id: submission.id, // Benzersiz kimlik
          name: personName,
          location: currentLocation,
          status: currentStatus,
          allRecords: [] // 5 formun tüm detayları buraya dolacak
        });
      }

      // Kişiyi bul ve yeni form verisini dosyasına ekle
      const personProfile = peopleMap.get(personName);
      
      // Eğer bu formdan yeni bir konum geldiyse, eskisinin üstüne yaz (Son görülmeyi güncelle)
      if (currentLocation !== "Konum Bilinmiyor") {
        personProfile.location = currentLocation;
      }

      personProfile.allRecords.push({
        formType: formType,
        createdAt: submission.created_at,
        rawDetails: answers
      });
    });
  });

  return Array.from(peopleMap.values());
};