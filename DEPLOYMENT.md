# ARIOT IOT - Hızlı Deployment Kılavuzu

## 🚀 3 Deployment Seçeneği

### Seçenek 1: Docker Hub (ÖNERİLEN) ⚡
**Süre: 2-3 dakika**

```bash
# Ubuntu sunucuda
git clone https://github.com/rifatsekerariot/iotplatform.git
cd iotplatform
cp .env.example .env
nano .env  # Şifreleri değiştir

# Hızlı başlatma!
docker-compose -f docker-compose.hub.yml up -d
```

✅ Build yok, sadece hazır image'ları çeker
✅ En hızlı yöntem
✅ Production için ideal

---

### Seçenek 2: GitHub'dan Build (Mevcut)
**Süre: 15-20 dakika**

```bash
docker-compose up -d --build
```

⚠️ Her deployment'ta tam build
⚠️ Uzun sürer
✅ En güncel kod

---

### Seçenek 3: GitHub Actions (OTOMATIK)
**Süre: Otomatik**

Setup:
1. GitHub Settings → Secrets and variables → Actions
2. Ekle:
   - `DOCKERHUB_USERNAME`: Docker Hub kullanıcı adınız
   - `DOCKERHUB_TOKEN`: Docker Hub token
3. main branch'e push yaptığınızda otomatik build!

---

## 📦 Docker Hub Image'larını Hazırlama

### İlk Kez (Windows):

```powershell
cd c:\Projeler\beaver-iot-main

# Build
docker-compose build

# Docker Hub'a login
docker login

# Tag
docker tag ariot-backend:latest rifatseker/ariot-backend:latest
docker tag ariot-frontend:latest rifatseker/ariot-frontend:latest

# Push
docker push rifatseker/ariot-backend:latest
docker push rifatseker/ariot-frontend:latest
```

### Güncelleme Yaparken:

```powershell
# 1. Kod değişikliği yap
git add .
git commit -m "feat: yeni özellik"
git push

# 2. Yeni image build et
docker-compose build

# 3. Push et
docker push rifatseker/ariot-backend:latest
docker push rifatseker/ariot-frontend:latest
```

### Ubuntu'da Güncelleme:

```bash
# Çok hızlı!
cd ~/iotplatform
docker-compose -f docker-compose.hub.yml pull
docker-compose -f docker-compose.hub.yml up -d

# Toplam: ~1-2 dakika!
```

---

## ⚙️ GitHub Actions Setup (Tam Otomasyon)

1. **Docker Hub Token Oluştur:**
   - https://hub.docker.com/settings/security
   - "New Access Token" → "ariot-ci" adında token
   - Token'ı kopyala

2. **GitHub Secrets Ekle:**
   - https://github.com/rifatsekerariot/iotplatform/settings/secrets/actions
   - New repository secret:
     - Name: `DOCKERHUB_USERNAME` → Value: `rifatseker`
     - Name: `DOCKERHUB_TOKEN` → Value: (token'ınız)

3. **Workflow Aktif:**
   - `.github/workflows/docker-build.yml` zaten var
   - Her push'ta otomatik build ve push!

---

## 📊 Karşılaştırma

| Yöntem | Deployment Süresi | Güncelleme | Kurulum |
|--------|------------------|------------|---------|
| Docker Hub | 2-3 dk | 1-2 dk | Kolay |
| GitHub Build | 15-20 dk | 15-20 dk | Kolay |
| GitHub Actions | 2-3 dk | Otomatik | Orta |

---

## 🎯 Önerilen Workflow

### Geliştirme:
```bash
# Windows'ta
git commit & push
docker-compose build
docker push rifatseker/ariot-*:latest
```

### Production:
```bash
# Ubuntu'da
docker-compose -f docker-compose.hub.yml pull
docker-compose -f docker-compose.hub.yml up -d
```

**Toplam süre: 1-2 dakika!** 🚀

---

## 🔧 Sorun Giderme

### Image çekilemiyor
```bash
# Public olduğundan emin olun
# Docker Hub: https://hub.docker.com/r/rifatseker/ariot-backend

# Veya login yapın
docker login
```

### Eski image cache
```bash
docker-compose -f docker-compose.hub.yml pull --no-cache
docker-compose -f docker-compose.hub.yml up -d --force-recreate
```

---

**🎉 Artık deploymentlar çok hızlı!**
