@echo off
chcp 65001 > nul
title Dung toan bo He thong Seminar (1 FE + 4 BE)
color 0C

echo ======================================================================
echo    DANG DUNG TOAN BO HE THONG SEMINAR SOA
echo    (Giai phong cac cong: 5173, 8000, 8080, 8081, 3000)
echo ======================================================================
echo.

echo Dang giai phong cong 5173 (Frontend React)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173 ^| findstr LISTENING') do taskkill /f /pid %%a 2>nul

echo Dang giai phong cong 8000 (FastAPI)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000 ^| findstr LISTENING') do taskkill /f /pid %%a 2>nul

echo Dang giai phong cong 8080 (Spring Boot Firebase)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8080 ^| findstr LISTENING') do taskkill /f /pid %%a 2>nul

echo Dang giai phong cong 8081 (Backend Quan OAuth2)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8081 ^| findstr LISTENING') do taskkill /f /pid %%a 2>nul

echo Dang giai phong cong 3000 (NodeJS Express)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do taskkill /f /pid %%a 2>nul

echo.
echo ======================================================================
echo  DA TAT TOAN BO CAC TIEN TRINH VA GIAI PHONG TAT CA CAC PORT!
echo ======================================================================
echo.
pause
