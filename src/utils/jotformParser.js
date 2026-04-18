// src/utils/jotformParser.js

export const formatPeopleData = (jotformContent) => {
  // Eğer API boş dönerse veya hata olursa uygulamamız patlamasın
  if (!jotformContent || !Array.isArray(jotformContent)) return [];

  return jotformContent.map((submission) => {
    const answers = submission.answers;

    // Jotform'daki ID'leri bizim kullanacağımız düzgün isimlere (Key) çeviriyoruz
    return {
      id: submission.id,
      createdAt: submission.created_at,
      
      // Soru ID'si "2" olan yer İsim bilgisi (Senin attığın logdan biliyoruz)
      // Optional chaining (?.) kullanıyoruz ki veri boş gelirse kod patlamasın
      name: answers["2"]?.answer || "İsimsiz Kayıt",
      
      // Şimdilik diğer numaraları farazi yazıyorum, sen doğrusunu bulunca güncelleriz
      location: answers["3"]?.answer || "Konum Bilinmiyor", 
      status: answers["4"]?.answer || "Belirsiz",
      
      // Ne olur ne olmaz, ham veriyi de objenin içinde saklayalım (Detay sayfasında lazım olur)
      rawDetails: answers 
    };
  });
};