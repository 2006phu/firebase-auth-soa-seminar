# Firebase Authentication Demo - SOA Seminar

**Mô tả:** Dự án demo các tính năng xác thực người dùng (Authentication) của Firebase, kết hợp với các công nghệ Backend phổ biến (FastAPI, NodeJS, Spring Boot) và Frontend (React). Dự án này phục vụ cho buổi Seminar môn học Kiến trúc Hướng Dịch vụ (SOA).

## Kiến trúc tổng quan

```text
+-------------------+        Firebase SDK       +----------------------+
|                   | <-----------------------> |                      |
|  React Frontend   |                           |  Firebase Auth &     |
| (Vite + Tailwind) |        Token (JWT)        |  Google Cloud        |
|                   | ------------------------> |                      |
+-------------------+                           +----------------------+
          |                                                ^
          | HTTP Requests with                             |
          | Authorization: Bearer <token>                  |
          v                                                | Verify Token
+-------------------+                                      | (Firebase Admin)
|                   |                                      |
| Backend Services  | -------------------------------------+
| (Choose One)      |
| - FastAPI         |
| - NodeJS Express  |
| - Spring Boot     |
+-------------------+
```

## Yêu cầu hệ thống
- Node.js 18+ (cho Frontend và NodeJS Backend)
- Python 3.10+ (cho FastAPI Backend)
- Java 17+ và Maven 3.8+ (cho Spring Boot Backend)

## Quick Start
1. **Thiết lập Firebase**: Tạo project trên Firebase Console, lấy thông tin cấu hình và Service Account Key. Xem chi tiết tại [Hướng dẫn tạo Firebase Project](docs/setup-firebase.md).
2. **Chạy Frontend**: Xem chi tiết tại [Hướng dẫn chạy React Frontend](docs/setup-frontend.md).
3. **Chạy (chọn 1) Backend**:
    - [FastAPI](docs/setup-fastapi.md)
    - [NodeJS](docs/setup-nodejs.md)
    - [Spring Boot](docs/setup-springboot.md)
4. **Kiểm thử toàn bộ hệ thống**: Xem kịch bản chi tiết tại [Hướng dẫn kiểm thử (Test Guide)](docs/test-guide.md).
5. **Xử lý sự cố**: Xem [Hướng dẫn khắc phục lỗi (Troubleshooting)](docs/troubleshooting.md).

## Tính năng Demo
- Đăng ký tài khoản (Email/Password)
- Đăng nhập (Email/Password)
- Đăng nhập với Google (OAuth)
- Đăng xuất
- Xác thực token JWT ở Backend để bảo vệ API (Protected Routes)

## Tech Stack
| Thành phần | Công nghệ | Chi tiết |
|------------|-----------|----------|
| Frontend   | React 18, Vite, Tailwind CSS | Firebase SDK v9 (Client) |
| Backend 1  | Python FastAPI | firebase-admin |
| Backend 2  | NodeJS Express | firebase-admin |
| Backend 3  | Java Spring Boot 3 | Spring Security, firebase-admin |

## 🚀 Tự Động Hóa Triển Khai (CI/CD Pipeline & Firebase Hosting)

Ứng dụng Frontend React được cấu hình tự động hóa toàn bộ quy trình kiểm thử, đóng gói và triển khai (CI/CD) thông qua **GitHub Actions** và phân phối trên CDN toàn cầu của **Firebase Hosting**.

* **Địa chỉ Website chính thức (Live Cloud):** [https://soa-firebase-demo-31877.web.app](https://soa-firebase-demo-31877.web.app)
* **Tệp cấu hình Workflow:** [`.github/workflows/firebase-hosting-merge.yml`](.github/workflows/firebase-hosting-merge.yml)

### Quy trình hoạt động (Workflow Pipeline):
```text
[Developer Push Code] ──► [GitHub Actions Trigger] ──► [Automated Build] ──► [Firebase Hosting Deploy]
(Nhánh main / dispatch)    (Ubuntu Runner ảo)          (npm ci & build)      (Live on *.web.app)
```

---

### 🧪 Hướng Dẫn Kiểm Thử CI/CD (Test CI/CD Pipeline)

Bạn có thể kiểm thử tính năng tự động hóa triển khai bằng một trong 2 cách:

#### Cách 1: Kích hoạt thủ công từ giao diện GitHub (Manual Trigger - Nhanh nhất)
1. Truy cập vào kho mã nguồn trên GitHub: [github.com/2006phu/firebase-auth-soa-seminar/actions](https://github.com/2006phu/firebase-auth-soa-seminar/actions).
2. Tại cột bên trái, chọn workflow: **`Deploy to Firebase Hosting on merge`**.
3. Bấm vào nút màu xanh **"Run workflow"** ở góc bên phải $\rightarrow$ Chọn nhánh `main` $\rightarrow$ Bấm nút xanh **"Run workflow"**.
4. Quan sát trực tiếp:
   - Một tiến trình mới xuất hiện với **Animation xoay tròn màu vàng** (`In Progress`).
   - Click vào xem chi tiết: Các node `Setup Node.js 20` $\rightarrow$ `Install dependencies` $\rightarrow$ `Build frontend` $\rightarrow$ `Deploy to Firebase Hosting` lần lượt chuyển thành **dấu tích xanh ✅**.
5. Sau khi tiến trình báo thành công (~1-2 phút), mở trang [https://soa-firebase-demo-31877.web.app](https://soa-firebase-demo-31877.web.app) và bấm `Ctrl + F5` để kiểm chứng bản web mới nhất.

#### Cách 2: Kiểm thử trực quan thông qua Git Push (Full Flow)
1. Mở file giao diện bất kỳ (ví dụ: `frontend/src/components/Login.jsx`).
2. Thay đổi một dòng chữ nhỏ hiển thị (ví dụ: thêm nhãn `[TEST CI/CD]`).
3. Commit và push code lên nhánh chính:
   ```bash
   git commit -am "test: verify automated CI/CD pipeline deployment"
   git push origin main
   ```
4. Mở tab **Actions** trên GitHub để theo dõi tiến trình tự động biên dịch và triển khai.
5. Kiểm tra trực tiếp trên trang [https://soa-firebase-demo-31877.web.app](https://soa-firebase-demo-31877.web.app) để thấy giao diện vừa sửa đổi xuất hiện mà không cần thao tác deploy thủ công.

---

## Nhóm thực hiện
* **Lê Phú** — MSSV: `524H0121`
* **Vũ Giang Huy** — MSSV: `524H0095`
* **Học phần:** Kiến trúc Hướng Dịch vụ (SOA) — Đại học Tôn Đức Thắng (TDTU)

## License
Dự án được phân phối dưới giấy phép MIT. Chi tiết xem tại `LICENSE`.
