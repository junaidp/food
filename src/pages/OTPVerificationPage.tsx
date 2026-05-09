import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { Shield, ArrowLeft } from 'lucide-react';

export default function OTPVerificationPage() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(120); // 2 minutes
  const navigate = useNavigate();
  const location = useLocation();
  const { updateUser } = useAuth();

  const phone = location.state?.phone;

  useEffect(() => {
    if (!phone) {
      navigate('/register');
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [phone, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/verify-otp', { phone, otp });
      const { token, user } = res.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      updateUser(user);
      
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    
    setResending(true);
    setError('');

    try {
      await api.post('/auth/resend-otp', { phone });
      setCountdown(120);
      setOtp('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-warmOrange-50 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <Shield className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Verify Your Phone</h1>
          <p className="text-gray-500 mt-2">
            Enter the 6-digit code sent to<br />
            <span className="font-semibold text-gray-700">{phone}</span>
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 text-center">
                Verification Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="input-field text-center text-2xl font-mono tracking-widest"
                placeholder="000000"
                maxLength={6}
                required
                autoFocus
              />
            </div>

            <button 
              type="submit" 
              disabled={loading || otp.length !== 6} 
              className="w-full btn-primary"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mx-auto" />
              ) : (
                'Verify & Continue'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            {countdown > 0 ? (
              <p className="text-sm text-gray-500">
                Resend code in <span className="font-semibold text-primary-600">{formatTime(countdown)}</span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                disabled={resending}
                className="text-sm text-primary-600 font-semibold hover:underline disabled:opacity-50"
              >
                {resending ? 'Sending...' : 'Resend OTP'}
              </button>
            )}
          </div>

          <button
            onClick={() => navigate('/register')}
            className="w-full mt-4 flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Registration
          </button>
        </div>

        <div className="mt-6 bg-blue-50 rounded-xl p-4">
          <p className="text-xs text-blue-800 text-center">
            💡 <strong>Development Mode:</strong> Check your server console for the OTP code
          </p>
        </div>
      </div>
    </div>
  );
}
