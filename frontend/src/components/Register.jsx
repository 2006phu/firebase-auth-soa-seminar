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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden glass-panel shadow-2xl border border-slate-800 relative z-10">
        
        {/* Left Side: Enterprise Info */}
        <div className="lg:col-span-5 bg-gradient-to-br from-purple-950/80 via-slate-900/90 to-slate-950 p-8 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 rounded-xl bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-600/40 text-white font-bold text-xl">
                🛡️
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight">Cấp phát Danh tính</h1>
                <p className="text-xs text-purple-400 font-mono">Identity-as-a-Service (IDaaS)</p>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-4">
              Khởi tạo Tài khoản <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">
                Bảo mật Tuyệt đối
              </span>
            </h2>

            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Mật khẩu được mã hóa và băm Salt/Hash trực tiếp trên hạ tầng bảo mật Google Cloud. Database backend chỉ lưu trữ khóa ngoại UID, loại bỏ hoàn toàn rủi ro rò rỉ cơ sở dữ liệu.
            </p>

            <div className="space-y-3 pt-4 border-t border-slate-800/80">
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                <span>Zero Trust Architecture & Chuẩn RS256</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <span className="h-2 w-2 rounded-full bg-purple-400"></span>
                <span>Cấp phát Token tự động sau khi đăng ký</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
            <span>Seminar Môn Học SOA</span>
            <span className="font-mono text-purple-400/80">Google Identity</span>
          </div>
        </div>

        {/* Right Side: Register Form */}
        <div className="lg:col-span-7 bg-slate-900/60 p-8 sm:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white tracking-tight">Đăng ký tài khoản</h3>
              <p className="text-sm text-slate-400 mt-1">
                Điền thông tin để tạo tài khoản mới trên hệ thống
              </p>
            </div>

            {/* Error Message Toast Banner */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-sm flex items-start gap-3 animate-fade-in shadow-lg shadow-rose-950/30">
                <span className="text-rose-400 font-bold">⚠️</span>
                <div className="flex-1 text-xs sm:text-sm">{error}</div>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Địa chỉ Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tenban@example.com"
                  className="w-full rounded-xl bg-slate-950/80 px-4 py-3 text-sm text-white placeholder-slate-500 border border-slate-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  className="w-full rounded-xl bg-slate-950/80 px-4 py-3 text-sm text-white placeholder-slate-500 border border-slate-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Xác nhận lại mật khẩu
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  className="w-full rounded-xl bg-slate-950/80 px-4 py-3 text-sm text-white placeholder-slate-500 border border-slate-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all shadow-inner"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                  <span>Tạo tài khoản ngay</span>
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-xs text-slate-400">
              Đã có tài khoản?{' '}
              <Link to="/login" className="font-semibold text-purple-400 hover:text-purple-300 transition-colors underline-offset-4 hover:underline">
                Quay lại đăng nhập
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;
