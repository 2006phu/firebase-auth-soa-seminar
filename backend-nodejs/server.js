require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const path = require('path');

// Khởi tạo Express app
const app = express();

// Khởi tạo Firebase Admin SDK
// Kiểm tra xem đã khởi tạo chưa để tránh lỗi nếu chạy lại nhiều lần
if (!admin.apps.length) {
  try {
    // Đường dẫn tới file service account key
    const serviceAccountPath = process.env.FIREBASE_CREDENTIALS_PATH || 'serviceAccountKey.json';
    const serviceAccount = require(path.resolve(__dirname, serviceAccountPath));

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin SDK đã được khởi tạo thành công.');
  } catch (error) {
    console.error('Lỗi khởi tạo Firebase Admin SDK:', error.message);
    console.log('Vui lòng đảm bảo file serviceAccountKey.json tồn tại và có cấu trúc hợp lệ.');
  }
}

// Import middleware sau khi khởi tạo admin
const { verifyFirebaseToken } = require('./middleware/auth');

// Sử dụng middleware
app.use(cors()); // Cho phép tất cả các nguồn (dùng cho mục đích demo)
app.use(express.json()); // Phân tích body dưới dạng JSON

// ---------------- ENDPOINTS ---------------- //

// GET / -> Health check
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'NodeJS Express + Firebase Auth'
  });
});

// GET /api/public -> Endpoint công khai (không cần xác thực)
app.get('/api/public', (req, res) => {
  res.status(200).json({
    message: 'Đây là public endpoint. Không yêu cầu xác thực.',
    service: 'NodeJS Express'
  });
});

// GET /api/protected -> Endpoint bảo mật (yêu cầu xác thực)
app.get('/api/protected', verifyFirebaseToken, (req, res) => {
  res.status(200).json({
    message: 'Bạn đã truy cập thành công vào protected endpoint!',
    service: 'NodeJS Express',
    user: {
      uid: req.user.uid,
      email: req.user.email
    }
  });
});

// GET /api/user-info -> Trả về toàn bộ thông tin user từ token
app.get('/api/user-info', verifyFirebaseToken, (req, res) => {
  res.status(200).json({
    message: 'Thông tin user từ Firebase Token',
    user: req.user
  });
});

// Middleware xử lý lỗi toàn cục
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Đã xảy ra lỗi trên máy chủ.'
  });
});

// Bắt đầu server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
  console.log('Cấu hình NodeJS backend cho Firebase Auth Seminar đã hoàn tất.');
});
