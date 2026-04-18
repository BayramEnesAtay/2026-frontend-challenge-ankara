# Jotform Frontend Challenge Project

## User Information
Please fill in your information after forking this repository:

- **Name**: Bayram Enes Atay

## Project Description
Bu proje, 5 farklı Jotform veritabanından gelen dağınık verileri (Check-in, Mesajlar, Görülme İhbarları, Kişisel Notlar) tek bir merkezde toplayan, analiz eden ve görselleştiren **interaktif bir istihbarat paneli (dashboard)** uygulamasıdır.
Sıradan bir veri listeleme uygulamasından farklı olarak proje, kullanıcıyı "GÖREV PODO" senaryosunun içine çeker. Kullanıcılar paneli kullanarak dijital ayak izlerini takip eder, kurbanın nerede olduğunu bulmaya çalışır ve oyunlaştırılmış (gamified) final ekranında "Karargaha Çözümü Bildirir."

### 🌟 Öne Çıkan Teknik Özellikler
* 🚀 **Data Aggregation:** 5 farklı API ucundan çekilen ham verilerin `jotformParser` ile süzülüp şahıs bazlı tek bir yapıya dönüştürülmesi.
* 🗺️ **Kapsamlı Harita Mimarisi:** React-Leaflet entegrasyonu ile tüm dijital izlerin renk kodlu haritalanması. Örtüşen koordinatların haritada üst üste binmesini engelleyen mikroskobik sapma (**Jitter Algoritması**) uygulanmıştır.
* 🎮 **Oyunlaştırma & Matematiksel Doğrulama:** Harita üzerindeki tahminlerin doğruluğunu ölçmek için Dünya'nın küreselliğini hesaba katan **Haversine Algoritması** kullanılmıştır.
* ⚡ **Performans Optimizasyonu:** Arama kutusunda her tuş vuruşunda render alınmasını önleyen Custom `useDebounce` hook'u.
* 💎 **Gelişmiş UX/UI:** Tailwind CSS ile Glassmorphism tasarımı, dinamik "Yapay Zeka Risk Analizi" çubukları ve yapay gecikmeli (artificial delay) Taktiksel Skeleton yükleme ekranları.

## Tech Stack
- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **Maps:** React Leaflet & OpenStreetMap
- **API Management:** Fetch API & Custom Error Handling

## Getting Started
Projenin `master` branch'inde bulunan güncel sürümünü yerel ortamınızda (local) ayağa kaldırmak için aşağıdaki adımları sırasıyla uygulayınız:

**1. Repoyu Klonlayın ve Master Branch'e Geçin**
Terminalinizi açın, projeyi bilgisayarınıza indirin ve kodların bulunduğu ana branch'e (master) geçiş yapın:

git clone [https://github.com/BayramEnesAtay/2026-frontend-challenge-ankara.git](https://github.com/BayramEnesAtay/2026-frontend-challenge-ankara.git)
cd 2026-frontend-challenge-ankara
git checkout master

2. Bağımlılıkları Yükleyin
Projeyi çalıştırmak için gerekli olan kütüphaneleri (React, Tailwind, React-Leaflet vb.) kurmak için projenin ana dizininde şu komutu çalıştırın: npm install

3. Geliştirme Sunucusunu Başlatın
Kurulum tamamlandıktan sonra projeyi ayağa kaldırmak için aşağıdaki komutu girin: npm run dev

4. Projeyi Görüntüleyin
Terminalde beliren yerel sunucu adresine (genellikle http://localhost:5173) tıklayarak veya tarayıcınıza kopyalayarak uygulamayı kullanmaya başlayabilirsiniz. Sistem, "Görev Podo" başlangıç ekranı ile açılacak ve sizi doğrudan interaktif operasyona yönlendirecektir.

# 🚀 Challenge Duyurusu

## 📅 Tarih ve Saat
Cumartesi günü başlama saatinden itibaren üç saattir.

## 🎯 Challenge Konsepti
Bu challenge'da, size özel hazırlanmış bir senaryo üzerine web uygulaması geliştirmeniz istenecektir. Challenge başlangıcında senaryo detayları paylaşılacaktır.Katılımcılar, verilen GitHub reposunu fork ederek kendi geliştirme ortamlarını oluşturacaklardır.

## 📦 GitHub Reposu
Challenge için kullanılacak repo: https://github.com/cemjotform/2026-frontend-challenge-ankara

## 🛠️ Hazırlık Süreci
1. GitHub reposunu fork edin
2. Tercih ettiğiniz framework ile geliştirme ortamınızı hazırlayın
3. Hazırladığınız setup'ı fork ettiğiniz repoya gönderin

## 💡 Önemli Notlar
- Katılımcılar kendi tercih ettikleri framework'leri kullanabilirler
