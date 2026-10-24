import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Mật khẩu xác nhận không khớp.');
    }

    if (password.length < 6) {
      return setError('Mật khẩu phải có độ dài tối thiểu từ 6 ký tự.');
    }

    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Địa chỉ email này đã tồn tại trên hệ thống.');
      } else if (err.code === 'auth/weak-password') {
        setError('Mật khẩu quá yếu (yêu cầu tối thiểu 6 ký tự).');
      } else if (err.code === 'auth/invalid-email') {
        setError('Định dạng email không hợp lệ.');
      } else {
        setError('Đăng ký tài khoản thất bại. Vui lòng thử lại.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 tech-grid-pattern flex items-center justify-center p-4 sm:p-6 lg:p-8 relative">
      {/* Ambient Accents */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[400px] bg-gradient-to-b from-purple-100/50 via-indigo-100/30 to-transparent blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[400px] bg-gradient-to-t from-pink-100/40 via-purple-50/30 to-transparent blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden enterprise-card-elevated relative z-10">
        
        {/* Left Side: Enterprise Info Panel */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-8 sm:p-10 flex flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:16px_16px] opacity-15"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 text-lg font-bold shadow-inner">
                🛡️
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight text-white">IDaaS Provider</h1>
                <p className="text-xs text-purple-300 font-mono">Identity-as-a-Service</p>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-400/20 text-purple-300 text-xs font-medium mb-5">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              Bảo mật phân tán Zero Trust
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug mb-4">
              Khởi tạo Tài khoản <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-200 to-indigo-100">
                Chuẩn Enterprise
              </span>
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-8">
              Mật khẩu được băm và mã hóa an toàn trên hạ tầng Google Cloud Identity. Các microservices backend không cần lưu trữ mật khẩu gốc, loại bỏ triệt để nguy cơ lộ lọt dữ liệu.
            </p>

            <div className="space-y-3.5">
              <div className="flex items-center gap-3 text-xs text-slate-200 bg-white/5 p-2.5 rounded-xl border border-white/10 backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-400 flex-shrink-0"></span>
                <span>Chuẩn ký số bất đối xứng RSA (RS256)</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-200 bg-white/5 p-2.5 rounded-xl border border-white/10 backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-purple-400 flex-shrink-0"></span>
                <span>Tự động cấp quyền JWT Token ngay sau khi khởi tạo</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 relative z-10">
            <span>Seminar Kiến Trúc SOA</span>
            <span className="font-mono text-purple-300">Identity Security</span>
          </div>
        </div>

        {/* Right Side: Clean Enterprise Form */}
        <div className="lg:col-span-7 bg-white p-8 sm:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Đăng ký tài khoản</h3>
              <p className="text-sm text-slate-500 mt-1.5">
                Khởi tạo thông tin định danh mới trên hệ thống
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
                <span className="text-red-500 font-bold">⚠️</span>
                <div className="flex-1 text-xs sm:text-sm">{error}</div>
              </div>
            )}

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
                  className="w-full rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 border border-slate-300 focus:bg-white focus:border-purple-600 focus:ring-4 focus:ring-purple-100 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  className="w-full rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 border border-slate-300 focus:bg-white focus:border-purple-600 focus:ring-4 focus:ring-purple-100 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Xác nhận Mật khẩu
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  className="w-full rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 border border-slate-300 focus:bg-white focus:border-purple-600 focus:ring-4 focus:ring-purple-100 focus:outline-none transition-all"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-purple-600 hover:bg-purple-700 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:shadow-md focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                      </svg>
                      <span>Đang khởi tạo tài khoản...</span>
                    </>
                  ) : (
                    <span>Tạo tài khoản mới</span>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center text-xs text-slate-500">
              Đã có tài khoản trên hệ thống?{' '}
              <Link to="/login" className="font-semibold text-purple-600 hover:text-purple-700 underline-offset-4 hover:underline">
                Đăng nhập ngay
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;
