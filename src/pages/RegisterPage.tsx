import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../lib/translations';
import { Phone, Lock, UserIcon, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'donor' | 'receiver'>('receiver');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { lang } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/register', { phone, name, role, password });
      // Redirect to OTP verification page
      navigate('/verify-otp', { state: { phone } });
    } catch (err: any) {
      setError(err.response?.data?.error || t('registerFailed', lang));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-warmOrange-50 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🍽️</div>
          <h1 className="text-3xl font-bold text-gray-900">{t('registerJoin', lang)}</h1>
          <p className="text-gray-500 mt-2">{t('registerCreateAccount', lang)}</p>
        </div>

        <div className="card">
          {/* Role selection */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setRole('donor')}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                role === 'donor'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-3xl block mb-1">🥗</span>
              <span className="font-semibold text-sm">{t('registerImDonor', lang)}</span>
              <p className="text-xs text-gray-500 mt-0.5">{t('registerShareFood', lang)}</p>
            </button>
            <button
              type="button"
              onClick={() => setRole('receiver')}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                role === 'receiver'
                  ? 'border-warmOrange-500 bg-warmOrange-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-3xl block mb-1">🙋</span>
              <span className="font-semibold text-sm">{t('registerImReceiver', lang)}</span>
              <p className="text-xs text-gray-500 mt-0.5">{t('registerFindFood', lang)}</p>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('registerFullName', lang)}</label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field pl-11"
                  placeholder={t('registerYourName', lang)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('registerPhoneNumber', lang)}</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <span className="absolute left-10 top-1/2 -translate-y-1/2 text-sm text-gray-400 select-none">+92</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-field pl-16"
                  placeholder="3001234567"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('registerPassword', lang)}</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-11"
                  placeholder={t('registerMin6Chars', lang)}
                  minLength={6}
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className={`w-full flex items-center justify-center gap-2 ${role === 'donor' ? 'btn-primary' : 'btn-orange'}`}>
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              ) : (
                <>{t('registerCreateAccountBtn', lang)} <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            {t('registerHaveAccount', lang)}{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:underline">
              {t('registerSignInLink', lang)}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
