# Docker Bağlantı Sorunları - Hızlı Çözüm

## Sorun
Docker Hub'a bağlanamıyor: "failed to solve: Canceled: grpc: the client connection is closing"

## Çözüm 1: DNS Düzelt (ÖNERİLEN)

```bash
# DNS ayarlarını kontrol et
cat /etc/resolv.conf

# Google DNS ekle
sudo nano /etc/resolv.conf
# Başına ekle:
# nameserver 8.8.8.8
# nameserver 8.8.4.4

# Docker'ı yeniden başlat
sudo systemctl restart docker

# Test et
sudo docker pull hello-world
```

## Çözüm 2: Docker Daemon DNS Ayarı

```bash
# Docker daemon.json düzenle
sudo nano /etc/docker/daemon.json

# Ekle:
{
  "dns": ["8.8.8.8", "8.8.4.4"]
}

# Kaydet ve yeniden başlat
sudo systemctl restart docker
```

## Çözüm 3: Proxy Varsa

```bash
# HTTP proxy ayarla
sudo mkdir -p /etc/systemd/system/docker.service.d
sudo nano /etc/systemd/system/docker.service.d/http-proxy.conf

# Ekle:
[Service]
Environment="HTTP_PROXY=http://proxy:port"
Environment="HTTPS_PROXY=http://proxy:port"
Environment="NO_PROXY=localhost,127.0.0.1"

# Reload
sudo systemctl daemon-reload
sudo systemctl restart docker
```

## Test

```bash
# Docker Hub'a bağlanabilir mi?
ping -c 3 registry-1.docker.io

# DNS çözebiliyor mu?
nslookup registry-1.docker.io

# Docker test
sudo docker pull alpine:latest
```

## Sonra Tekrar Dene

```bash
cd ~/iotplatform
git pull
sudo docker compose up -d --build
```
