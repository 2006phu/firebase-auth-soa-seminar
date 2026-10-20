# Firebase Authentication Demo - SOA Seminar

**Mô tả:** Dự án demo các tính năng xác thực người dùng (Authentication) của Firebase, kết hợp với các công nghệ Backend phổ biến (FastAPI, NodeJS, Spring Boot) và Frontend (React), đồng thời tích hợp đa hệ thống liên kết danh tính (Federated Identity) với backend OAuth2 của Quân (`backend-quan-oauth2`). Dự án phục vụ cho buổi Seminar môn học Kiến trúc Hướng Dịch vụ (SOA) - Đại học Tôn Đức Thắng (TDTU).

---

## ⚡ Quick Start - Khởi Động Nhanh Hệ Thống (1-Click Run)

Dự án hỗ trợ script khởi động tự động **1 Frontend + 4 Backend** (bao gồm cả dự án OAuth2 của Quân) cho cả Windows và macOS/Linux:

### 🪟 Trên Windows:
1. Đảm bảo đã đặt file `serviceAccountKey.json` vào các thư mục backend (xem lưu ý bên dưới).
2. **Nhấp đúp chuột vào file [`start-all.bat`](start-all.bat)**:
   - Script sẽ **tự động sao chép file cấu hình `.env`** từ `.env.example` nếu máy mới chưa có.
   - Script sẽ **tự động kiểm tra và tải thư viện** (`npm install`, tạo môi trường ảo Python `venv`, `pip install`) nếu máy mới chưa cài.
   - Tự động mở đồng loạt 5 cửa sổ riêng biệt cho 5 service.
3. Khi muốn dừng toàn bộ hệ thống và giải phóng port: **Nhấp đúp chuột vào file [`stop-all.bat`](stop-all.bat)**.

### 🍏 Trên macOS / Linux:
1. Mở Terminal và di chuyển vào thư mục dự án:
   ```bash
   cd /duong/dan/toi/firebase-auth-soa-seminar
   ```
2. Cấp quyền thực thi (chỉ cần làm 1 lần đầu):
   ```bash
   chmod +x start-all.sh stop-all.sh
   ```
3. Chạy script:
   ```bash
   ./start-all.sh
   ```
4. Khi muốn tắt toàn bộ hệ thống: `./stop-all.sh`.

---

### 🌐 Bản Đồ Cổng Dịch Vụ Sau Khi Khởi Động:
| Dịch vụ | Cổng (Port) / URL | Ghi chú |
|---|---|---|
| **Frontend React** | [http://localhost:5173](http://localhost:5173) | Đăng nhập Google, Dashboard so sánh song song 2 Token |
| **Backend 1: FastAPI** | [http://localhost:8000](http://localhost:8000) | Swagger UI Docs: `http://localhost:8000/docs` |
| **Backend 2: Spring Boot Firebase** | [http://localhost:8080](http://localhost:8080) | Xác thực Firebase ID Token (RS256) |
| **Backend 3: Backend Quân OAuth2** | [http://localhost:8081](http://localhost:8081) | Cấp JWT HS384, lưu DB H2 |
| **Trang Soi DB Của Quân** | [http://localhost:8081/database.html](http://localhost:8081/database.html) | API JSON: `http://localhost:8081/api/users/database-viewer` |
| **Backend 4: NodeJS Express** | [http://localhost:3000](http://localhost:3000) | Xác thực Firebase Admin SDK |

> ⚠️ **Lưu ý quan trọng cho máy mới clone từ GitHub:**  
> File khóa bảo mật `serviceAccountKey.json` của Firebase được giữ bí mật (trong `.gitignore`). Trên máy mới, bạn cần đặt file `serviceAccountKey.json` vào:
> - `backend-fastapi/serviceAccountKey.json`
> - `backend-nodejs/serviceAccountKey.json`
> - `backend-springboot/src/main/resources/serviceAccountKey.json`

---

## 🛠️ Chạy Thủ Công Từng Dịch Vụ (Manual Setup)
Nếu muốn khởi chạy từng thành phần riêng biệt bằng tay, bạn có thể tham khảo tài liệu chi tiết:
1. **Thiết lập Firebase**: [Hướng dẫn tạo Firebase Project](docs/setup-firebase.md)
2. **Frontend React**: [Hướng dẫn chạy React Frontend](docs/setup-frontend.md)
3. **Backend Services (Tùy chọn)**:
    - [FastAPI (Python)](docs/setup-fastapi.md)
    - [NodeJS Express](docs/setup-nodejs.md)
    - [Spring Boot (Java)](docs/setup-springboot.md)
4. **Kiểm thử hệ thống**: Xem kịch bản chi tiết 10 Test Cases tại [Hướng dẫn kiểm thử (Test Guide)](docs/test-guide.md).
5. **Cheat Sheet Thuyết trình**: Copy nhanh các lệnh và link tại [Cheat Sheet Thuyết Trình](docs/cheat-sheet-thuyet-trinh.txt).
6. **Xử lý sự cố**: Xem [Hướng dẫn khắc phục lỗi (Troubleshooting)](docs/troubleshooting.md).

---

## 🚀 Tự Động Hóa Triển Khai (CI/CD Pipeline & Firebase Hosting)

Ứng dụng Frontend React được cấu hình tự động hóa toàn bộ quy trình kiểm thử, đóng gói và triển khai (CI/CD) thông qua **GitHub Actions** và phân phối trên CDN toàn cầu của **Firebase Hosting**.

* **Địa chỉ Website chính thức (Live Cloud):** [https://soa-firebase-demo-31877.web.app](https://soa-firebase-demo-31877.web.app)
* **Tệp cấu hình Workflow:** [`.github/workflows/firebase-hosting-merge.yml`](.github/workflows/firebase-hosting-merge.yml)
* **📖 Hướng dẫn tự thiết lập Step-by-Step từ A-Z:** [Tài liệu hướng dẫn CI/CD GitHub Actions & Firebase Hosting](docs/huong-dan-thiet-lap-cicd-github.md)

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
