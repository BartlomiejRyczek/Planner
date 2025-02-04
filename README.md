# 📌 Projekt: Kalendarz Dentystyczny

## 🦷 Opis
Projekt umożliwia przechowywanie oraz podgląd zadań dentystycznych w kalendarzu. Wykorzystuje **Flask**, **PostgreSQL**, **SQLAlchemy**, **Docker** i **Docker Compose**, zapewniając wygodne zarządzanie harmonogramem.

---

## 📂 Struktura Plików
| Plik | Opis |
|------|------|
| `script.js` | Obsługa interakcji użytkownika (renderowanie kalendarza, obsługa formularzy, zapytania Fetch) |
| `styles.css` | Stylizacja komponentów wizualnych (kalendarz, formularze) |
| `index.html`, `day.html` | Szablony HTML wyświetlające widok kalendarza oraz widok dnia |
| `app.py` | Główna logika serwera Flask (API, obsługa bazy danych) |
| `uruchomdocker.sh` (Linux/macOS), `uruchomdocker.bat` (Windows) | Skrypty do uruchamiania aplikacji w kontenerze Docker |
| `requirements.txt` | Lista wymaganych pakietów Pythona |
| `Dockerfile` | Definicja obrazu Dockera (instalacja zależności i konfiguracja serwera) |
| `docker-compose.yaml` | Konfiguracja uruchamiania aplikacji (Flask + PostgreSQL) w wielokontenerowym środowisku |

---

## 🚀 Uruchomienie Aplikacji

### 🔹 Metoda 1: Skrypty uruchamiające
1. **Zainstaluj Docker i Docker Compose** (jeśli jeszcze ich nie masz).
2. Uruchom odpowiedni skrypt:
   - **Windows**: `uruchomdocker.bat`
   - **Linux/macOS**: `./uruchomdocker.sh`
3. Aplikacja będzie dostępna pod adresem: **[http://localhost:5000](http://localhost:5000)**

### 🔹 Metoda 2: Ręczne uruchomienie przez Docker Compose
1. W folderze z projektem uruchom polecenie:
   ```bash
   docker-compose up --build -d
   ```
2. Aplikacja będzie dostępna pod adresem **[http://localhost:5000](http://localhost:5000)**

---

## 🐳 Polecenia Docker

| Komenda | Opis |
|---------|------|
| `docker ps` | Sprawdzenie uruchomionych kontenerów |
| `docker logs <nazwa_kontenera>` | Podgląd logów kontenera |
| `docker stop <nazwa_kontenera>` | Zatrzymanie kontenera |
| `docker rm <nazwa_kontenera>` | Usunięcie kontenera |

---

📌 **Gotowe!** Twoja aplikacja działa w kontenerze Docker. Jeśli masz pytania, skontaktuj się ze mną! 🚀