#!/bin/bash
cd /path/to/your/project/directory || exit #Podaj poprawną scieżkę do swojego projektu
docker-compose up --build -d
