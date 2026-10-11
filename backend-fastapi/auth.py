import os
import firebase_admin
from firebase_admin import credentials, auth
from fastapi import HTTPException, Security, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv

# Tải các biến môi trường từ file .env
load_dotenv()

# Khởi tạo Firebase Admin SDK
# Đầu tiên, kiểm tra xem đã cấu hình đường dẫn tới file credentials chưa
cred_path = os.getenv("FIREBASE_CREDENTIALS_PATH", "serviceAccountKey.json")

try:
    if not firebase_admin._apps:
        # Tải thông tin xác thực từ file JSON
        cred = credentials.Certificate(cred_path)
        # Khởi tạo ứng dụng Firebase với credentials
        default_app = firebase_admin.initialize_app(cred)
        print("Firebase Admin SDK initialized successfully.")
except Exception as e:
    print(f"Firebase Admin SDK initialization error: {e}")
    # Chú ý: Trong môi trường production, bạn có thể muốn xử lý lỗi này một cách nghiêm ngặt hơn
    # Ở đây chúng ta in ra lỗi nhưng không làm ứng dụng crash ngay lập tức
    pass

# Sử dụng HTTPBearer để tự động trích xuất token từ Header Authorization
# auto_error=False cho phép chúng ta tự xử lý lỗi tùy chỉnh nếu token bị thiếu
security = HTTPBearer(auto_error=False)

def verify_firebase_token(token: str):
    """
    Hàm này nhận một Firebase ID token và xác thực nó qua Firebase Admin SDK.
    Trả về thông tin đã giải mã nếu hợp lệ, ngược lại ném lỗi HTTP.
    """
    try:
        # Xác thực token với Firebase
        # check_revoked=True kiểm tra xem token đã bị thu hồi chưa
        decoded_token = auth.verify_id_token(token, check_revoked=True)
        return decoded_token
    except auth.ExpiredIdTokenError:
        # Token đã hết hạn
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token đã hết hạn (Token expired). Vui lòng đăng nhập lại.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except auth.RevokedIdTokenError:
        # Token đã bị thu hồi
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token đã bị thu hồi (Token revoked). Vui lòng đăng nhập lại.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except auth.InvalidIdTokenError:
        # Token không hợp lệ
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token không hợp lệ (Invalid token).",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token không đúng định dạng.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        # Lỗi khác
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi xác thực: {str(e)}",
        )

def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    """
    Dependency cho FastAPI để bảo vệ các endpoint cần xác thực.
    Lấy Bearer token từ header và gọi hàm verify_firebase_token để kiểm tra.
    """
    if not credentials:
        # Người dùng không gửi token trong Header
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Không tìm thấy thông tin xác thực (Missing authentication credentials)",
        )
    
    token = credentials.credentials
    return verify_firebase_token(token)
