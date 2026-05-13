import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import Button from '../common/Button';
import MaterialIcon from '../common/MaterialIcon';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: email, 2: code
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await authAPI.forgotPassword({ email });
      if (response.data.success) {
        setMessage(response.data.message);
        setStep(2); // Move to code input step
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify email');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
    setError('');
    setMessage('');
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (code.length !== 6) {
      setError('Code must be exactly 6 digits');
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.verifyResetCode({ email, code });
      if (response.data.success) {
        // Code is correct, navigate to reset password page
        navigate(`/resetpassword/${response.data.resetToken}`);
      }
    } catch (err) {
      // Code is wrong, show contact support message
      setError('Invalid code. Please contact support (support@scentra.com).');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep(1);
    setCode('');
    setError('');
    setMessage('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">

        {/* Header */}
        <div>
          <h2 className="mt-6 text-center text-heading1 font-display font-bold">
            Forgot Password
          </h2>

          <p className="mt-2 text-center text-body2 text-gray-600">
            {step === 1
              ? 'Enter your email address to begin the password reset process.'
              : 'Enter your 6-digit reset code to continue.'}
          </p>
        </div>

        {step === 1 ? (
          <form className="mt-8 space-y-6" onSubmit={handleEmailSubmit}>

            {/* Alerts */}
            {error && (
              <div className="rounded-md bg-red p-4">
                <div className="text-body2 text-white">{error}</div>
              </div>
            )}

            {message && (
              <div className="rounded-md bg-green p-4">
                <div className="text-body2 text-white">{message}</div>
              </div>
            )}

            {/* Email Field */}
            <div className="flex flex-col gap-6 px-4 md:px-0">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="text-body2"
                >
                  Email
                </label>

                <div className="flex items-center border-b py-layout-xxs focus-within:border-b-gray-800 transition">

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent outline-none text-body1 text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <div className="px-4 md:px-0">
              <Button
                variant="primary"
                size="md"
                fullWidth
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Continue'}
              </Button>
            </div>

            {/* Back */}
            <div className="text-center">
                <Button
                  variant="secondary"
                  size="md"
                  fullWidth
                  onClick={() => navigate('/login')}
                >
                  Back to Login
                </Button>
            </div>

          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleCodeSubmit}>

            {/* Alerts */}
            {error && (
              <div className="rounded-md bg-red p-4">
                <div className="text-body2 text-white">{error}</div>
                <div className="text-body2 text-white mt-2">
                  If you continue to experience issues, please contact support (support@scentra.com).
                </div>
              </div>
            )}

            {message && (
              <div className="rounded-md bg-green p-4">
                <div className="text-body2 text-white">{message}</div>
              </div>
            )}

            {/* Code Field */}
            <div className="flex flex-col gap-6 px-4 md:px-0">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="code"
                  className="text-body2 font-medium text-gray-700"
                >
                  Reset Code
                </label>

                <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-1 focus-within:ring-gray-500 focus-within:border-gray-800 transition">
                  <span className="mr-3 flex-shrink-0">
                    <MaterialIcon icon="key" size={24} />
                  </span>

                  <input
                    id="code"
                    name="code"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    required
                    placeholder="000000"
                    value={code}
                    onChange={handleCodeChange}
                    className="w-full bg-transparent outline-none text-body1 text-gray-900 placeholder-gray-400 text-center tracking-widest"
                  />
                </div>
              </div>
            </div>

            {/* Verify Button */}
            <div>
              <Button
                variant="primary"
                size="md"
                fullWidth
                disabled={loading || code.length !== 6}
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </Button>
            </div>

            {/* Navigation */}
            <div className="text-center space-y-6">
              <button
                type="button"
                onClick={handleBackToEmail}
                className="w-full hover:text-gray-700 text-body2 flex items-center justify-center"
              >
                <MaterialIcon icon="arrow_back" size={20} className="mr-2" />
                Back to Email
              </button>

              <div>
                <Button
                  variant="secondary"
                  size="sm"
                  fullWidth
                  onClick={() => navigate('/login')}
                >
                  Back to Login
                </Button>
              </div>

            </div>

          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
