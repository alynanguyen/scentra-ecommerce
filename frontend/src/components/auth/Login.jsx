import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PasswordInput from '../common/PasswordInput';
import MaterialIcon from '../common/MaterialIcon';
import Button from '../common/Button';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    if (result.success) {
      navigate(redirect);
    } else {
      // Provide a more user-friendly error message
      if (result.message && (result.message.toLowerCase().includes('invalid') || result.message.toLowerCase().includes('credentials'))) {
        setError('Wrong password. Please try again.');
      } else {
        setError(result.message || 'Login failed. Please try again.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-heading1 font-display font-bold">
            Login to your account
          </h2>

        </div>
        <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red p-4">
              <div className="text-body2 text-white">{error}</div>
            </div>
          )}
          <div className="flex flex-col gap-6 px-4 md:px-0">

            {/* Email Field */}
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
                  placeholder="youremail@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent outline-none text-body1 text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-body2"
              >
                Password
              </label>

              <div className="flex items-center border-b py-layout-xxs focus-within:border-b-gray-800 transition">

                {/* Password input wrapper */}
                <div className="flex-1 min-w-0">
                  <PasswordInput
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="secretpassword123"
                    autoComplete="current-password"
                    required
                    className="w-full bg-transparent outline-none text-body1 text-gray-900 placeholder-gray-400 border-none p-0"
                    labelClassName="sr-only"
                  />
                </div>

              </div>
            </div>

          </div>

          <div className="flex items-center justify-end">
            <div className="text-body2">
              <Link
                to="/forgotpassword"
                className="font-medium text-gray-900 hover:text-gray-700 underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <div className="px-4 md:px-0">
            <Button
              variant="primary"
              size="md"
              fullWidth
              className="mt-4"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>

            <p className="mt-10 text-center text-body2">Don't have an account yet?</p>
            <Button
              variant="outline"
              size="md"
              fullWidth
              className="mt-4"
              onClick={() => navigate('/signup')}
            >
              Sign up for an account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
