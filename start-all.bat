@echo off
chcp 65001 > nul
color 0B

echo ======================================================================
echo       KHOI DONG TOAN BO HE THONG SEMINAR SOA [1-CLICK RUN]
echo  Tu dong cai dat thu vien neu chua co va khoi chay 5 ung dung
echo ======================================================================
echo.

set ROOT_DIR=%~dp0

REM -----------------------------------------------------------------------
REM 1. TU DONG COPY FILE .ENV NEU CHUA CO
REM -----------------------------------------------------------------------
echo [BUOC 1/3] Kiem tra va thiet lap file cau hinh .env...

if not exist "%ROOT_DIR%frontend\.env" if exist "%ROOT_DIR%frontend\.env.example" copy "%ROOT_DIR%frontend\.env.example" "%ROOT_DIR%frontend\.env" >nul
if not exist "%ROOT_DIR%backend-fastapi\.env" if exist "%ROOT_DIR%backend-fastapi\.env.example" copy "%ROOT_DIR%backend-fastapi\.env.example" "%ROOT_DIR%backend-fastapi\.env" >nul
if not exist "%ROOT_DIR%backend-nodejs\.env" if exist "%ROOT_DIR%backend-nodejs\.env.example" copy "%ROOT_DIR%backend-nodejs\.env.example" "%ROOT_DIR%backend-nodejs\.env" >nul
if not exist "%ROOT_DIR%backend-quan-oauth2\.env" if exist "%ROOT_DIR%backend-quan-oauth2\.env.example" copy "%ROOT_DIR%backend-quan-oauth2\.env.example" "%ROOT_DIR%backend-quan-oauth2\.env" >nul

REM -----------------------------------------------------------------------
REM 2. TU DONG CAI DAT DEPENDENCIES / THU VIEN CHO MAY MOI
REM -----------------------------------------------------------------------
echo [BUOC 2/3] Kiem tra va tu dong cai dat thu vien neu may moi chua co...

REM Frontend React
if not exist "%ROOT_DIR%frontend\node_modules" (
    echo Dang cai dat thu vien npm cho React
    cd /d "%ROOT_DIR%frontend"
    call npm install
)

REM Backend NodeJS
if not exist "%ROOT_DIR%backend-nodejs\node_modules" (
    echo Dang cai dat thu vien npm cho NodeJS
    cd /d "%ROOT_DIR%backend-nodejs"
    call npm install
)

REM Backend FastAPI
if not exist "%ROOT_DIR%backend-fastapi\venv" (
    echo Dang tao moi truong ao Python venv
    cd /d "%ROOT_DIR%backend-fastapi"
    python -m venv venv
    echo Dang cai dat requirements.txt vao venv
    call "%ROOT_DIR%backend-fastapi\venv\Scripts\activate.bat"
    pip install -r "%ROOT_DIR%backend-fastapi\requirements.txt"
)

echo.
echo ======================================================================
echo  CAC THU VIEN DEU DA SAN SANG! DANG KHOI DONG 5 CUA SO DICH VU...
echo ======================================================================
echo.

REM -----------------------------------------------------------------------
REM 3. KHOI DONG DONG THOI 5 DICH VU (1 FE + 4 BE)
REM -----------------------------------------------------------------------
echo [BUOC 3/3] Dang mo 5 cua so dich vu...

echo [1/5] Dang bat Frontend React [Port 5173]...
start "FE - React Frontend (Port 5173)" cmd /k "cd /d "%ROOT_DIR%frontend" && npm run dev"
timeout /t 2 > nul

echo [2/5] Dang bat Backend FastAPI [Port 8000]...
start "BE 1 - FastAPI Python (Port 8000)" cmd /k "cd /d "%ROOT_DIR%backend-fastapi" && call venv\Scripts\activate.bat && uvicorn main:app --reload --port 8000"
timeout /t 2 > nul

echo [3/5] Dang bat Backend Spring Boot Firebase [Port 8080]...
start "BE 2 - Spring Boot Firebase (Port 8080)" cmd /k "cd /d "%ROOT_DIR%backend-springboot" && mvnw.cmd spring-boot:run"
timeout /t 2 > nul

echo [4/5] Dang bat Backend OAuth2 Quan [Port 8081]...
start "BE 3 - OAuth2 Quan (Port 8081)" cmd /k "cd /d "%ROOT_DIR%backend-quan-oauth2" && mvnw.cmd spring-boot:run"
timeout /t 2 > nul

echo [5/5] Dang bat Backend NodeJS Express [Port 3000]...
start "BE 4 - NodeJS Express (Port 3000)" cmd /k "cd /d "%ROOT_DIR%backend-nodejs" && npm run dev"

echo.
echo ======================================================================
echo  DA KHOI DONG THANH CONG TOAN BO 5 DICH VU!
echo.
echo  - Frontend React:       http://localhost:5173
echo  - FastAPI Python:       http://localhost:8000
echo  - Spring Boot Firebase: http://localhost:8080
echo  - Backend Quan OAuth2:  http://localhost:8081
echo  - Database Viewer Quan: http://localhost:8081/database.html
echo  - NodeJS Express:       http://localhost:3000
echo ======================================================================
echo.
echo De dung toan bo he thong, hay chay file stop-all.bat
pause
