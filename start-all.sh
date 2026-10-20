#!/bin/bash

# ======================================================================
#       KHOI DONG TOAN BO HE THONG SEMINAR SOA CHO MACOS / LINUX
#   (Tu dong cai dat thu vien va khoi chay 5 ung dung trong Terminal)
# ======================================================================

# Chuyen den thu muc chua script nay
cd "$(dirname "$0")"
ROOT_DIR="$(pwd)"

echo "======================================================================"
echo "    KHOI DONG TOAN BO HE THONG SEMINAR SOA (1-CLICK RUN CHO MAC)"
echo "======================================================================"
echo ""

# ----------------------------------------------------------------------
# 1. TU DONG COPY FILE .ENV NEU CHUA CO
# ----------------------------------------------------------------------
echo "[BUOC 1/3] Kiem tra va thiet lap file cau hinh (.env)..."

[ ! -f "$ROOT_DIR/frontend/.env" ] && [ -f "$ROOT_DIR/frontend/.env.example" ] && cp "$ROOT_DIR/frontend/.env.example" "$ROOT_DIR/frontend/.env"
[ ! -f "$ROOT_DIR/backend-fastapi/.env" ] && [ -f "$ROOT_DIR/backend-fastapi/.env.example" ] && cp "$ROOT_DIR/backend-fastapi/.env.example" "$ROOT_DIR/backend-fastapi/.env"
[ ! -f "$ROOT_DIR/backend-nodejs/.env" ] && [ -f "$ROOT_DIR/backend-nodejs/.env.example" ] && cp "$ROOT_DIR/backend-nodejs/.env.example" "$ROOT_DIR/backend-nodejs/.env"
[ ! -f "$ROOT_DIR/backend-quan-oauth2/.env" ] && [ -f "$ROOT_DIR/backend-quan-oauth2/.env.example" ] && cp "$ROOT_DIR/backend-quan-oauth2/.env.example" "$ROOT_DIR/backend-quan-oauth2/.env"

# Cap quyen thuc thi cho mvnw neu can
chmod +x "$ROOT_DIR/backend-springboot/mvnw" 2>/dev/null
chmod +x "$ROOT_DIR/backend-quan-oauth2/mvnw" 2>/dev/null

# ----------------------------------------------------------------------
# 2. TU DONG CAI DAT DEPENDENCIES / THU VIEN CHO MAY MOI
# ----------------------------------------------------------------------
echo "[BUOC 2/3] Kiem tra va tu dong cai dat thu vien..."

# Frontend
if [ ! -d "$ROOT_DIR/frontend/node_modules" ]; then
    echo "-> Dang cai dat thu vien npm cho React (chi chay lan dau)..."
    (cd "$ROOT_DIR/frontend" && npm install)
fi

# Backend NodeJS
if [ ! -d "$ROOT_DIR/backend-nodejs/node_modules" ]; then
    echo "-> Dang cai dat thu vien npm cho NodeJS (chi chay lan dau)..."
    (cd "$ROOT_DIR/backend-nodejs" && npm install)
fi

# Backend FastAPI (Python)
if [ ! -d "$ROOT_DIR/backend-fastapi/venv" ]; then
    echo "-> Dang tao moi truong ao Python venv..."
    (cd "$ROOT_DIR/backend-fastapi" && python3 -m venv venv)
    echo "-> Dang cai dat requirements.txt vao venv..."
    "$ROOT_DIR/backend-fastapi/venv/bin/pip" install -r "$ROOT_DIR/backend-fastapi/requirements.txt"
fi

echo ""
echo "======================================================================"
echo " CAC THU VIEN DA SAN SANG! DANG MO CAC TAB/CUA SO TERMINAL..."
echo "======================================================================"
echo ""

# ----------------------------------------------------------------------
# 3. KHOI DONG DONG THOI 5 DICH VU (Ho tro ca AppleScript Terminal hoac chay ngam)
# ----------------------------------------------------------------------

if [[ "$OSTYPE" == "darwin"* ]]; then
    # Tren macOS: Dung AppleScript de bat cac cua so Terminal rieng biet
    osascript -e "tell application \"Terminal\" to do script \"cd '$ROOT_DIR/frontend' && npm run dev\""
    sleep 1
    osascript -e "tell application \"Terminal\" to do script \"cd '$ROOT_DIR/backend-fastapi' && source venv/bin/activate && uvicorn main:app --reload --port 8000\""
    sleep 1
    osascript -e "tell application \"Terminal\" to do script \"cd '$ROOT_DIR/backend-springboot' && ./mvnw spring-boot:run\""
    sleep 1
    osascript -e "tell application \"Terminal\" to do script \"cd '$ROOT_DIR/backend-quan-oauth2' && ./mvnw spring-boot:run\""
    sleep 1
    osascript -e "tell application \"Terminal\" to do script \"cd '$ROOT_DIR/backend-nodejs' && npm run dev\""
else
    # Tren Linux: Chay cac service ngam
    (cd "$ROOT_DIR/frontend" && npm run dev) &
    (cd "$ROOT_DIR/backend-fastapi" && source venv/bin/activate && uvicorn main:app --reload --port 8000) &
    (cd "$ROOT_DIR/backend-springboot" && ./mvnw spring-boot:run) &
    (cd "$ROOT_DIR/backend-quan-oauth2" && ./mvnw spring-boot:run) &
    (cd "$ROOT_DIR/backend-nodejs" && npm run dev) &
fi

echo "======================================================================"
echo "  DA KHOI DONG THANH CONG TOAN BO 5 DICH VU TREN MAC!"
echo ""
echo "  - Frontend React:       http://localhost:5173"
echo "  - FastAPI Python:       http://localhost:8000"
echo "  - Spring Boot Firebase: http://localhost:8080"
echo "  - Backend Quan OAuth2:  http://localhost:8081"
echo "  - Database Viewer Quan: http://localhost:8081/database.html"
echo "  - NodeJS Express:       http://localhost:3000"
echo "======================================================================"
echo ""
echo "De dung toan bo he thong tren Mac, hay chay file: ./stop-all.sh"
