import { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { getAuthToken, callProtectedApi, callPublicApi } from '../services/api';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [quanAuth, setQuanAuth] = useState(null);
  const [backendUrl, setBackendUrl] = useState(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080');
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copyStatus, setCopyStatus] = useState({ firebase: false, quan: false });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndToken = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUser({
          displayName: currentUser.displayName || 'Người dùng Seminar',
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

      const syncQuanState = () => {
        const qJwt = localStorage.getItem('quan_oauth2_jwt');
        const qEmail = localStorage.getItem('quan_oauth2_email');
        const qRole = localStorage.getItem('quan_oauth2_role');
        if (qJwt) {
          setQuanAuth({ token: qJwt, email: qEmail, role: qRole });
        }
      };

      syncQuanState();
      window.addEventListener('quan_auth_synced', syncQuanState);
      return () => window.removeEventListener('quan_auth_synced', syncQuanState);
    };
    
    fetchUserAndToken();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('quan_oauth2_jwt');
      localStorage.removeItem('quan_oauth2_email');
      localStorage.removeItem('quan_oauth2_role');
      navigate('/login');
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
    }
  };

  const copyToClipboard = (type) => {
    if (type === 'firebase') {
      navigator.clipboard.writeText(token);
      setCopyStatus((prev) => ({ ...prev, firebase: true }));
      setTimeout(() => setCopyStatus((prev) => ({ ...prev, firebase: false })), 2000);
    } else if (type === 'quan' && quanAuth?.token) {
      navigator.clipboard.writeText(quanAuth.token);
      setCopyStatus((prev) => ({ ...prev, quan: true }));
      setTimeout(() => setCopyStatus((prev) => ({ ...prev, quan: false })), 2000);
    }
  };

  const handleCallProtected = async () => {
    setLoading(true);
    setApiResponse(null);
    try {
      const data = await callProtectedApi(backendUrl);
      setApiResponse({ type: 'success', status: 200, data });
    } catch (error) {
      setApiResponse({ 
        type: 'error', 
        status: error.response?.status || 401,
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
      setApiResponse({ type: 'success', status: 200, data });
    } catch (error) {
      setApiResponse({ 
        type: 'error', 
        status: error.response?.status || 500,
        data: error.response?.data || error.message || 'Lỗi không xác định' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
          <span className="text-slate-400 text-sm font-mono">Đang tải dữ liệu phiên làm việc...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[300px] bg-indigo-600/10 blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[500px] h-[300px] bg-purple-600/10 blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        
        {/* Top Navbar & User HUD */}
        <header className="glass-panel rounded-2xl p-4 sm:p-6 shadow-xl border border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              {user.photoURL ? (
                <img className="h-14 w-14 rounded-2xl object-cover ring-2 ring-indigo-500/50 shadow-lg" src={user.photoURL} alt="Profile" />
              ) : (
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xl font-bold ring-2 ring-white/10 shadow-lg">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-slate-950" title="Active Session"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">{user.displayName}</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  VERIFIED
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{user.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-slate-500 font-mono">UID:</span>
                <span className="text-[10px] text-slate-400 font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 max-w-[200px] sm:max-w-xs truncate">
                  {user.uid}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <a
              href="https://soa-firebase-demo-31877.web.app"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-mono flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 transition-all hover:bg-indigo-500/15"
            >
              <span>Cloud Hosting</span>
              <span className="text-[10px]">↗</span>
            </a>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 hover:border-rose-500/40 border border-slate-700/80 text-xs font-semibold text-slate-200 shadow-md transition-all duration-150 flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Đăng xuất</span>
            </button>
          </div>
        </header>

        {/* Multi-System Architecture Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              🌐
            </div>
            <div>
              <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Identity Provider</p>
              <p className="text-sm font-bold text-white">Google Identity Platform</p>
            </div>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              ⚡
            </div>
            <div>
              <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Authentication Core</p>
              <p className="text-sm font-bold text-white">Firebase RS256 Stateless</p>
            </div>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              🔗
            </div>
            <div>
              <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Federated Identity</p>
              <p className="text-sm font-bold text-white">Quân OAuth2 (HMAC-384)</p>
            </div>
          </div>
        </div>

        {/* DUAL-TOKEN SHOWCASE PANEL (Enterprise Core Demo) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-200 tracking-tight flex items-center gap-2">
              <span>Bằng Chứng Định Danh Đa Hệ Thống (Dual-Token Panel)</span>
              <span className="text-xs font-mono font-normal text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded-full border border-indigo-800/50">
                Live Memory Inspection
              </span>
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* 1. Firebase Token Card */}
            <div className="glass-panel rounded-2xl border border-indigo-500/30 overflow-hidden shadow-xl glow-indigo flex flex-col justify-between">
              <div>
                <div className="p-4 sm:p-5 border-b border-indigo-500/20 bg-indigo-950/30 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="h-3 w-3 rounded-full bg-indigo-400 animate-pulse"></span>
                    <div>
                      <h4 className="text-sm font-bold text-indigo-200">Firebase ID Token</h4>
                      <p className="text-[11px] text-indigo-400/80 font-mono">Thuật toán: RS256 (Asymmetric RSA)</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-mono text-[11px] border border-indigo-500/30">
                    TTL: 3600s (1h)
                  </span>
                </div>

                <div className="p-5 space-y-4">
                  <div className="bg-slate-950/90 rounded-xl p-3.5 border border-slate-800 font-mono text-xs text-indigo-300/90 break-all select-all max-h-28 overflow-y-auto leading-relaxed shadow-inner">
                    {token || 'Đang lấy token...'}
                  </div>

                  <div className="text-[11px] text-slate-400 space-y-1 font-mono">
                    <div className="flex justify-between">
                      <span>Issuer:</span>
                      <span className="text-slate-300">securetoken.google.com/soa-firebase-demo-31877</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Verification:</span>
                      <span className="text-emerald-400">Offline JWKS Public Key Cache</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-800/80 bg-slate-900/40 flex items-center justify-between">
                <button
                  onClick={() => copyToClipboard('firebase')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-all flex items-center gap-1.5"
                >
                  <span>{copyStatus.firebase ? '✓ Đã sao chép' : '📋 Copy Token'}</span>
                </button>
                <a
                  href={`https://jwt.io?token=${token}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1"
                >
                  <span>Mổ xẻ trên jwt.io</span>
                  <span className="text-[10px]">↗</span>
                </a>
              </div>
            </div>

            {/* 2. Quân's OAuth2 Token Card */}
            <div className="glass-panel rounded-2xl border border-purple-500/30 overflow-hidden shadow-xl glow-purple flex flex-col justify-between">
              <div>
                <div className="p-4 sm:p-5 border-b border-purple-500/20 bg-purple-950/30 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="h-3 w-3 rounded-full bg-purple-400 animate-pulse"></span>
                    <div>
                      <h4 className="text-sm font-bold text-purple-200">OAuth2 Backend Token (Quân)</h4>
                      <p className="text-[11px] text-purple-400/80 font-mono">Thuật toán: HS384 (HMAC Symmetric)</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-mono text-[11px] border border-purple-500/30">
                    TTL: 900s (15m)
                  </span>
                </div>

                <div className="p-5 space-y-4">
                  {quanAuth ? (
                    <>
                      <div className="bg-slate-950/90 rounded-xl p-3.5 border border-slate-800 font-mono text-xs text-purple-300/90 break-all select-all max-h-28 overflow-y-auto leading-relaxed shadow-inner">
                        {quanAuth.token}
                      </div>

                      <div className="text-[11px] text-slate-400 space-y-1 font-mono">
                        <div className="flex justify-between">
                          <span>Quyền hạn (Role):</span>
                          <span className="text-purple-300 font-semibold">{quanAuth.role || 'ROLE_PERSONAL'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Database Destination:</span>
                          <span className="text-emerald-400">SQL Server / H2 (google_login_db)</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="p-6 rounded-xl bg-purple-950/20 border border-dashed border-purple-800/60 text-center">
                      <p className="text-xs text-purple-300 font-semibold mb-1">Chưa kích hoạt luồng đồng bộ</p>
                      <p className="text-[11px] text-slate-400">
                        Đăng xuất và bấm <strong className="text-indigo-400">"Đăng nhập với Google"</strong> để đồng bộ tự động tài khoản sang backend Quân.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 border-t border-slate-800/80 bg-slate-900/40 flex items-center justify-between">
                {quanAuth ? (
                  <>
                    <button
                      onClick={() => copyToClipboard('quan')}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-all flex items-center gap-1.5"
                    >
                      <span>{copyStatus.quan ? '✓ Đã sao chép' : '📋 Copy Token'}</span>
                    </button>
                    <div className="flex items-center gap-2">
                      <a
                        href="http://localhost:8081/api/users/database-viewer"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-purple-300 border border-purple-700/50 transition-all flex items-center gap-1"
                      >
                        <span>Soi DB Quân</span>
                        <span className="text-[10px]">↗</span>
                      </a>
                      <a
                        href={`https://jwt.io?token=${quanAuth.token}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white shadow-md shadow-purple-600/30 transition-all flex items-center gap-1"
                      >
                        <span>Mổ xẻ trên jwt.io</span>
                        <span className="text-[10px]">↗</span>
                      </a>
                    </div>
                  </>
                ) : (
                  <span className="text-[11px] text-slate-500 font-mono">POST /api/auth/google/firebase-token</span>
                )}
              </div>
            </div>

          </div>
        </section>

        {/* INTERACTIVE API TESTING CONSOLE (Mini Postman) */}
        <section className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="p-4 sm:p-6 border-b border-slate-800 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Interactive API Testing Console</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Polyglot Filter Tester
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Gửi Bearer Token trực tiếp từ trình duyệt đến các Microservice khác nhau để kiểm thử tính trung lập của SOA
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-6">
            
            {/* Target URL Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Target Backend Gateway URL
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={backendUrl}
                  onChange={(e) => setBackendUrl(e.target.value)}
                  placeholder="http://localhost:8080 hoặc link ngrok HTTPS"
                  className="flex-1 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-mono text-indigo-300 border border-slate-800 focus:border-indigo-500 focus:outline-none shadow-inner"
                />
                <select
                  value={backendUrl}
                  onChange={(e) => setBackendUrl(e.target.value)}
                  className="rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-300 border border-slate-700 focus:border-indigo-500 focus:outline-none sm:w-60"
                >
                  <option value="http://localhost:8000">FastAPI (Python :8000)</option>
                  <option value="http://localhost:8080">Spring Boot (Java :8080)</option>
                  <option value="http://localhost:3000">NodeJS Express (:3000)</option>
                  <option value="http://localhost:8081">Backend Quân OAuth2 (:8081)</option>
                  <option value={backendUrl}>URL tùy biến / Ngrok Tunnel</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleCallPublic}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 shadow-md transition-all active:scale-[0.98] disabled:opacity-50 flex items-center gap-2"
              >
                <span>GET /api/public</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 font-mono">No Auth</span>
              </button>

              <button
                onClick={handleCallProtected}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <span className="animate-pulse">Đang gửi gói tin Bearer...</span>
                ) : (
                  <>
                    <span>GET /api/protected</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/30 text-indigo-200 font-mono">Bearer Token</span>
                  </>
                )}
              </button>
            </div>

            {/* Response Console Display */}
            {apiResponse && (
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner">
                <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${apiResponse.type === 'success' ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                    <span className="font-bold text-slate-300">HTTP Response:</span>
                    <span className={`px-2 py-0.5 rounded font-bold ${apiResponse.type === 'success' ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800' : 'bg-rose-950/80 text-rose-400 border border-rose-800'}`}>
                      {apiResponse.status} {apiResponse.type === 'success' ? 'OK' : 'Error'}
                    </span>
                  </div>
                  <span className="text-slate-500 text-[11px]">Format: JSON</span>
                </div>
                <div className="p-4 max-h-80 overflow-y-auto">
                  <pre className="font-mono text-xs text-indigo-200/90 whitespace-pre-wrap leading-relaxed">
                    {JSON.stringify(apiResponse.data, null, 2)}
                  </pre>
                </div>
              </div>
            )}

          </div>
        </section>

      </div>
    </div>
  );
};

export default Dashboard;
