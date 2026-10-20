@echo off
chcp 65001 > nul
title Khoi dong toan bo He thong Seminar (Auto-Install & Run)
color 0B

echo ======================================================================
echo       KHOI DONG TOAN BO HE THONG SEMINAR SOA (1-CLICK RUN)
echo  (Tu dong kiem tra moi truong, cai dat thu vien va khoi chay 5 app)
echo ======================================================================
echo.

set ROOT_DIR=%~dp0

:: ========================================================================
:: 1. KIEM TRA CAC PHAN MEM YEU CAU (PRE-REQUISITES)
:: ========================================================================
echo [BUOC 1/4] Kiem tra phan mem can thiet tren may...

where node >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo [LOI] May chua cai dat Node.js! Vui long tai va cai tai: https://nodejs.org/
    pause
    exit /b
)

where python >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo [LOI] May chua cai dat Python! Vui long tai va cai tai: https://www.python.org/ (Nho tich vao Add Python to PATH)
    pause
    exit /b
)

where java >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo [LOI] May chua cai dat Java JDK (17+)! Vui long tai va cai tai: https://adoptium.net/
    pause
    exit /b
)

echo -> Tat ca moi truong Node.js, Python, Java deu da san sang!
echo.

:: ========================================================================
:: 2. TU DONG COPY FILE .ENV NEU CHUA CO
:: ========================================================================
echo [BUOC 2/4] Kiem tra va thiet lap file cau hinh (.env)...

if not exist "%ROOT_DIR%frontend\.env" (
    if exist "%ROOT_DIR%frontend\.env.example" (
        copy "%ROOT_DIR%frontend\.env.example" "%ROOT_DIR%frontend\.env" >nul
        echo -> Da tao frontend\.env tu file mau .env.example
    )
)

if not exist "%ROOT_DIR%backend-fastapi\.env" (
    if exist "%ROOT_DIR%backend-fastapi\.env.example" (
        copy "%ROOT_DIR%backend-fastapi\.env.example" "%ROOT_DIR%backend-fastapi\.env" >nul
        echo -> Da tao backend-fastapi\.env tu file mau .env.example
    )
)

if not exist "%ROOT_DIR%backend-nodejs\.env" (
    if exist "%ROOT_DIR%backend-nodejs\.env.example" (
        copy "%ROOT_DIR%backend-nodejs\.env.example" "%ROOT_DIR%backend-nodejs\.env" >nul
        echo -> Da tao backend-nodejs\.env tu file mau .env.example
    )
)

if not exist "%ROOT_DIR%backend-quan-oauth2\.env" (
    if exist "%ROOT_DIR%backend-quan-oauth2\.env.example" (
        copy "%ROOT_DIR%backend-quan-oauth2\.env.example" "%ROOT_DIR%backend-quan-oauth2\.env" >nul
        echo -> Da tao backend-quan-oauth2\.env tu file mau .env.example
    )
)

:: Canh bao neu thieu file serviceAccountKey.json
if not exist "%ROOT_DIR%backend-fastapi\serviceAccountKey.json" (
    echo.
    echo **********************************************************************
    echo  [CHU Y QUAN TRONG CHO MAY MOI CLONE TU GITHUB]:
    echo  Ban can dat file 'serviceAccountKey.json' cua Firebase vao:
    echo  - backend-fastapi\
    echo  - backend-nodejs\
    echo  - backend-springboot\src\main\resources\
    echo  (Day la file bi mat khong duoc push len Git vi bao mat)
    echo **********************************************************************
    echo.
)

:: ========================================================================
:: 3. TU DONG CAI DAT DEPENDENCIES / THU VIEN CHO MAY MOI
:: ========================================================================
echo [BUOC 3/4] Kiem tra va tu dong cai dat thu vien neu may moi chua co...

:: Frontend
if not exist "%ROOT_DIR%frontend\node_modules" (
    echo -> [Frontend] Dang cai dat thu vien npm cho React (chi chay lan dau)...
    cd /d "%ROOT_DIR%frontend" && call npm install
)

:: Backend NodeJS
if not exist "%ROOT_DIR%backend-nodejs\node_modules" (
    echo -> [Backend NodeJS] Dang cai dat thu vien npm (chi chay lan dau)...
    cd /d "%ROOT_DIR%backend-nodejs" && call npm install
)

:: Backend FastAPI
if not exist "%ROOT_DIR%backend-fastapi\venv" (
    echo -> [Backend FastAPI] Dang tao moi truong ao Python venv...
    cd /d "%ROOT_DIR%backend-fastapi" && python -m venv venv
    echo -> [Backend FastAPI] Dang cai dat requirements.txt vao venv (chi chay lan dau)...
    call "%ROOT_DIR%backend-fastapi\venv\Scripts\activate.bat"
    pip install -r "%ROOT_DIR%backend-fastapi\requirements.txt"
)

echo.
echo ======================================================================
echo  CAC THU VIEN DEU DA DUOC CAI DAT XONG! BAT DAU KHOI DONG HE THONG...
echo ======================================================================
echo.

:: ========================================================================
:: 4. KHOI DONG DONG THOI 5 DICH VU (1 FE + 4 BE)
:: ========================================================================
echo [BUOC 4/4] Dang mo 5 cua so dich vu...

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
echo  DA KHOI DONG THANH CONG TOAN BO 5 DICH VU!
echo.
echo  - Frontend React:       http://localhost:5173
echo  - FastAPI (Python):     http://localhost:8000
echo  - Spring Boot Firebase: http://localhost:8080
echo  - Backend Quan OAuth2:  http://localhost:8081
echo  - Database Viewer Quan: http://localhost:8081/database.html
echo  - NodeJS Express:       http://localhost:3000
echo ======================================================================
echo.
echo (De dung toan bo he thong, chi can chay file stop-all.bat)
pause
