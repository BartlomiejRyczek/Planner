It is a planner designed to record dental tasks that need to be completed, along with the progress of



Budowanie obrazu:

docker build -t dentamaxkalendarz .

Uruchamianie kontenera:

docker run -d -p 5000:8000 -v "${pwd}/instance:/app/instance" dentamaxkalendarz

Sprawdzanie statusu:

docker ps

Sprawdzanie logów:

docker logs <container_id>

Zatrzymywanie kontenera:

docker stop <container_id>

Usuwanie kontenera:

docker rm <container_id>


trzeba ustawic sciezke w pliku uruchomdocker.sh
