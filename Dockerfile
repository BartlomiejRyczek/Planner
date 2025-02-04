# Użyj oficjalnego obrazu Pythona w wersji 3.11 jako bazowego
FROM --platform=linux/arm64 python:3.11

# Ustaw zmienną środowiskową, aby Python nie buforował wyjścia (przydatne do logowania)
ENV PYTHONUNBUFFERED=1

# Ustaw katalog roboczy aplikacji
WORKDIR /app

# Skopiuj plik requirements.txt do obrazu
COPY requirements.txt /app/requirements.txt

# Zainstaluj zależności Pythona
RUN pip install --no-cache-dir -r requirements.txt

# Skopiuj całą zawartość katalogu do obrazu
COPY . /app

# Otwórz port 8000 (lub inny port, na którym działa aplikacja Flask)
EXPOSE 5000

# Uruchom aplikację za pomocą serwera Waitress
CMD ["waitress-serve", "--port=5000", "app:app"]
