# Hướng dẫn chạy React Frontend

Tài liệu này hướng dẫn cách chạy ứng dụng Frontend (React 18 + Vite).

## Yêu cầu
- Đã cài đặt [Node.js](https://nodejs.org/) (phiên bản 18 trở lên).
- Đã tạo Firebase project và lấy được thông tin `firebaseConfig` (Xem [Hướng dẫn tạo Firebase Project](setup-firebase.md)).

## Bước 1: Cài đặt thư viện
Mở terminal, di chuyển vào thư mục `frontend` và chạy lệnh cài đặt:
```bash
cd frontend
npm install
```

## Bước 2: Cấu hình biến môi trường Firebase
1. Trong thư mục `frontend`, tìm tệp `.env.example` (nếu có) hoặc tạo một tệp mới tên là `.env`.
2. Sao chép nội dung cấu hình từ Firebase Console (ở bước tạo Web App) vào tệp `.env` theo định dạng sau:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```
💡 **Mẹo:** Các biến môi trường trong Vite phải bắt đầu bằng `VITE_`.

## Bước 3: Khởi chạy ứng dụng
Chạy lệnh sau để khởi động server phát triển:
```bash
npm run dev
```

## Bước 4: Truy cập ứng dụng
Mở trình duyệt và truy cập địa chỉ: [http://localhost:5173](http://localhost:5173).

---

## 🛠 Troubleshooting (Sửa lỗi)
Nếu gặp lỗi, hãy xem phần Frontend trong [Tài liệu Xử lý lỗi thường gặp](troubleshooting.md).
