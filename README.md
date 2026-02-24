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

## Veritabanı (Supabase)

Bu uygulama veritabanı olarak **Supabase** kullanmaktadır.

### Kurulum Adımları

1. **Supabase Projesi Oluşturun:**
   - [Supabase](https://supabase.com/) üzerinde yeni bir proje oluşturun.
   - Proje ID'nizi not edin (örneğin: `ljbgrimmovfbhfzhzoif`).

2. **Tabloları Oluşturun:**
   - Supabase Dashboard'da **SQL Editor** sekmesine gidin.
   - `supabase_schema.sql` dosyasının içeriğini kopyalayıp yapıştırın ve çalıştırın (Run).
   - Bu işlem `assignments` tablosunu oluşturacak ve gerekli izinleri (RLS) ayarlayacaktır.

3. **Çevre Değişkenlerini Ayarlayın:**
   - `.env` dosyasını oluşturun (veya `.env.example` dosyasını kopyalayın).
   - `SUPABASE_URL` ve `SUPABASE_KEY` değerlerini girin.
     - `SUPABASE_URL`: `https://<PROJECT_ID>.supabase.co`
     - `SUPABASE_KEY`: Supabase Dashboard > Project Settings > API bölümünden `anon` veya `service_role` anahtarını alabilirsiniz. (Yönetim işlemleri için `service_role` önerilir, ancak `anon` anahtarı ile de çalışacak şekilde RLS politikaları ayarlanmıştır).

4. **Veri Yükleme (Seed):**
   - Uygulama ilk başlatıldığında, eğer veritabanı boşsa `assignments.csv` dosyasındaki verileri otomatik olarak Supabase'e yükleyecektir.

## Dağıtım (Vercel)

1. Projeyi GitHub'a yükleyin.
2. Vercel'de yeni proje oluşturun ve GitHub deposunu bağlayın.
3. Vercel proje ayarlarında **Environment Variables** kısmına `SUPABASE_URL` ve `SUPABASE_KEY` ekleyin.
4. Dağıtımı başlatın.
