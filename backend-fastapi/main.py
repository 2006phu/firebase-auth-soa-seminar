from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from auth import get_current_user

# Khởi tạo ứng dụng FastAPI
app = FastAPI(
    title="Firebase Auth Seminar API",
    description="Backend API demo cho hội thảo về Firebase Authentication",
    version="1.0.0"
)

# Cấu hình CORS middleware
# Cho phép tất cả các nguồn (origins) truy cập - Chỉ dùng cho mục đích demo/phát triển
# Trong thực tế, nên cấu hình cụ thể các domains được phép
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """
    Sự kiện chạy khi server bắt đầu khởi động.
    """
    print("API Server is running. Ready to serve requests.")

@app.get("/")
def health_check():
    """
    Endpoint kiểm tra trạng thái (Health check).
    Trả về thông tin trạng thái cơ bản để xác nhận server đang hoạt động.
    """
    return {
        "status": "ok", 
        "service": "FastAPI + Firebase Auth"
    }

@app.get("/api/public")
def public_endpoint():
    """
    Endpoint công khai (Public endpoint).
    Bất kỳ ai cũng có thể truy cập mà không cần phải đăng nhập.
    """
    return {
        "message": "Đây là một endpoint công khai (public). Không yêu cầu xác thực.", 
        "service": "FastAPI"
    }

@app.get("/api/protected")
def protected_endpoint(current_user: dict = Depends(get_current_user)):
    """
    Endpoint được bảo vệ (Protected endpoint).
    Yêu cầu người dùng phải đăng nhập và gửi kèm Firebase ID token hợp lệ trong Header.
    """
    # Trích xuất uid và email từ thông tin người dùng được giải mã
    uid = current_user.get("uid")
    email = current_user.get("email")
    
    return {
        "message": "Thành công! Bạn đã truy cập vào một endpoint được bảo vệ.",
        "service": "FastAPI",
        "user": {
            "uid": uid,
            "email": email
        }
    }

@app.get("/api/user-info")
def user_info(current_user: dict = Depends(get_current_user)):
    """
    Endpoint lấy toàn bộ thông tin người dùng từ token.
    Trả về chi tiết các trường dữ liệu có trong JWT (JSON Web Token) của Firebase.
    """
    # Lấy các trường thông dụng từ token Firebase
    return {
        "uid": current_user.get("uid"),
        "email": current_user.get("email"),
        "name": current_user.get("name"),
        "picture": current_user.get("picture"),
        "email_verified": current_user.get("email_verified"),
        "auth_time": current_user.get("auth_time"),
        "full_token_payload": current_user # Trả về toàn bộ payload để sinh viên dễ hình dung
    }
