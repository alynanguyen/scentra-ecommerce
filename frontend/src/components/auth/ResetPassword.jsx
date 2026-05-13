import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import PasswordInput from '../common/PasswordInput';
import Button from '../common/Button';
import MaterialIcon from '../common/MaterialIcon';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/forgotpassword');
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.resetPassword(token, { password });
      if (response.data.success) {
        setMessage('Password reset successful! Redirecting to login...');
        // Auto-login the user
        const { token: authToken, ...userData } = response.data.data;
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    // <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    //   <div className="max-w-md w-full space-y-8">
    //     <div>
    //       <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
    //         Reset Password
    //       </h2>
    //       <p className="mt-2 text-center text-sm text-gray-600">
    //         Enter your new password below.
    //       </p>
    //     </div>
    //     <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
    //       {error && (
    //         <div className="rounded-md bg-red-50 p-4">
    //           <div className="text-sm text-red-700">{error}</div>
    //         </div>
    //       )}
    //       {message && (
    //         <div className="rounded-md bg-green-50 p-4">
    //           <div className="text-sm text-green-700">{message}</div>
    //         </div>
    //       )}
    //       <div className="space-y-4">
    //         <PasswordInput
    //           id="password"
    //           name="password"
    //           value={password}
    //           onChange={(e) => setPassword(e.target.value)}
    //           placeholder="New Password (min. 6 characters)"
    //           autoComplete="new-password"
    //           required
    //           label="New Password"
    //           className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
    //         />
    //         <PasswordInput
    //           id="confirmPassword"
    //           name="confirmPassword"
    //           value={confirmPassword}
    //           onChange={(e) => setConfirmPassword(e.target.value)}
    //           placeholder="Confirm Password"
    //           autoComplete="new-password"
    //           required
    //           label="Confirm Password"
    //           className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
    //         />
    //       </div>

    //       <div>
    //         <button
    //           type="submit"
    //           disabled={loading}
    //           className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
    //         >
    //           {loading ? 'Resetting...' : 'Reset Password'}
    //         </button>
    //       </div>

    //       <div className="text-center">
    //         <Link
    //           to="/login"
    //           className="font-medium text-indigo-600 hover:text-indigo-500"
    //         >
    //           Back to Login
    //         </Link>
    //       </div>
    //     </form>
    //   </div>
    // </div>
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">

        {/* Header */}
        <div>
          <h2 className="mt-6 text-center text-heading1 font-display font-bold">
            Reset Password
          </h2>
          <p className="mt-2 text-center text-body2 text-gray-600">
            Enter your new password below.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>

          {/* Error */}
          {error && (
            <div className="rounded-md bg-red p-4">
              <div className="text-body2 text-white">{error}</div>
            </div>
          )}

          {/* Success */}
          {message && (
            <div className="rounded-md bg-green p-4">
              <div className="text-body2 text-white">{message}</div>
            </div>
          )}

          {/* Fields */}
          <div className="flex flex-col gap-6 px-4 md:px-0">

            {/* New Password */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-body2"
              >
                New Password
              </label>

              <div className="flex items-center border-b py-layout-xxs focus-within:border-b-gray-800 transition">

                {/* Password Input */}
                <div className="flex-1 min-w-0">
                  <PasswordInput
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a new password"
                    autoComplete="new-password"
                    required
                    className="w-full bg-transparent outline-none text-body1 text-gray-900 placeholder-gray-400 border-none p-0"
                    labelClassName="sr-only"
                  />
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="confirmPassword"
                className="text-body2"
              >
                Confirm Password
              </label>

              <div className="flex items-center border-b py-layout-xxs focus-within:border-b-gray-800 transition">

                {/* Password Input */}
                <div className="flex-1 min-w-0">
                  <PasswordInput
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    autoComplete="new-password"
                    required
                    className="w-full bg-transparent outline-none text-body1 text-gray-900 placeholder-gray-400 border-none p-0"
                    labelClassName="sr-only"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div>
            <Button
              variant="primary"
              size="md"
              fullWidth
              className="mt-4"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>

            <p className="mt-10 text-center text-body2">
              Remembered your password?
            </p>

            <Button
              variant="outline"
              size="md"
              fullWidth
              className="mt-4"
              onClick={() => navigate('/login')}
              type="button"
            >
              Back to Login
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ResetPassword;

