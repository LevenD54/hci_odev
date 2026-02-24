# Ödev Yönetim Sistemi

Bu proje, öğrencilerin araştırma ödevlerini seçmeleri ve yönetmeleri için geliştirilmiş bir web uygulamasıdır.

## Özellikler

- **Öğrenciler İçin:**
  - Ödev konularını listeleme ve arama
  - Ödev detaylarını (araştırma konusu, uygulama adımları) inceleme
  - Müsait olan ödevleri seçme (Ad, Soyad, Numara ile)

- **Yöneticiler İçin:**
  - `/admin` adresinden erişilebilir yönetim paneli
  - Yeni ödev ekleme
  - Ödev durumlarını görme (kimin aldığı)
  - Ödev silme veya öğrenci kaydını sıfırlama

## Kurulum

1. Bağımlılıkları yükleyin: `npm install`
2. Uygulamayı başlatın: `npm run dev`
3. Tarayıcıda `http://localhost:3000` adresine gidin.

## Veritabanı

Uygulama `better-sqlite3` kullanarak yerel bir SQLite veritabanı (`assignments.db`) kullanır. İlk çalıştırıldığında `assignments.csv` dosyasındaki verilerle otomatik olarak doldurulur.

## Dağıtım (Vercel)

Vercel üzerinde dağıtım yaparken:
1. `better-sqlite3` Vercel Serverless Functions ortamında çalışmayabilir. Vercel Postgres veya Turso gibi bir veritabanı servisine geçiş yapılması önerilir.
2. `src/db.ts` dosyasını kullanılan veritabanı servisine göre güncelleyin.
