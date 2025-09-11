# SchoolManagement

Okul Yönetim Sistemi (School Management System)
📚 Proje Açıklaması
Bu proje, okul yönetimi için geliştirilmiş kapsamlı bir web uygulamasıdır. Sistem, öğrenci, öğretmen ve yönetici rollerini destekleyerek eğitim süreçlerinin dijital ortamda yönetilmesini sağlar.
🎯 Temel Özellikler

Kullanıcı Rolleri: Admin, Öğretmen, Öğrenci
JWT Authentication: Güvenli kimlik doğrulama sistemi
Ders Yönetimi: Ders oluşturma, düzenleme ve silme
Devamsızlık Takibi: Öğrenci yoklama sistemi
Not Sistemi: Öğrenci notlarının yönetimi
Yorum Sistemi: Öğretmen-öğrenci iletişimi
Ders Programı: Dinamik ders programı yönetimi
Rol Bazlı Erişim: Her rolün kendi yetkileri


Veritabanı Yönetimi
pgAdmin Erişimi:

URL: http://localhost:8080
Email: admin@admin.com
Şifre: admin123

PostgreSQL Bağlantı Bilgileri:

Host: localhost (Docker dışından) / postgres (Docker içinden)
Port: 5432
Database: school_management
Username: admin
Password: admin123

👥 Test Kullanıcıları
API Test Kullanıcıları
Sistemi test etmek için aşağıdaki kullanıcıları kullanabilirsiniz. İlk olarak bu kullanıcıları /api/auth/register endpoint'i ile oluşturmanız gerekir:
Admin Kullanıcı
json{
  "firstName": "Admin",
  "lastName": "User",
  "email": "admin@school.com",
  "password": "admin123",
  "phone": "5551234567",
  "role": "Admin"
}
Öğretmen Kullanıcı
json{
  "firstName": "Mehmet",
  "lastName": "Öğretmen",
  "email": "teacher@school.com",
  "password": "teacher123",
  "phone": "5551234568",
  "role": "Teacher"
}
Öğrenci Kullanıcı
json{
  "firstName": "Ahmet",
  "lastName": "Öğrenci",
  "email": "student@school.com",
  "password": "student123",
  "phone": "5551234569",
  "role": "Student"
}

Bonus Görevler:

1.Docker içinde çalıştırma.