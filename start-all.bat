@echo off
chcp 65001 > nul
title Khoi dong toan bo He thong Seminar (1 FE + 4 BE)
color 0A

echo ======================================================================
echo    DANG KHOI DONG TOAN BO HE THONG SEMINAR SOA
echo    (1 Frontend React + 4 Backend: FastAPI, SpringBoot, Quan, NodeJS)
echo ======================================================================
echo.

set ROOT_DIR=%~dp0

echo [1/5] Dang bat Frontend React (Port 5173)...
start "FE - React Frontend (Port 5173)" cmd /k "cd /d "%ROOT_DIR%frontend" && npm run dev"
timeout /t 2 > nul

echo [2/5] Dang bat Backend FastAPI (Port 8000)...
start "BE 1 - FastAPI Python (Port 8000)" cmd /k "cd /d "%ROOT_DIR%backend-fastapi" && call venv\Scripts\activate.bat && uvicorn main:app --reload --port 8000"
timeout /t 2 > nul

echo [3/5] Dang bat Backend Spring Boot Firebase (Port 8080)...
start "BE 2 - Spring Boot Firebase (Port 8080)" cmd /k "cd /d "%ROOT_DIR%backend-springboot" && mvnw.cmd spring-boot:run"
timeout /t 2 > nul

echo [4/5] Dang bat Backend OAuth2 Quan (Port 8081)...
start "BE 3 - OAuth2 Quan (Port 8081)" cmd /k "cd /d "%ROOT_DIR%backend-quan-oauth2" && mvnw.cmd spring-boot:run"
timeout /t 2 > nul

echo [5/5] Dang bat Backend NodeJS Express (Port 3000)...
start "BE 4 - NodeJS Express (Port 3000)" cmd /k "cd /d "%ROOT_DIR%backend-nodejs" && npm run dev"

echo.
echo ======================================================================
echo  DA KHOI DONG THANH CONG 5 CUA SO DICH VU!
echo.
echo  - Frontend React:       http://localhost:5173
echo  - FastAPI (Python):     http://localhost:8000
echo  - Spring Boot Firebase: http://localhost:8080
echo  - Backend Quan OAuth2:  http://localhost:8081
echo  - Database Viewer Quan: http://localhost:8081/database.html
echo  - NodeJS Express:       http://localhost:3000
echo ======================================================================
echo.
echo (Ban co the thu nho cua so nay lai. De tat toan bo he thong, chay file stop-all.bat)
pause
