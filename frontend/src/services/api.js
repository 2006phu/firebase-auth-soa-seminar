import axios from 'axios';
import { auth } from '../firebase';

/**
 * Gets the current user's Firebase ID token
 * @returns {Promise<string>} The ID token
 */
export const getAuthToken = async () => {
  if (!auth.currentUser) {
    throw new Error('User not authenticated');
  }
  // true forces refresh to get a new token if needed
  return await auth.currentUser.getIdToken(false);
};

const formatBaseUrl = (url) => (url ? url.trim().replace(/\/+$/, '') : '');

/**
 * Calls a protected API endpoint by appending the Bearer token
 * @param {string} baseUrl - The base URL of the API
 * @returns {Promise<any>} The response data
 */
export const callProtectedApi = async (baseUrl) => {
  try {
    const url = formatBaseUrl(baseUrl);
    const token = await getAuthToken();
    const response = await axios.get(`${url}/api/protected`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error calling protected API:', error);
    throw error;
  }
};

/**
 * Calls a public API endpoint
 * @param {string} baseUrl - The base URL of the API
 * @returns {Promise<any>} The response data
 */
export const callPublicApi = async (baseUrl) => {
  try {
    const url = formatBaseUrl(baseUrl);
    const response = await axios.get(`${url}/api/public`, {
      headers: {
        'ngrok-skip-browser-warning': 'true',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error calling public API:', error);
    throw error;
  }
};

/**
 * Gets the user info from the backend
 * @param {string} baseUrl - The base URL of the API
 * @returns {Promise<any>} The user info
 */
export const getUserInfo = async (baseUrl) => {
  try {
    const url = formatBaseUrl(baseUrl);
    const token = await getAuthToken();
    const response = await axios.get(`${url}/api/user-info`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error getting user info:', error);
    throw error;
  }
};

/**
 * Đồng bộ tài khoản sang Backend OAuth2 của Quân (soa-auth-system)
 * Gửi Google ID Token (credential.idToken từ Firebase signInWithPopup)
 * để backend Quân xác thực bằng Google Public Keys và lưu vào SQL Server.
 *
 * @param {string} googleIdToken - Google ID Token lấy từ credential.idToken
 * @returns {Promise<object|null>} AuthResponse của Quân hoặc null nếu không kết nối được
 */
export const syncToOAuth2Backend = async (googleIdToken) => {
  const QUAN_BASE_URL = import.meta.env.VITE_QUAN_API_BASE_URL || 'http://localhost:8080';
  try {
    const url = formatBaseUrl(QUAN_BASE_URL);
    const response = await axios.post(
      `${url}/api/auth/google/firebase-token`,
      { idToken: googleIdToken },
      {
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        timeout: 5000, // Timeout 5s — không chờ lâu nếu Quân's backend offline
      }
    );

    const quanJwt = response.data?.data?.accessToken;
    const quanEmail = response.data?.data?.email;
    const quanRole = response.data?.data?.role;

    if (quanJwt) {
      localStorage.setItem('quan_oauth2_jwt', quanJwt);
      localStorage.setItem('quan_oauth2_email', quanEmail || '');
      localStorage.setItem('quan_oauth2_role', quanRole || '');
      console.log('✅ Đã đồng bộ sang OAuth2 Backend thành công!', { quanEmail, quanRole });
    }

    return response.data;
  } catch (error) {
    // Ghi log nhưng KHÔNG throw — để luồng đăng nhập Firebase không bị gián đoạn
    console.warn('⚠️ OAuth2 Backend không phản hồi hoặc xảy ra lỗi:', error.message);
    return null;
  }
};

