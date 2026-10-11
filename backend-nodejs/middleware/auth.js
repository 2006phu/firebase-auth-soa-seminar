const admin = require('firebase-admin');

// Hàm middleware để xác thực Firebase ID Token
const verifyFirebaseToken = async (req, res, next) => {
  // Lấy token từ header Authorization
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Không tìm thấy token hoặc định dạng token không đúng (Yêu cầu Bearer token).'
    });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    // Xác thực token bằng Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Gắn thông tin user đã được giải mã vào request object để sử dụng ở các route sau
    req.user = decodedToken;
    
    // Tiếp tục xử lý request
    next();
  } catch (error) {
    console.error('Lỗi xác thực token:', error);
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Token không hợp lệ hoặc đã hết hạn.'
    });
  }
};

module.exports = {
  verifyFirebaseToken,
  admin
};
