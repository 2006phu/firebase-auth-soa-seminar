# Hướng dẫn chạy FastAPI Backend

Tài liệu này hướng dẫn cách chạy server Backend bằng Python FastAPI.

## Yêu cầu
- Đã cài đặt [Python](https://www.python.org/) (phiên bản 3.10 trở lên).
- Đã có tệp `serviceAccountKey.json` từ Firebase (Xem [Hướng dẫn tạo Firebase Project](setup-firebase.md)).

## Bước 1: Di chuyển vào thư mục dự án
Mở terminal và di chuyển vào thư mục `backend-fastapi`:
```bash
cd backend-fastapi
```

## Bước 2: Tạo và kích hoạt môi trường ảo (Virtual Environment)
```bash
# Tạo môi trường ảo (chỉ làm lần đầu)
python -m venv venv

# Kích hoạt môi trường ảo (Windows)
.\venv\Scripts\activate

# Kích hoạt môi trường ảo (macOS/Linux)
source venv/bin/activate
```
💡 **Mẹo:** Khi môi trường ảo được kích hoạt, bạn sẽ thấy `(venv)` ở đầu dòng lệnh terminal.

## Bước 3: Cài đặt thư viện
```bash
pip install -r requirements.txt
```

## Bước 4: Cấu hình Service Account Key
Copy tệp `serviceAccountKey.json` mà bạn đã tải về từ Firebase vào thư mục `backend-fastapi`.

⚠️ **Lưu ý:** Tệp này phải nằm cùng cấp với tệp `main.py` và đã được thêm vào `.gitignore`.

## Bước 5: Cấu hình biến môi trường
Tạo tệp `.env` (hoặc copy từ `.env.example`) trong thư mục `backend-fastapi` và chỉ định đường dẫn tới key của bạn (nếu dự án yêu cầu cấu hình trong .env):
```env
FIREBASE_CREDENTIALS=serviceAccountKey.json
```

## Bước 6: Chạy Server
```bash
uvicorn main:app --reload --port 8000
```
Server sẽ chạy tại địa chỉ: `http://localhost:8000`. Bạn có thể xem tài liệu API (Swagger UI) tại: `http://localhost:8000/docs`.

## 🧪 Test API với curl
Giả sử bạn có một ID Token từ Frontend (sau khi đăng nhập):

**Kiểm tra endpoint không cần xác thực:**
```bash
curl -X GET http://localhost:8000/api/public
```

**Kiểm tra endpoint cần xác thực (Protected route):**
```bash
curl -X GET http://localhost:8000/api/protected \
  -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN"
```

---

## 🛠 Troubleshooting (Sửa lỗi)
Xem phần Backend trong [Tài liệu Xử lý lỗi thường gặp](troubleshooting.md).
