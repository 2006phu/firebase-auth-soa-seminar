# Hướng dẫn chạy Spring Boot Backend

Tài liệu này hướng dẫn cách chạy server Backend bằng Java Spring Boot.

## Yêu cầu
- Đã cài đặt [Java Development Kit (JDK)](https://adoptium.net/) (phiên bản 17 trở lên).
- Đã cài đặt [Maven](https://maven.apache.org/) (phiên bản 3.8 trở lên).
- Đã có tệp `serviceAccountKey.json` từ Firebase.

## Bước 1: Di chuyển vào thư mục dự án
Mở terminal và di chuyển vào thư mục `backend-springboot`:
```bash
cd backend-springboot
```

## Bước 2: Cấu hình Service Account Key
Copy tệp `serviceAccountKey.json` mà bạn đã tải về từ Firebase vào thư mục resources của dự án:
`backend-springboot/src/main/resources/serviceAccountKey.json`

⚠️ **Lưu ý:** Kiểm tra file `.gitignore` để đảm bảo tệp JSON trong thư mục resources không bị commit.

## Bước 3: Cấu hình application.properties (nếu cần)
Mở tệp `src/main/resources/application.properties` (hoặc `.yml`) và kiểm tra xem có cần thiết lập đường dẫn đến key không. (Ví dụ: `firebase.credential.path=classpath:serviceAccountKey.json`).

## Bước 4: Khởi chạy ứng dụng
Chạy ứng dụng bằng Maven:
```bash
mvn spring-boot:run
```
Server sẽ khởi động tại cổng mặc định là `8080`. Địa chỉ truy cập: `http://localhost:8080`.

## 🧪 Test API với curl
Giả sử bạn có ID Token:

**Gọi API bảo mật:**
```bash
curl -X GET http://localhost:8080/api/protected \
  -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN"
```

---

## 🛠 Troubleshooting (Sửa lỗi)
Xem phần Backend trong [Tài liệu Xử lý lỗi thường gặp](troubleshooting.md).
