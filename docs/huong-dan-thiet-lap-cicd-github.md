# Hướng Dẫn Chi Tiết Tự Thiết Lập CI/CD GitHub Actions & Firebase Hosting (Step-by-Step)

> **Dành cho sinh viên / người nghe Seminar:** Hướng dẫn từng bước từ con số 0 để tự cấu hình quy trình DevOps tự động hóa: Mỗi khi bạn `git push` code React lên GitHub, hệ thống tự động kiểm tra, đóng gói và triển khai (Deploy) lên Cloud toàn cầu của Google Firebase Hosting.

---

## 🏗️ TỔNG QUAN LUỒNG HOẠT ĐỘNG (ARCHITECTURE)

```
[Máy tính của bạn]                [GitHub Cloud Server]                     [Google Cloud CDN]
   git push main     ───►  Máy ảo Ubuntu tự khởi chạy:               ───►  Người dùng truy cập:
                               1. Checkout mã nguồn                     https://<project>.web.app
                               2. Cài Node.js 20 & npm ci
                               3. Nạp GitHub Secrets mã hóa
                               4. Chạy `npm run build`
                               5. Đẩy dist/ lên Firebase Hosting
```

---

## 📋 CÁC BƯỚC THỰC HIỆN TỪNG BƯỚC

### BƯỚC 1: Cấu hình Firebase Hosting trên máy tính

1. **Cài đặt Firebase CLI (nếu chưa có):**
   Mở Terminal gõ:
   ```bash
   npm install -g firebase-tools
   ```

2. **Đăng nhập vào tài khoản Google của bạn:**
   ```bash
   firebase login
   ```

3. **Khởi tạo Hosting trong thư mục dự án:**
   Di chuyển vào thư mục gốc dự án và chạy:
   ```bash
   firebase init hosting
   ```
   *Khi giao diện hỏi, hãy trả lời chính xác như sau:*
   * **Please select an option:** Chọn `Use an existing project` $\rightarrow$ Chọn project Firebase của bạn.
   * **What do you want to use as your public directory?** $\rightarrow$ Gõ: `frontend/dist` (Nếu code React nằm trong thư mục `frontend/` và dùng Vite) hoặc `dist`.
   * **Configure as a single-page app (rewrite all urls to /index.html)?** $\rightarrow$ Chọn `Yes` (Rất quan trọng đối với React Router).
   * **Set up automatic builds and deploys with GitHub?** $\rightarrow$ Chọn `No` (Chúng ta sẽ tự viết file workflow chuẩn hóa ở Bước 4).

4. **Kiểm tra file `firebase.json` sinh ra ở thư mục gốc:**
   ```json
   {
     "hosting": {
       "public": "frontend/dist",
       "ignore": [
         "firebase.json",
         "**/.*",
         "**/node_modules/**"
       ],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

---

### BƯỚC 2: Tạo Firebase Service Account Key (Khóa Ủy Quyền Deploy)

Để máy chủ ảo của GitHub có quyền thay mặt bạn đẩy code lên Firebase Hosting, bạn cần cấp một **Service Account**:

1. Truy cập [Firebase Console](https://console.firebase.google.com/) $\rightarrow$ Chọn Project của bạn.
2. Bấm vào biểu tượng bánh răng ⚙️ ở góc trên bên trái $\rightarrow$ Chọn **Project settings** (Cài đặt dự án).
3. Chuyển sang tab **Service accounts**.
4. Nhìn xuống mục **Firebase Admin SDK**, bấm nút **"Generate new private key"** (Tạo khóa riêng mới).
5. Một cửa sổ cảnh báo hiện ra $\rightarrow$ Bấm **"Generate key"**.
6. Một tệp JSON sẽ được tải về máy của bạn.
7. Mở tệp JSON đó bằng Notepad hoặc VS Code $\rightarrow$ **Copy toàn bộ nội dung bên trong** (bắt đầu bằng `{"type": "service_account", ...}`).

---

### BƯỚC 3: Cấu hình GitHub Encrypted Secrets (Bảo Mật Tuyệt Đối)

> ⚠️ **Nguyên tắc vàng:** Tuyệt đối không commit API Key bí mật hay Service Account lên GitHub. Toàn bộ phải được lưu trong GitHub Secrets mã hóa chuẩn quân đội (AES-256).

1. Truy cập kho mã nguồn của bạn trên GitHub: `https://github.com/<tai-khoan>/<repo-cua-ban>`.
2. Bấm vào tab **Settings** (Cài đặt) trên thanh menu ngang.
3. Ở cột bên trái, tìm mục **Security** $\rightarrow$ chọn **Secrets and variables** $\rightarrow$ chọn **Actions**.
4. Bấm nút màu xanh **"New repository secret"** để thêm lần lượt **8 Secrets** sau:

#### 📍 Chi tiết cách lấy từng giá trị (Value) để không bị nhầm lẫn:

| Tên Secret (Name) | Nơi tìm chính xác để copy giá trị (Value) |
|---|---|
| **`FIREBASE_SERVICE_ACCOUNT`** | Mở tệp JSON tải về ở **Bước 2** và dán toàn bộ nội dung file vào đây. |
| **`VITE_FIREBASE_API_KEY`** | Vào Firebase Console $\rightarrow$ Project settings ⚙️ $\rightarrow$ tab **General** $\rightarrow$ cuộn xuống mục **Your apps** $\rightarrow$ xem dòng `apiKey: "AIzaSy..."` (chỉ copy chuỗi trong ngoặc kép). |
| **`VITE_FIREBASE_AUTH_DOMAIN`** | Cùng vị trí trên, copy dòng `authDomain: "xxx.firebaseapp.com"`. |
| **`VITE_FIREBASE_PROJECT_ID`** | Cùng vị trí trên, copy dòng `projectId: "soa-firebase-demo-31877"`. |
| **`VITE_FIREBASE_STORAGE_BUCKET`**| Cùng vị trí trên, copy dòng `storageBucket: "xxx.firebasestorage.app"`. |
| **`VITE_FIREBASE_MESSAGING_SENDER_ID`** | Cùng vị trí trên, copy dòng `messagingSenderId: "186675384660"`. |
| **`VITE_FIREBASE_APP_ID`** | Cùng vị trí trên, copy dòng `appId: "1:186675...:web:..."`. |
| **`VITE_API_BASE_URL`** | URL API Backend của bạn: Điền `http://localhost:8080` (nếu chạy local) hoặc dán link HTTPS của ngrok (ví dụ `https://porcupine-joystick-unlocked.ngrok-free.dev`). |

> 💡 **Mẹo:** Nếu trong dự án bạn đã có sẵn file `frontend/.env`, bạn chỉ cần mở file đó lên là có sẵn trọn bộ 7 biến `VITE_FIREBASE_*` và `VITE_API_BASE_URL` để copy sang trong 30 giây!

---

### BƯỚC 4: Tạo Tệp Kịch Bản GitHub Actions Workflow

> ❓ **Câu hỏi thường gặp:** *"Bước này trên GitHub có sẵn file không hay phải tạo thủ công?"*  
> 👉 **Trả lời:** File này **KHÔNG CÓ SẴN TRÊN GITHUB MẶC ĐỊNH**, bạn **PHẢI TẠO THỦ CÔNG 1 LẦN DUY NHẤT**. Bạn có thể chọn 1 trong 2 cách sau:

* **Cách 1 (Tạo trực tiếp trên giao diện GitHub Web):**
  1. Trên trang repo GitHub, bấm **"Add file"** $\rightarrow$ chọn **"Create new file"**.
  2. Tại ô tên file, gõ: `.github/workflows/firebase-hosting-merge.yml`.
  3. Dán toàn bộ nội dung code YAML bên dưới vào.
  4. Bấm nút **"Commit changes..."** để lưu.

* **Cách 2 (Tạo cục bộ bằng VS Code / IDE):**
  1. Tạo file `.github/workflows/firebase-hosting-merge.yml` trong thư mục dự án và dán nội dung YAML bên dưới.
  2. Dùng lệnh `git commit` và `git push origin main`.

#### 📄 Nội dung code YAML cần dán vào file:

```yaml
name: Deploy to Firebase Hosting on merge

# Tự động chạy khi có code push vào nhánh main hoặc bấm nút chạy thủ công
on:
  push:
    branches:
      - main
  workflow_dispatch: # Cho phép bấm Run workflow thủ công từ web GitHub

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest

    steps:
      # Bước 1: Kéo mã nguồn mới nhất về máy ảo
      - name: 📥 Checkout code
        uses: actions/checkout@v4

      # Bước 2: Cài đặt môi trường Node.js 20
      - name: 🔧 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      # Bước 3: Cài đặt thư viện dependencies chuẩn xác bằng npm ci
      - name: 📦 Install dependencies
        run: npm ci
        working-directory: frontend

      # Bước 4: Nạp Secrets và biên dịch ứng dụng React
      - name: 🏗️ Build frontend
        run: npm run build
        working-directory: frontend
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
          VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.VITE_FIREBASE_STORAGE_BUCKET }}
          VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}
          VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID }}
          VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}

      # Bước 5: Ủy quyền Service Account đẩy bản build lên CDN Firebase Hosting
      - name: 🚀 Deploy to Firebase Hosting
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: YOUR_FIREBASE_PROJECT_ID # 👈 Đổi thành Project ID của bạn
```

> **Chú ý:** Tại dòng `projectId:`, hãy điền chính xác ID dự án Firebase của bạn (ví dụ: `soa-firebase-demo-31877`).

---

### BƯỚC 5: Đẩy Lên GitHub & Tận Hưởng Thành Quả

1. Lưu toàn bộ file và gõ lệnh đẩy lên nhánh `main`:
   ```bash
   git add .
   git commit -m "feat: setup automated CI/CD pipeline with GitHub Actions"
   git push origin main
   ```

2. Mở trình duyệt vào tab **Actions** trên GitHub:
   * Bạn sẽ thấy một tiến trình mang **Animation xoay tròn màu vàng**.
   * Bấm vào xem: Từng node `Checkout` $\rightarrow$ `Setup Node` $\rightarrow$ `Install` $\rightarrow$ `Build` $\rightarrow$ `Deploy` lần lượt biến thành **dấu tích xanh ✅** trong vòng ~1 phút.

3. Mở địa chỉ trang web thật do Firebase cấp:
   👉 `https://<YOUR_FIREBASE_PROJECT_ID>.web.app`  
   🎉 Trang web đã hoạt động trực tiếp trên toàn cầu!

---

## 💡 CÁCH KIỂM TRA & XỬ LÝ LỖI PHỔ BIẾN

* **Lỗi `npm ci can only install with an existing package-lock.json`:**  
  $\rightarrow$ Đảm bảo bạn đã commit cả file `frontend/package-lock.json` lên GitHub.
* **Lỗi `Could not resolve ...` lúc Build:**  
  $\rightarrow$ Do code import sai tên file hoặc thiếu thư viện. CI/CD sẽ báo đỏ ❌ và chặn đứng quá trình deploy, bảo vệ an toàn cho trang web.
* **Lỗi `HTTP Error: 403, The caller does not have permission`:**  
  $\rightarrow$ Kiểm tra lại giá trị Secret `FIREBASE_SERVICE_ACCOUNT`. Phải copy trọn vẹn từ dấu `{` đầu tiên đến dấu `}` cuối cùng của file JSON Service Account.
