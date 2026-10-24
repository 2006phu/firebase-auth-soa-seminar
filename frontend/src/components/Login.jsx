import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import GoogleSignIn from './GoogleSignIn';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('Email hoặc mật khẩu không chính xác.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Quá nhiều yêu cầu đăng nhập thất bại. Vui lòng thử lại sau ít phút.');
      } else {
        setError('Đăng nhập thất bại. Vui lòng kiểm tra lại kết nối mạng hoặc thông tin tài khoản.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden glass-panel shadow-2xl border border-slate-800 relative z-10">
        
        {/* Left Side: Enterprise Branding & Tech Info */}
        <div className="lg:col-span-5 bg-gradient-to-br from-indigo-950/80 via-slate-900/90 to-slate-950 p-8 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/40 text-white font-bold text-xl">
                ⚡
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight">SOA Identity Gateway</h1>
                <p className="text-xs text-indigo-400 font-mono">Service-Oriented Architecture</p>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-4">
              Xác thực Phân tán <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-400 to-purple-400">
                Chuẩn Doanh Nghiệp
              </span>
            </h2>

            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Nền tảng Single Sign-On (SSO) và Federated Identity tích hợp đồng thời Cloud Identity Provider (Firebase RS256) và Microservices OAuth2 Backend.
            </p>

            <div className="space-y-3 pt-4 border-t border-slate-800/80">
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                <span>Stateless JWT Verification &lt;1ms (RAM Caching)</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <span className="h-2 w-2 rounded-full bg-indigo-400"></span>
                <span>Polyglot Backends: FastAPI, Spring Boot, NodeJS</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <span className="h-2 w-2 rounded-full bg-purple-400"></span>
                <span>Tự động đồng bộ SQL Server / H2 Database</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
            <span>Seminar Môn Học SOA</span>
            <span className="font-mono text-indigo-400/80">v2.5 Enterprise</span>
          </div>
        </div>

        {/* Right Side: Modern Login Form */}
        <div className="lg:col-span-7 bg-slate-900/60 p-8 sm:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white tracking-tight">Đăng nhập tài khoản</h3>
              <p className="text-sm text-slate-400 mt-1">
                Chọn phương thức xác thực hoặc nhập email mật khẩu bên dưới
              </p>
            </div>

            {/* Error Message Toast Banner */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-sm flex items-start gap-3 animate-fade-in shadow-lg shadow-rose-950/30">
                <span className="text-rose-400 font-bold">⚠️</span>
                <div className="flex-1 text-xs sm:text-sm">{error}</div>
              </div>
            )}

            {/* Google One-Click OAuth Button */}
            <div className="mb-6">
              <GoogleSignIn onError={(msg) => setError(msg)} />
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-900/90 px-3 text-slate-500 font-mono">hoặc đăng nhập truyền thống</span>
              </div>
            </div>

            {/* Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Địa chỉ Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tenban@example.com"
                    className="w-full rounded-xl bg-slate-950/80 px-4 py-3 text-sm text-white placeholder-slate-500 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all shadow-inner"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Mật khẩu
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl bg-slate-950/80 px-4 py-3 text-sm text-white placeholder-slate-500 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all shadow-inner"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <span>Đang xác thực thông tin...</span>
                  </>
                ) : (
                  <span>Đăng nhập hệ thống</span>
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-xs text-slate-400">
              Chưa có tài khoản trải nghiệm?{' '}
              <Link to="/register" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors underline-offset-4 hover:underline">
                Tạo tài khoản mới
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
