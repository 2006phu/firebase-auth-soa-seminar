import { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { getAuthToken, callProtectedApi, callPublicApi } from '../services/api';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [backendUrl, setBackendUrl] = useState(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080');
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Get current user and token
    const fetchUserAndToken = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUser({
          displayName: currentUser.displayName || 'Không có tên',
          email: currentUser.email,
          uid: currentUser.uid,
          photoURL: currentUser.photoURL,
        });
        
        try {
          const idToken = await getAuthToken();
          setToken(idToken);
        } catch (error) {
          console.error("Lỗi lấy token:", error);
        }
      }
    };
    
    fetchUserAndToken();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(token);
    alert('Đã copy token vào clipboard!');
  };

  const handleCallProtected = async () => {
    setLoading(true);
    setApiResponse(null);
    try {
      const data = await callProtectedApi(backendUrl);
      setApiResponse({ type: 'success', data });
    } catch (error) {
      setApiResponse({ 
        type: 'error', 
        data: error.response?.data || error.message || 'Lỗi không xác định' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCallPublic = async () => {
    setLoading(true);
    setApiResponse(null);
    try {
      const data = await callPublicApi(backendUrl);
      setApiResponse({ type: 'success', data });
    } catch (error) {
      setApiResponse({ 
        type: 'error', 
        data: error.response?.data || error.message || 'Lỗi không xác định' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="p-8 text-center">Đang tải...</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header / User Profile Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-5">
              <div className="flex-shrink-0">
                {user.photoURL ? (
                  <img className="h-16 w-16 rounded-full" src={user.photoURL} alt="Profile" />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 text-xl font-bold">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-xl leading-6 font-medium text-gray-900">{user.displayName}</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">{user.email}</p>
                <p className="text-xs text-gray-400 mt-1">UID: {user.uid}</p>
              </div>
            </div>
            <div className="mt-5 md:mt-0">
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>

        {/* JWT Token Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Firebase ID Token (JWT)</h3>
            <div className="space-x-3">
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                Copy
              </button>
              <a
                href={`https://jwt.io?token=${token}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
              >
                Giải mã trên jwt.io
              </a>
            </div>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="bg-gray-50 p-4 rounded-md overflow-x-auto">
              <code className="text-sm text-gray-800 break-all">
                {token ? `${token.substring(0, 100)}...${token.substring(token.length - 20)}` : 'Đang lấy token...'}
              </code>
            </div>
          </div>
        </div>

        {/* API Testing Section */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Kiểm tra API</h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-6">
              <div className="sm:col-span-3">
                <label htmlFor="backend" className="block text-sm font-medium text-gray-700">
                  Backend API URL (hoặc dán link Ngrok HTTPS)
                </label>
                <div className="mt-1 flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    id="backend"
                    className="block w-full px-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm border font-mono"
                    value={backendUrl}
                    onChange={(e) => setBackendUrl(e.target.value)}
                    placeholder="https://xxx.ngrok-free.app hoặc http://localhost:8080"
                  />
                  <select
                    className="px-3 py-2 text-sm border-gray-300 rounded-md shadow-sm border bg-gray-50 text-gray-700 sm:w-56"
                    onChange={(e) => {
                      if (e.target.value) setBackendUrl(e.target.value);
                    }}
                    value={backendUrl}
                  >
                    <option value="http://localhost:8080">Spring Boot (8080)</option>
                    <option value="http://localhost:8000">FastAPI (8000)</option>
                    <option value="http://localhost:3000">NodeJS (3000)</option>
                    <option value={backendUrl}>URL tùy chỉnh / Ngrok</option>
                  </select>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  💡 Mẹo: Khi dùng ngrok, bạn chỉ cần copy link HTTPS dán thẳng vào ô trên để gọi API mà không cần build lại web!
                </p>
              </div>
            </div>

            <div className="flex space-x-4 mb-6">
              <button
                onClick={handleCallPublic}
                disabled={loading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                Gọi Public API
              </button>
              <button
                onClick={handleCallProtected}
                disabled={loading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                Gọi Protected API
              </button>
            </div>

            {/* API Response Display */}
            {apiResponse && (
              <div className={`mt-4 rounded-md p-4 ${apiResponse.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <h4 className={`text-sm font-medium ${apiResponse.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                  Kết quả:
                </h4>
                <div className="mt-2 text-sm">
                  <pre className={`whitespace-pre-wrap p-2 rounded ${apiResponse.type === 'success' ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-900'}`}>
                    {JSON.stringify(apiResponse.data, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
