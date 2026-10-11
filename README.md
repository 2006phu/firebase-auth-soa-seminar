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

## Nhóm thực hiện
- Thành viên 1 (Placeholder)
- Thành viên 2 (Placeholder)

## License
Dự án được phân phối dưới giấy phép MIT. Chi tiết xem tại `LICENSE`.
