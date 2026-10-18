# Hướng dẫn tạo Firebase Project

Tài liệu này hướng dẫn cách tạo và cấu hình một dự án trên Firebase để sử dụng cho Frontend và Backend.

## Bước 1: Tạo project trên Firebase Console
1. Truy cập [Firebase Console](https://console.firebase.google.com/).
2. Đăng nhập bằng tài khoản Google của bạn.
3. Nhấp vào **"CREATE Add project"** (Thêm dự án).
4. Nhập tên dự án (VD: `soa-firebase-demo`).
5. (Tuỳ chọn) Bạn có thể vô hiệu hoá Google Analytics cho dự án demo này.
6. Nhấp **"Create project"**.

## Bước 2: Bật xác thực Email/Password
1. Trong menu bên trái của Firebase Console, chọn **"Security"** -> **"Authentication"**.
2. Nhấp vào nút **"Get started"**.
3. Chuyển sang tab **"Sign-in method"**.
4. Trong phần **"Native providers"**, chọn **"Email/Password"**.
5. Bật công tắc **"Enable"** (chỉ cần dòng đầu, dòng "Email link" có thể để tắt).
6. Nhấp **"Save"**.

## Bước 3: Bật xác thực Google Sign-In
1. Vẫn ở tab **"Sign-in method"**, nhấp vào **"Add new provider"**.
2. Chọn **"Google"**.
3. Bật công tắc **"Enable"**.
4. Chọn một email hỗ trợ (Project support email).
5. Nhấp **"Save"**.

## Bước 4: Tạo Web App và lấy thông tin cấu hình (Frontend)
1. Quay lại trang chủ dự án (Project Overview) bằng cách nhấp vào biểu tượng ngôi nhà ở góc trên bên trái.
2. Nhấp vào biểu tượng **Web** (`</>`) để thêm một ứng dụng web.
3. Nhập tên ứng dụng (VD: `demo-frontend`). Không cần chọn "Also set up Firebase Hosting".
4. Nhấp **"Register app"**.
5. Bạn sẽ thấy một đoạn code chứa cấu hình Firebase (`firebaseConfig`). Sao chép các giá trị như `apiKey`, `authDomain`, `projectId`, ... để sử dụng cho Frontend sau này.
6. Nhấp **"Continue to console"**.

## Bước 5: Tạo Service Account Key (Backend)
1. Trong Project Overview, nhấp vào biểu tượng bánh răng ⚙️ (Settings) và chọn **"General"**.
2. Chuyển sang tab **"Service accounts"**.
3. Đảm bảo **"Firebase Admin SDK"** đang được chọn và ngôn ngữ là Node.js/Python/Java.
4. Nhấp vào nút **"Generate new private key"**.
5. Một cảnh báo sẽ hiện ra, nhấp **"Generate key"**.
6. Một tệp JSON sẽ được tải xuống máy của bạn. Đổi tên tệp này thành `serviceAccountKey.json`.

⚠️ **CẢNH BÁO BẢO MẬT QUAN TRỌNG:** Tệp `serviceAccountKey.json` chứa khoá bí mật để truy cập dự án Firebase của bạn với quyền Admin. **TUYỆT ĐỐI KHÔNG** commit tệp này lên GitHub hoặc chia sẻ công khai. Đảm bảo rằng nó đã được thêm vào `.gitignore` trong thư mục Backend.

## Bước 6: Thêm cấu hình vào dự án
- **Đối với Frontend:** Tạo file `.env` trong thư mục `frontend/` và điền các thông tin từ Bước 4. (Xem hướng dẫn frontend).
- **Đối với Backend:** Copy tệp `serviceAccountKey.json` vào thư mục của Backend bạn muốn chạy (VD: `backend-fastapi/`, `backend-nodejs/`, hoặc `backend-springboot/src/main/resources/`).
