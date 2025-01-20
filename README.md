# Opis

Projekt umożliwia przechowywanie oraz podgląd zadań dentystycznych w kalendarzu. Wykorzystuje Flask, bazę danych (PostgreSQL oraz SQLAlchemy), Docker i Docker Compose.

# Struktura plików
* script.js – obsługa interakcji po stronie klienta (renderowanie kalendarza, obsługa formularzy, zapytania Fetch).
* styles.css – stylizacja komponentów wizualnych (kalendarz, formularze).
* index.html i day.html – szablony HTML wyświetlające widok kalendarza oraz widok dnia.
* app.py – główna logika serwera Flask (API, obsługa bazy danych).
* uruchomdocker.sh (Linux/macOS) oraz uruchomdocker.bat (Windows) – skrypty do uruchomienia aplikacji w kontenerze Docker.
* requirements.txt – lista wymaganych pakietów Pythona.
* Dockerfile – definicja obrazu Docker (instalacja zależności i konfiguracja serwera).
* docker-compose.yaml – konfiguracja uruchamiania aplikacji (Flask + baza PostgreSQL) w wielokontenerowym środowisku.

# Uruchomienie 
1. Zainstaluj Docker i Docker Compose
2. W folderze z projektem uruchom: 
``` bash
docker-compose up --build -d
```
3. Aplikacja dostępna będzie domyślnie pod adresem http://localhost:5000

# Polecenia Docker
* Sprawdzenie uruchomionych kontenerów
``` bash
docker ps
```
* Logi kontenera
``` bash
docker logs <nazwa_kontenera>
```
* Zatrzymanie kontenera
``` bash
docker stop <nazwa_kontenera>
```
* Usuwanie kontenera
``` bash
docker rm <nazwa_kontenera>
```
