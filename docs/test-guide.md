# Hướng Dẫn Chi Tiết Các Bước Test Toàn Bộ Chức Năng (Test Guide)

Tài liệu này cung cấp kịch bản kiểm thử toàn diện từng bước (step-by-step) cho dự án **Firebase Authentication Seminar**, bao gồm kiểm thử giao diện React, kiểm thử xác thực 3 backend (FastAPI, NodeJS, Spring Boot), kiểm thử bảo mật API trực tiếp và kiểm tra dữ liệu trên Firebase Console.

---

## 📋 Mục lục kiểm thử
1. [Bước 0: Chuẩn bị & Khởi động các dịch vụ](#bước-0-chuẩn-bị--khởi-động-các-dịch-vụ)
2. [Test Case 1: Đăng ký tài khoản mới (Email/Password)](#test-case-1-đăng-ký-tài-khoản-mới-emailpassword)
3. [Test Case 2: Đăng nhập bằng Email/Password](#test-case-2-đăng-nhập-bằng-emailpassword)
4. [Test Case 3: Đăng nhập bằng Google (Google Sign-In)](#test-case-3-đăng-nhập-bằng-google-google-sign-in)
5. [Test Case 4: Kiểm tra và giải mã Firebase ID Token (JWT)](#test-case-4-kiểm-tra-và-giải-mã-firebase-id-token-jwt)
6. [Test Case 5: Gọi API Public & Protected trên giao diện Web](#test-case-5-gọi-api-public--protected-trên-giao-diện-web)
7. [Test Case 6: Kiểm thử bảo mật trực tiếp bằng cURL / PowerShell](#test-case-6-kiểm-thử-bảo-mật-trực-tiếp-bằng-curl--powershell)
8. [Test Case 7: Kiểm tra Route Guard & Đăng xuất](#test-case-7-kiểm-tra-route-guard--đăng-xuất)
9. [Test Case 8: Đối chiếu trên Firebase Console](#test-case-8-đối-chiếu-trên-firebase-console)
10. [Test Case 9: Kiểm thử Tự động hóa CI/CD với 3 Tình Huống Thực Chiến & Firebase Hosting](#test-case-9-kiểm-thử-tự-động-hóa-cicd-với-3-tình-huống-thực-chiến--firebase-hosting)
11. [Bảng Checklist Tổng Kết Nghiệm Thu](#bảng-checklist-tổng-kết-nghiệm-thu)

---

## Bước 0: Chuẩn bị & Khởi động các dịch vụ

### 0.1. Kiểm tra cấu hình Firebase Console
1. Truy cập [Firebase Console](https://console.firebase.google.com/) -> Chọn Project của bạn.
2. Vào **Build** -> **Authentication** -> Tab **Sign-in method**:
   - **Email/Password**: Trạng thái **Enabled**.
   - **Google**: Trạng thái **Enabled** (đã chọn Support email của bạn).
3. Vào tab **Settings** (bên cạnh Sign-in method) -> Mục **Authorized domains**:
   - Đảm bảo đã có domain `localhost`.

### 0.2. Khởi động Frontend
Mở Terminal 1:
```bash
cd frontend
npm run dev
```
👉 Truy cập: `http://localhost:5173`

### 0.3. Khởi động Backend (Chọn 1 hoặc chạy cả 3 trên các cổng khác nhau)

* **Terminal 2 - FastAPI (Port 8000)**:
  ```bash
  cd backend-fastapi
  python -m uvicorn main:app --reload --port 8000
  ```
  Kiểm tra: mở trình duyệt `http://localhost:8000` -> Thấy `{"status":"ok","service":"FastAPI + Firebase Auth"}`.

* **Terminal 3 - NodeJS Express (Port 3000)** *(tùy chọn)*:
  ```bash
  cd backend-nodejs
  npm run dev
  ```
  Kiểm tra: mở `http://localhost:3000` -> Thấy `{"status":"ok","service":"NodeJS Express + Firebase Auth"}`.

* **Terminal 4 - Spring Boot (Port 8080)** *(tùy chọn)*:
  ```bash
  cd backend-springboot
  mvn spring-boot:run
  ```
  Kiểm tra: mở `http://localhost:8080` -> Thấy `{"status":"UP","message":"Hệ thống đang hoạt động tốt!"}`.

---

## Test Case 1: Đăng ký tài khoản mới (Email/Password)

### Mục tiêu:
Kiểm tra khả năng tạo user mới trên Firebase Auth qua hàm `createUserWithEmailAndPassword`.

### Các bước thực hiện:
1. Mở trình duyệt truy cập `http://localhost:5173/login`.
2. Bấm vào liên kết **"Đăng ký ngay"** ở cuối form (chuyển hướng sang `/register`).
3. **Kịch bản kiểm tra lỗi xác thực:**
   - **Mật khẩu không khớp:**
     - Email: `demo_user@test.com`
     - Mật khẩu: `123456`
     - Xác nhận mật khẩu: `123457`
     - Bấm **"Đăng ký"** -> *Kết quả mong đợi:* Hiển thị thông báo đỏ *"Mật khẩu xác nhận không khớp."*
   - **Mật khẩu yếu:**
     - Mật khẩu & xác nhận: `123`
     - Bấm **"Đăng ký"** -> *Kết quả mong đợi:* Hiển thị thông báo *"Mật khẩu quá yếu (cần ít nhất 6 ký tự)."*
4. **Kịch bản đăng ký thành công:**
   - Email: `student_soa@test.com`
   - Mật khẩu: `Password123!`
   - Xác nhận mật khẩu: `Password123!`
   - Bấm **"Đăng ký"**.
5. **Kết quả mong đợi:**
   - Hệ thống tự động đăng nhập và chuyển hướng sang trang `/dashboard`.
   - Card người dùng hiển thị:
     - Avatar chữ cái đầu: **S**
     - Email: `student_soa@test.com`
     - UID: một chuỗi ký tự duy nhất (do Firebase sinh ra).

---

## Test Case 2: Đăng nhập bằng Email/Password

### Mục tiêu:
Kiểm tra xác thực tài khoản có sẵn qua hàm `signInWithEmailAndPassword`.

### Các bước thực hiện:
1. Ở trang Dashboard, bấm nút **"Đăng xuất"** màu đỏ để quay về `/login`.
2. **Kịch bản sai thông tin:**
   - Email: `student_soa@test.com`
   - Mật khẩu: `SaiMatKhau999`
   - Bấm **"Đăng nhập"** -> *Kết quả mong đợi:* Hiển thị lỗi *"Đăng nhập thất bại. Vui lòng kiểm tra lại email hoặc mật khẩu."*
3. **Kịch bản thành công:**
   - Email: `student_soa@test.com`
   - Mật khẩu: `Password123!`
   - Bấm **"Đăng nhập"**.
4. **Kết quả mong đợi:**
   - Đăng nhập thành công và chuyển hướng ngay vào `/dashboard`.

---

## Test Case 3: Đăng nhập bằng Google (Google Sign-In)

### Mục tiêu:
Kiểm tra luồng OAuth Popup với `signInWithPopup(auth, provider)`.

### Các bước thực hiện:
1. Đăng xuất hoặc mở cửa sổ ẩn danh (Incognito) truy cập `http://localhost:5173/login`.
2. Bấm nút **"Đăng nhập với Google"** (có logo Google).
3. **Kết quả tương tác:**
   - Một cửa sổ pop-up của Google xuất hiện yêu cầu chọn tài khoản Google.
   - Chọn tài khoản Google của bạn và bấm Tiếp tục / Cho phép.
4. **Kết quả mong đợi:**
   - Pop-up tự đóng lại.
   - Ứng dụng điều hướng sang `/dashboard`.
   - Tại trang Dashboard:
     - Hiển thị hình ảnh đại diện (avatar ảnh thật từ Google).
     - Hiển thị Tên đầy đủ (Display Name).
     - Hiển thị đúng địa chỉ Gmail của bạn.

---

## Test Case 4: Kiểm tra và giải mã Firebase ID Token (JWT)

### Mục tiêu:
Hiểu rõ cấu trúc JSON Web Token (Header, Payload, Signature) do Firebase cấp cho người dùng.

### Các bước thực hiện:
1. Tại trang `/dashboard`, cuộn xuống Card **"Firebase ID Token (JWT)"**.
2. Bấm nút **"Copy"** -> Trình duyệt báo *"Đã copy token vào clipboard!"*.
3. Bấm nút **"Giải mã trên jwt.io"**:
   - Trình duyệt tự mở tab mới `https://jwt.io?token=...`.
4. Quan sát các trường trong phần **PAYLOAD: DATA**:
   - `iss`: `https://securetoken.google.com/soa-firebase-demo-31877` (Project ID của bạn).
   - `aud`: `soa-firebase-demo-31877`.
   - `sub` hoặc `user_id`: Trùng khớp với UID hiển thị ở trang Dashboard.
   - `email`: Địa chỉ email đang đăng nhập.
   - `email_verified`: `true` (nếu dùng Google) hoặc `false` (nếu dùng email mới).
   - `exp`: Thời điểm hết hạn (mặc định sau 1 giờ).
   - `iat`: Thời điểm phát hành token.

---

## Test Case 5: Gọi API Public & Protected trên giao diện Web

### Mục tiêu:
Kiểm tra khả năng Frontend đính kèm Token `Authorization: Bearer <token>` và Backend xác thực thành công.

### 5.1. Test với FastAPI (Port 8000)
1. Tại mục **Kiểm tra API** trên Dashboard, chọn dropdown: `FastAPI (Cổng 8000)`.
2. Bấm **"Gọi Public API"**:
   - *Kết quả mong đợi:* Khung màu xanh hiển thị:
     ```json
     {
       "message": "Đây là một endpoint công khai (public). Không yêu cầu xác thực.",
       "service": "FastAPI"
     }
     ```
3. Bấm **"Gọi Protected API"**:
   - Frontend lấy token hiện tại gửi trong Header `Authorization: Bearer <token>`.
   - *Kết quả mong đợi:* Khung màu xanh hiển thị:
     ```json
     {
       "message": "Thành công! Bạn đã truy cập vào một endpoint được bảo vệ.",
       "service": "FastAPI",
       "user": {
         "uid": "...",
         "email": "..."
       }
     }
     ```

### 5.2. Test với NodeJS/Express (Port 3000) *(Nếu có chạy NodeJS)*
1. Chuyển dropdown sang: `NodeJS/Express (Cổng 3000)`.
2. Bấm **"Gọi Public API"** -> Nhận message từ NodeJS.
3. Bấm **"Gọi Protected API"** -> Nhận thông tin user đã xác thực qua NodeJS Firebase Admin SDK.

### 5.3. Test với Spring Boot (Port 8080) *(Nếu có chạy Spring Boot)*
1. Chuyển dropdown sang: `Spring Boot (Cổng 8080)`.
2. Bấm **"Gọi Public API"** -> Nhận response `{"message": "Đây là API công khai, không cần token Firebase để truy cập."}`.
3. Bấm **"Gọi Protected API"** -> Nhận response có chứa `user_id`.

---

## Test Case 6: Kiểm thử bảo mật trực tiếp bằng cURL / PowerShell

### Mục tiêu:
Chứng minh Backend thực sự bảo vệ tài nguyên và từ chối các request không hợp lệ (không dựa vào frontend).

Mở một cửa sổ PowerShell mới:

### 6.1. Gọi endpoint Public (Không cần Token)
```powershell
curl.exe -X GET http://localhost:8000/api/public
```
👉 **Kết quả:** Trả về HTTP 200 OK cùng nội dung JSON.

### 6.2. Gọi endpoint Protected KHÔNG có Token
```powershell
curl.exe -i -X GET http://localhost:8000/api/protected
```
👉 **Kết quả mong đợi:** 
- Mã lỗi **HTTP 403 Forbidden** hoặc **401 Unauthorized**.
- Body: `{"detail":"Không tìm thấy thông tin xác thực (Missing authentication credentials)"}`.

### 6.3. Gọi endpoint Protected với Token GIẢ MẠO / HỎNG
```powershell
curl.exe -i -X GET http://localhost:8000/api/protected -H "Authorization: Bearer token_gia_mao_123456"
```
👉 **Kết quả mong đợi:** 
- Mã lỗi **HTTP 401 Unauthorized**.
- Body: `{"detail":"Token không hợp lệ (Invalid token)."}`.

### 6.4. Gọi endpoint Protected với Token THẬT (Copy từ Dashboard)
```powershell
$TOKEN = "PASTE_TOKEN_VUA_COPY_O_DASHBOARD_VAO_DAY"
curl.exe -X GET http://localhost:8000/api/protected -H "Authorization: Bearer curl.exe -X GET http://localhost:8000/api/user-info -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjkwNGIwZjkxYmU2ZWIwODY3ZGFiYmFhYjU4N2RmYzJlMzNmMDBhMjQiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoicGjDuiBsw6oiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSUNYb0JSS2JWU04yTDJPTlRJNGw0cFBSd3V3V2EzWkhiQnpyNFVjMmhtd1VlX3FnPXM5Ni1jIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL3NvYS1maXJlYmFzZS1kZW1vLTMxODc3IiwiYXVkIjoic29hLWZpcmViYXNlLWRlbW8tMzE4NzciLCJhdXRoX3RpbWUiOjE3OTE4NTg5MjcsInVzZXJfaWQiOiJJU0VOWkNKVUZwUXViMXJtRDdRNFZadG82ZHkxIiwic3ViIjoiSVNFTlpDSlVGcFF1YjFybUQ3UTRWWnRvNmR5MSIsImlhdCI6MTc5MTg1ODkyNywiZXhwIjoxNzkxODYyNTI3LCJlbWFpbCI6ImxlcGh1a2FrYXNoaTNAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMDUzNTI2NjQ5NjUwOTI0MDAzNjAiXSwiZW1haWwiOlsibGVwaHVrYWthc2hpM0BnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJnb29nbGUuY29tIn19.Zv1L9HyLeZTpn5JHsHG8oYRg0g_QEcDLoKxnwlHXoZlDWhfR1sYX0W2QfMfQqOlK4K_375imHpRw_DmuBWRqynmKrwenPVP-QkgYxoucaZGSv6HTfoMz6BFidgq3bpnJszprYG0vLOUawifAPfkuyj_Vr_9fmmfl-O6H0RMGE0yIlHVHblv0znKo9WOb7m2WAT5GhbNDfQyKYD48ieVm5jJeRbjgagWx5VWQdJeQlhA1xq2WpdRe4m2oRtAiit6l2ZJruDgmbWyR5WFjeI3-dQJbhqKQzMKGpnyihZGC6Vejqab76OY3okf6HT4XAFMRjsL-UtJZwsqmYkHeit0mgQ"
```
👉 **Kết quả mong đợi:** Trả về **HTTP 200 OK** với UID và Email chính xác của user.

### 6.5. Kiểm tra endpoint lấy full user info
```powershell
curl.exe -X GET http://localhost:8000/api/user-info -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjkwNGIwZjkxYmU2ZWIwODY3ZGFiYmFhYjU4N2RmYzJlMzNmMDBhMjQiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoicGjDuiBsw6oiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSUNYb0JSS2JWU04yTDJPTlRJNGw0cFBSd3V3V2EzWkhiQnpyNFVjMmhtd1VlX3FnPXM5Ni1jIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL3NvYS1maXJlYmFzZS1kZW1vLTMxODc3IiwiYXVkIjoic29hLWZpcmViYXNlLWRlbW8tMzE4NzciLCJhdXRoX3RpbWUiOjE3OTE4NTg5MjcsInVzZXJfaWQiOiJJU0VOWkNKVUZwUXViMXJtRDdRNFZadG82ZHkxIiwic3ViIjoiSVNFTlpDSlVGcFF1YjFybUQ3UTRWWnRvNmR5MSIsImlhdCI6MTc5MTg1ODkyNywiZXhwIjoxNzkxODYyNTI3LCJlbWFpbCI6ImxlcGh1a2FrYXNoaTNAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMDUzNTI2NjQ5NjUwOTI0MDAzNjAiXSwiZW1haWwiOlsibGVwaHVrYWthc2hpM0BnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJnb29nbGUuY29tIn19.Zv1L9HyLeZTpn5JHsHG8oYRg0g_QEcDLoKxnwlHXoZlDWhfR1sYX0W2QfMfQqOlK4K_375imHpRw_DmuBWRqynmKrwenPVP-QkgYxoucaZGSv6HTfoMz6BFidgq3bpnJszprYG0vLOUawifAPfkuyj_Vr_9fmmfl-O6H0RMGE0yIlHVHblv0znKo9WOb7m2WAT5GhbNDfQyKYD48ieVm5jJeRbjgagWx5VWQdJeQlhA1xq2WpdRe4m2oRtAiit6l2ZJruDgmbWyR5WFjeI3-dQJbhqKQzMKGpnyihZGC6Vejqab76OY3okf6HT4XAFMRjsL-UtJZwsqmYkHeit0mgQ"
```
👉 **Kết quả:** Trả về toàn bộ payload đã decode bao gồm `name`, `email_verified`, `picture`, `auth_time`.

---

## Test Case 7: Kiểm tra Route Guard & Đăng xuất

### Mục tiêu:
Đảm bảo người dùng chưa đăng nhập không thể truy cập trái phép vào trang riêng tư.

### Các bước thực hiện:
1. Tại Dashboard, bấm nút **"Đăng xuất"**.
2. Bạn sẽ bị chuyển hướng về `/login`.
3. Cố tình gõ trực tiếp trên thanh địa chỉ URL: `http://localhost:5173/dashboard` và nhấn Enter.
4. **Kết quả mong đợi:**
   - Component `ProtectedRoute` phát hiện trạng thái chưa đăng nhập.
   - Lập tức chặn lại và tự động chuyển hướng người dùng về `/login`.
   - Không để lộ bất kỳ thông tin nào của Dashboard.

---

## Test Case 8: Đối chiếu trên Firebase Console

### Mục tiêu:
Xác minh tài khoản đã đăng ký được lưu trữ an toàn trên hạ tầng của Google.

### Các bước thực hiện:
1. Mở [Firebase Console](https://console.firebase.google.com/).
2. Vào **Authentication** -> Tab **Users**.
3. **Kết quả kiểm tra:**
   - Nhìn thấy danh sách tất cả các tài khoản bạn vừa tạo trong quá trình test:
     - `student_soa@test.com` (Provider: Email icon).
     - Tài khoản Gmail của bạn (Provider: Google icon, có cột Display Name và ngày đăng ký).
   - Kiểm tra cột **User UID**: Trùng khớp 100% với UID đã hiển thị trên Web Dashboard.
   - Bạn có thể thử tính năng **Disable account** hoặc **Delete account** ngay trên Console để kiểm tra tính năng quản trị.

---

## Test Case 9: Kiểm thử Tự động hóa CI/CD với 3 Tình Huống Thực Chiến & Firebase Hosting

### Mục tiêu:
Kiểm chứng tính ổn định, độ sẵn sàng cao (High Availability) và cơ chế phòng vệ Fail-Safe của pipeline DevOps tự động hóa GitHub Actions kết hợp Firebase Hosting.

---

### 🌟 Tình huống 9.1: Triển khai Thành công Mỹ mãn (Happy Path)
* **Thao tác:**
  1. Mở file `frontend/src/components/Login.jsx` trên GitHub Web, sửa dòng tiêu đề:
     `Đăng nhập vào tài khoản` $\rightarrow$ `Đăng nhập vào tài khoản (TDTU LIVE DEMO 🚀)`.
  2. Bấm **Commit changes**.
* **Kết quả quan sát:**
  - Tab **GitHub Actions** xuất hiện tiến trình với **Animation vòng tròn màu vàng xoay liên tục**.
  - Toàn bộ các node `Checkout` $\rightarrow$ `Setup Node` $\rightarrow$ `Install` $\rightarrow$ `Build` $\rightarrow$ `Deploy` đổi sang **Dấu tích xanh ✅** (~1-2 phút).
  - Mở trang [https://soa-firebase-demo-31877.web.app/login](https://soa-firebase-demo-31877.web.app/login) bấm **F5**: Tiêu đề lập tức đổi sang chữ mới mà không cần thao tác deploy thủ công.

---

### ⚠️ Tình huống 9.2: Lỗi Runtime - "Build Tích Xanh nhưng Web Trắng Bóc"
* **Bản chất kỹ thuật:** Trong JavaScript thuần, khai báo biến không hợp lệ (như một từ đứng độc lập không khai báo) không vi phạm cú pháp đóng gói nên `npm run build` vẫn pass (Build-time Success), nhưng khi trình duyệt thực thi sẽ quăng `ReferenceError` làm React sụp đổ.
* **Thao tác:**
  1. Thêm dòng `dhsfkjsndkjfndskj` vào dòng 6 của `frontend/src/components/Login.jsx`.
  2. Bấm **Commit changes**.
* **Kết quả quan sát:**
  - GitHub Actions vẫn báo **Tích xanh ✅ (Success)**.
  - Nhưng khi F5 trang [https://soa-firebase-demo-31877.web.app/login](https://soa-firebase-demo-31877.web.app/login): Màn hình bị **TRẮNG BÓC (White Screen of Death)**.
  - Bấm **F12** $\rightarrow$ Tab **Console**: Thấy rõ lỗi đỏ: `Uncaught ReferenceError: dhsfkjsndkjfndskj is not defined`.
  - *Ý nghĩa:* Minh họa lý do doanh nghiệp cần bổ sung automated tests (Jest/Vitest) hoặc TypeScript vào pipeline CI/CD.

---

### 🛡️ Tình huống 9.3: Lỗi Build-time & Cơ Chế Fail-Safe - "CI/CD Chặn Đứng, Web Vẫn Sống"
* **Bản chất kỹ thuật:** Khi gặp lỗi biên dịch thực sự (Compile-time Error / Missing Module), pipeline CI/CD sẽ lập tức ngắt quy trình (Fail-Safe), hủy bước Deploy để bảo vệ người dùng.
* **Thao tác:**
  1. Sửa dòng lỗi trên thành: `import ThuVienAo from './FileKhongTonTai';`.
  2. Bấm **Commit changes**.
* **Kết quả quan sát:**
  - Tab GitHub Actions: Bước `Build frontend (npm run build)` văng lỗi **DẤU NHÂN ĐỎ ❌ (Failed)** với thông báo: `Could not resolve "./FileKhongTonTai"`.
  - Bước `Deploy to Firebase Hosting` bị **GẠCH XÁM (SKIPPED - BỊ CHẶN HOÀN TOÀN)**!
  - F5 trang [https://soa-firebase-demo-31877.web.app/login](https://soa-firebase-demo-31877.web.app/login): Trang web **VẪN HOẠT ĐỘNG BÌNH THƯỜNG**, không bị sập hay gián đoạn dịch vụ nhờ Firebase giữ nguyên phiên bản ổn định trước đó (Zero-Downtime).

---

### 🔍 Thao tác Đối Soát Trên Firebase Console:
1. Mở [Firebase Console](https://console.firebase.google.com/) $\rightarrow$ Chọn project `soa-firebase-demo-31877`.
2. Vào **Hosting & Serverless** $\rightarrow$ **Hosting**.
3. Cuộn đến bảng **Release history (Lịch sử phát hành)**:
   - Thấy danh sách từng bản build do `github-actions[bot]` đẩy lên.
   - Bản hiện tại mang nhãn `Current`.
   - Bấm vào menu 3 chấm (⋮) để quan sát tính năng **Rollback** (khôi phục bản cũ tức thì).

---

## Bảng Checklist Tổng Kết Nghiệm Thu

| STT | Hạng mục kiểm thử | Kết quả mong đợi | Đánh giá |
|:---:|---|---|:---:|
| 1 | Đăng ký Email/Pass | Kiểm tra mật khẩu khớp, mật khẩu $\ge$ 6 ký tự, tạo user thành công | ⬜ Đạt |
| 2 | Đăng nhập Email/Pass | Đăng nhập đúng vào dashboard, sai báo lỗi rõ ràng | ⬜ Đạt |
| 3 | Đăng nhập Google (OAuth) | Hiện popup, chọn tài khoản, hiển thị tên + avatar | ⬜ Đạt |
| 4 | Token JWT | Hiển thị token, copy được, giải mã đúng trên jwt.io | ⬜ Đạt |
| 5 | Call Public API | Thành công không cần token trên cả 3 backend | ⬜ Đạt |
| 6 | Call Protected API | Gửi Bearer token, backend verify thành công trả về UID | ⬜ Đạt |
| 7 | Bảo mật API (cURL) | Chặn 401/403 khi không có token hoặc token giả mạo | ⬜ Đạt |
| 8 | Protected Route | Chặn người chưa đăng nhập truy cập vào `/dashboard` | ⬜ Đạt |
| 9 | Đăng xuất | Xóa session, điều hướng về `/login` | ⬜ Đạt |
| 10 | Firebase Console Sync | User hiển thị đầy đủ trong tab Authentication | ⬜ Đạt |
| 11 | CI/CD Happy Path (9.1) | Commit code đúng $\rightarrow$ Animation xoay $\rightarrow$ Tích xanh ✅ $\rightarrow$ Web cập nhật | ⬜ Đạt |
| 12 | CI/CD Runtime Error (9.2) | Build xanh nhưng Web trắng bóc $\rightarrow$ Bật F12 Console thấy ReferenceError | ⬜ Đạt |
| 13 | CI/CD Fail-Safe (9.3) | Lỗi build $\rightarrow$ CI/CD báo đỏ ❌ chặn deploy $\rightarrow$ Web vẫn chạy bình thường | ⬜ Đạt |
| 14 | Firebase Release History | Đối soát danh sách deploy, snapshot phiên bản và nút Rollback | ⬜ Đạt |



