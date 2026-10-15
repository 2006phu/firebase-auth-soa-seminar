# Hướng Dẫn Chạy & Demo Đồng Thời 2 Dự Án (Firebase + OAuth2)

Dự án của Quân (`soa-auth-system`) đã được clone về thư mục `backend-quan-oauth2`, tích hợp cổng nhận **Google ID Token** từ Firebase, và cấu hình chạy trên cổng **`8081`** với cơ sở dữ liệu nhúng H2 (sẵn sàng hoạt động ngay mà không cần cài đặt thêm bất kỳ thứ gì).

---

## 🌐 BẢN ĐỒ CỔNG DỊCH VỤ TRÊN MÁY TÍNH

| Dịch vụ | Cổng (Port) / Địa chỉ | Chức năng |
|---|---|---|
| **Frontend React** | `http://localhost:5173`<br>*(hoặc Cloud `https://soa-firebase-demo-31877.web.app`)* | Giao diện người dùng (Đăng nhập Google, Dashboard hiển thị song song 2 Token) |
| **Backend Firebase (Bạn)** | `http://localhost:8000` (FastAPI)<br>hoặc `http://localhost:8080` (Spring Boot) | Xác thực Firebase ID Token (RS256 với Google JWKS) |
| **Backend OAuth2 (Quân)** | `http://localhost:8081` | Xác thực Google ID Token, cấp JWT (HMAC-384), quản lý User Database |
| **Trang Soi Database Quân** | `http://localhost:8081/database.html` | Xem trực tiếp danh sách Users và Google Identities đã được đồng bộ |

---

## 🚀 HƯỚNG DẪN KHỞI ĐỘNG 2 BACKEND CÙNG LÚC

### 1. Khởi động Backend của Quân (Cổng 8081):
Mở một cửa sổ Terminal mới:
```powershell
cd d:\University\SOA\Seminar\backend-quan-oauth2
.\mvnw.cmd spring-boot:run
```
> Khi màn hình hiện `Started SoaAuthSystemApplication in ... seconds` trên cổng **8081** là thành công!

### 2. Khởi động Backend Firebase của bạn:
Mở một cửa sổ Terminal thứ hai:
* **Nếu dùng FastAPI (Khuyên dùng - Cổng 8000):**
  ```powershell
  cd d:\University\SOA\Seminar\backend-fastapi
  uvicorn main:app --reload --port 8000
  ```
* **Hoặc nếu dùng Spring Boot Firebase (Cổng 8080):**
  ```powershell
  cd d:\University\SOA\Seminar\backend-springboot
  .\mvnw.cmd spring-boot:run
  ```

### 3. Khởi động Frontend:
Mở một cửa sổ Terminal thứ ba (hoặc dùng bản web trên Cloud):
```powershell
cd d:\University\SOA\Seminar\frontend
npm run dev
```

---

## 🎬 KỊCH BẢN LIVE DEMO ĐỈNH CAO TRƯỚC LỚP (3 PHÚT)

#### 📍 Bước 1: Mở sẵn các tab trên trình duyệt
1. Tab 1: Trang web của bạn: `http://localhost:5173/login` (hoặc trang web Cloud).
2. Tab 2: Trang soi database của Quân: `http://localhost:8081/database.html` (Hiện đang có 0 Users).

#### 📍 Bước 2: Bấm Đăng nhập Google (1 cú click)
* Tại Tab 1, bấm nút **"Đăng nhập với Google"** $\rightarrow$ Chọn tài khoản Gmail của bạn.
* Trình duyệt tự chuyển vào trang Dashboard.

#### 📍 Bước 3: Chỉ cho Thầy và cả lớp thấy 2 Token song song
* **Thẻ 1 (Màu trắng):** `Firebase ID Token (JWT)` do Google Firebase cấp.
* **Thẻ 2 (Màu tím nổi bật):** `Đồng Bộ Đa Hệ Thống: OAuth2 Token (Backend của Quân)`:
  * Nổi bật huy hiệu: `ROLE_PERSONAL` (hoặc `ROLE_STUDENT` nếu dùng mail trường).
  * Chuỗi token JWT được ký số bằng thuật toán `HMAC-SHA384`.
  * Có nút copy và nút **"Giải mã trên jwt.io"** để soi thông tin bên trong.

#### 📍 Bước 4: Kiểm chứng dữ liệu chui vào Database của Quân
* Chuyển sang Tab 2 (`http://localhost:8081/database.html`) và bấm **F5 (Reload)**.
* **Khoảnh khắc ấn tượng:** Cả lớp sẽ thấy dòng dữ liệu tài khoản của bạn (Email, Tên, Role) vừa được tự động insert vào bảng Database!

#### 📍 Lê Phú thuyết minh chốt hạ:
> *"Kính thưa Thầy, đây là minh chứng rõ ràng nhất cho kiến trúc hướng dịch vụ **SOA & Federated Identity**:  
> Người dùng chỉ cần đăng nhập danh tính **Google 1 lần duy nhất**, Client đã trích xuất vé số danh tính gốc và tự động đồng bộ sang cả 2 hệ thống độc lập:  
> 1. Hệ thống của nhóm em nhận diện bằng **Firebase Admin SDK**.  
> 2. Hệ thống của bạn Quân xác thực chữ ký và cấp **Custom JWT** lưu vào Database.  
> Cả 2 hệ thống hoạt động hoàn toàn phi tập trung (Decoupled) mà vẫn chia sẻ chung một nguồn danh tính duy nhất!"*
