# Xử lý lỗi thường gặp (Troubleshooting)

Tài liệu này tổng hợp các lỗi phổ biến mà người mới bắt đầu thường gặp khi thiết lập và sử dụng Firebase Authentication.

## 1. Các lỗi liên quan đến Firebase Client (Frontend)

### Lỗi: `auth/invalid-api-key`
- **Mô tả:** Frontend báo lỗi API key không hợp lệ hoặc bị thiếu.
- **Nguyên nhân:** Bạn chưa cấu hình đúng biến môi trường `.env` ở Frontend hoặc copy sai API Key.
- **Cách khắc phục:**
  1. Kiểm tra lại file `.env` trong thư mục `frontend/`.
  2. Đảm bảo các biến bắt đầu bằng `VITE_` (nếu dùng Vite).
  3. Khởi động lại Frontend server (`npm run dev`).

### Lỗi: `auth/user-not-found` hoặc `auth/wrong-password`
- **Mô tả:** Đăng nhập thất bại.
- **Nguyên nhân:** Sai email hoặc mật khẩu, hoặc người dùng chưa đăng ký.
- **Cách khắc phục:** Kiểm tra lại thông tin trên giao diện Firebase Console (Tab Authentication -> Users).

### Lỗi: `auth/operation-not-allowed`
- **Mô tả:** Phương thức đăng nhập bị chặn.
- **Nguyên nhân:** Bạn chưa bật nhà cung cấp xác thực (Email/Password hoặc Google) trên Firebase Console.
- **Cách khắc phục:** Xem lại Bước 2 và 3 trong [Hướng dẫn tạo Firebase Project](setup-firebase.md).

## 2. Các lỗi liên quan đến Backend & Firebase Admin

### Lỗi: `Error while parsing service account key` hoặc `File not found`
- **Mô tả:** Backend không khởi động được hoặc báo lỗi liên quan đến credentials.
- **Nguyên nhân:** Không tìm thấy tệp `serviceAccountKey.json` hoặc đường dẫn bị sai.
- **Cách khắc phục:**
  - **FastAPI/NodeJS:** Đảm bảo file `serviceAccountKey.json` nằm cùng thư mục gốc của backend và tên file chính xác.
  - **Spring Boot:** Đảm bảo file nằm trong `src/main/resources/`.

### Lỗi: `auth/id-token-expired`
- **Mô tả:** Backend từ chối request với mã lỗi 401 Unauthorized.
- **Nguyên nhân:** Firebase ID Token (JWT) do Frontend gửi lên đã hết hạn (Token của Firebase thường chỉ có hiệu lực 1 giờ).
- **Cách khắc phục:**
  - Tại Frontend, đăng nhập lại hoặc làm mới trang để lấy token mới.
  - Sử dụng phương thức `getIdToken(true)` trên Frontend để ép buộc làm mới token.

### Lỗi: `FirebaseAppError: Credential implementation provided to initializeApp() via the "credential" property failed`
- **Mô tả:** Lỗi khởi tạo Firebase Admin SDK.
- **Nguyên nhân:** serviceAccountKey.json bị thiếu thông tin hoặc quyền truy cập tài khoản Google Cloud bị huỷ.
- **Cách khắc phục:** Tạo lại một Service Account Key mới từ Firebase Console và ghi đè file cũ.

## 3. Các lỗi mạng và trình duyệt

### Lỗi: CORS (Cross-Origin Resource Sharing) Error
- **Mô tả:** Trình duyệt chặn request (màu đỏ trong tab Network của DevTools).
- **Nguyên nhân:** Frontend chạy ở port 5173 gọi API đến Backend ở port 8000/3000/8080 nhưng Backend chưa cấu hình cho phép tên miền (origin) này.
- **Cách khắc phục:**
  - **FastAPI:** Sử dụng `CORSMiddleware` và thêm `http://localhost:5173` vào danh sách `allow_origins`.
  - **NodeJS:** Sử dụng package `cors` và cấu hình tương tự.
  - **Spring Boot:** Sử dụng annotation `@CrossOrigin(origins = "http://localhost:5173")` hoặc cấu hình toàn cục.

### Lỗi: Cổng (Port) đã được sử dụng
- **Mô tả:** `Error: listen EADDRINUSE: address already in use :::3000` hoặc tương tự.
- **Nguyên nhân:** Có một tiến trình khác đang chạy trên cổng mạng bạn muốn dùng.
- **Cách khắc phục:**
  - Tìm và tắt tiến trình cũ.
  - Hoặc thay đổi cổng chạy Backend trong tệp cấu hình/ `.env`.
