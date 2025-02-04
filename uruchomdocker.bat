@echo off
cd /d "C:\Users\brycz\Desktop\Nowy folder (3)\kalendarz-dentamax"
docker-compose down
docker-compose build
docker-compose up -d
pause