# Hướng dẫn chạy NodeJS Backend

Tài liệu này hướng dẫn cách chạy server Backend bằng NodeJS Express.

## Yêu cầu
- Đã cài đặt [Node.js](https://nodejs.org/) (phiên bản 18 trở lên).
- Đã có tệp `serviceAccountKey.json` từ Firebase (Xem [Hướng dẫn tạo Firebase Project](setup-firebase.md)).

## Bước 1: Di chuyển vào thư mục dự án
Mở terminal và di chuyển vào thư mục `backend-nodejs`:
```bash
cd backend-nodejs
```

## Bước 2: Cài đặt thư viện
```bash
npm install
```

## Bước 3: Cấu hình Service Account Key
Copy tệp `serviceAccountKey.json` mà bạn đã tải về từ Firebase vào thư mục `backend-nodejs`.

⚠️ **Lưu ý:** Đảm bảo tệp này không bị commit lên GitHub (kiểm tra file `.gitignore`).

## Bước 4: Cấu hình biến môi trường
Tạo tệp `.env` (hoặc copy từ `.env.example`) trong thư mục `backend-nodejs`:
```env
PORT=3000
GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
```

## Bước 5: Chạy Server
```bash
# Chạy ở chế độ phát triển (tự động reload khi có thay đổi code)
npm run dev
```
Server sẽ chạy tại địa chỉ: `http://localhost:3000`.

## 🧪 Test API với curl
Giả sử bạn có một ID Token từ Frontend:

**Kiểm tra public endpoint:**
```bash
curl -X GET http://localhost:3000/api/public
```

**Kiểm tra protected endpoint:**
```bash
curl -X GET http://localhost:3000/api/protected \
  -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN"
```

---

## 🛠 Troubleshooting (Sửa lỗi)
Xem phần Backend trong [Tài liệu Xử lý lỗi thường gặp](troubleshooting.md).
