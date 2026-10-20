#!/bin/bash

# ======================================================================
#       DUNG TOAN BO HE THONG SEMINAR SOA CHO MACOS / LINUX
# ======================================================================

echo "======================================================================"
echo "    DANG DUNG TOAN BO HE THONG SEMINAR SOA TREN MAC"
echo "    (Giai phong cac port: 5173, 8000, 8080, 8081, 3000)"
echo "======================================================================"
echo ""

PORTS=(5173 8000 8080 8081 3000)

for PORT in "${PORTS[@]}"; do
    PID=$(lsof -ti :"$PORT" 2>/dev/null)
    if [ -n "$PID" ]; then
        echo "Dang tat tien trinh o port $PORT (PID: $PID)..."
        kill -9 $PID 2>/dev/null
    fi
done

echo ""
echo "======================================================================"
echo "  DA GIAI PHONG TAT CA CAC PORT THANH CONG!"
echo "======================================================================"
