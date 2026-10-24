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
    <div className="min-h-screen bg-slate-50 tech-grid-pattern flex items-center justify-center p-4 sm:p-6 lg:p-8 relative">
      {/* Ambient Clean Background Accents */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[400px] bg-gradient-to-b from-indigo-100/50 via-sky-100/30 to-transparent blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[400px] bg-gradient-to-t from-violet-100/40 via-purple-50/30 to-transparent blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden enterprise-card-elevated relative z-10">
        
        {/* Left Side: Enterprise Modern Presentation Panel */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-10 flex flex-col justify-between text-white relative overflow-hidden">
          {/* Subtle architectural background texture */}
          <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px] opacity-15"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 text-lg font-bold shadow-inner">
                ⚡
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight text-white">SOA Identity Hub</h1>
                <p className="text-xs text-indigo-300 font-mono">Service-Oriented Architecture</p>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-medium mb-5">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              Federated Identity & SSO v2.5
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug mb-4">
              Nền tảng Quản trị <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-sky-200 to-indigo-100">
                Xác thực Phân tán
              </span>
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-8">
              Mô hình tách biệt trách nhiệm (Separation of Concerns): Tích hợp Identity Provider Cloud (Firebase RS256) và các dịch vụ nội bộ Microservices.
            </p>

            <div className="space-y-3.5">
              <div className="flex items-center gap-3 text-xs text-slate-200 bg-white/5 p-2.5 rounded-xl border border-white/10 backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-400 flex-shrink-0"></span>
                <span>Stateless JWT Verification &lt;1ms (RAM Public Key)</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-200 bg-white/5 p-2.5 rounded-xl border border-white/10 backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-sky-400 flex-shrink-0"></span>
                <span>Đa ngôn ngữ: Spring Boot, FastAPI, NodeJS Express</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-200 bg-white/5 p-2.5 rounded-xl border border-white/10 backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-purple-400 flex-shrink-0"></span>
                <span>Tự động đồng bộ SQL Server / H2 Database</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 relative z-10">
            <span>Seminar Kiến Trúc SOA</span>
            <span className="font-mono text-indigo-300">Production Ready</span>
          </div>
        </div>

        {/* Right Side: Clean Enterprise Form */}
        <div className="lg:col-span-7 bg-white p-8 sm:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Đăng nhập tài khoản</h3>
              <p className="text-sm text-slate-500 mt-1.5">
                Truy cập bảng điều khiển kiến trúc phân tán SOA
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
                <span className="text-red-500 font-bold">⚠️</span>
                <div className="flex-1 text-xs sm:text-sm">{error}</div>
              </div>
            )}

            {/* Google OAuth Button */}
            <div className="mb-6">
              <GoogleSignIn onError={(msg) => setError(msg)} />
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-slate-400 font-medium">hoặc email tài khoản</span>
              </div>
            </div>

            {/* Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Địa chỉ Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tenban@example.com"
                  className="w-full rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 border border-slate-300 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Mật khẩu
                  </label>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 border border-slate-300 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
              </div>
            </form>

            <div className="mt-8 text-center text-xs text-slate-500">
              Chưa có tài khoản trải nghiệm?{' '}
              <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-700 underline-offset-4 hover:underline">
                Đăng ký tài khoản mới
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
