#!/bin/bash

# Przejście do katalogu projektu
cd "/home/USER/Desktop/kalendarz-dentamax" || exit #podaj poprawna sciezke do projektu

# Zatrzymanie i usunięcie kontenerów
sudo docker-compose down

# Zbudowanie obrazów Dockera
sudo docker-compose build

# Uruchomienie kontenerów w tle
sudo docker-compose up -d

# Pauza (opcjonalnie, można usunąć)
read -p "Naciśnij Enter, aby kontynuować..."