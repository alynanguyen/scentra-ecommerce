import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';

const SetupCode = ({ onSkip, onComplete }) => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [confirmCode, setConfirmCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
    setError('');
  };

  const handleConfirmCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setConfirmCode(value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (code.length !== 6) {
      setError('Code must be exactly 6 digits');
      return;
    }

    if (code !== confirmCode) {
      setError('Codes do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.setResetCode({ code });
      if (response.data.success) {
        if (onComplete) {
          onComplete();
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to set reset code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full flex flex-col gap-layout-lg">
        <div>
          <h2 className="text-center text-heading1 font-bold font-display">
            Set Up Reset Code
          </h2>
          <p className="mt-4 text-center text-body2 ">
            Create a 6-digit code that will be required when you reset your password.
            You can set this up later in account settings if you skip now.
          </p>
        </div>
        <form className="flex flex-col gap-layout-xl" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red p-4">
              <div className="text-body2 text-white">{error}</div>
            </div>
          )}

          <div className="flex flex-col gap-layout-xl px-4">
            <div className="flex flex-col gap-layout-xs">
              <label htmlFor="code" className="text-body2 font-medium">
                6-Digit Code
              </label>
              <input
                id="code"
                name="code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                required
                className="appearance-none mx-auto w-fit py-2 rounded-lg border border-gray-300 placeholder-gray-400 text-black focus:outline-none focus:border-black focus:z-10 text-heading1 text-center tracking-widest"
                placeholder="000000"
                value={code}
                onChange={handleCodeChange}
              />
            </div>
            <div className="flex flex-col gap-layout-xs">
              <label htmlFor="confirmCode" className="text-body2 font-medium">
                Confirm Code
              </label>
              <input
                id="confirmCode"
                name="confirmCode"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                required
                className="appearance-none mx-auto w-fit py-2 rounded-lg border border-gray-300 placeholder-gray-400 text-black focus:outline-none focus:border-black focus:z-10 text-heading1 text-center tracking-widest"
                placeholder="000000"
                value={confirmCode}
                onChange={handleConfirmCodeChange}
              />
            </div>
          </div>

          <div className="flex flex-col gap-layout-normal items-center justify-center px-4">
            <button
              type="submit"
              disabled={loading || code.length !== 6 || confirmCode.length !== 6}
              className="w-full max-w-[400px] flex justify-center py-2 px-4 border border-transparent text-body2 rounded-full text-white bg-black hover:bg-gray-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Setting up...' : 'Set Up Code'}
            </button>
            {onSkip && (
              <button
                type="button"
                onClick={onSkip}
                className="w-full max-w-[400px] justify-center py-2 px-4 text-caption rounded-full text-black bg-white hover:text-gray-700 focus:outline-none"
              >
                Skip for Now
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetupCode;

