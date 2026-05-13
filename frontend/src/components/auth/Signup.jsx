import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SetupCode from './SetupCode';
import PasswordInput from '../common/PasswordInput';
import MaterialIcon from '../common/MaterialIcon';
import Button from '../common/Button';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSetupCode, setShowSetupCode] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const result = await signup(name, email, password);
    if (result.success) {
      // Show code setup screen after successful signup
      setShowSetupCode(true);
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  const handleSkipCode = () => {
    navigate('/');
  };

  const handleCodeComplete = () => {
    navigate('/');
  };

  // Show code setup screen if signup was successful
  if (showSetupCode) {
    return <SetupCode onSkip={handleSkipCode} onComplete={handleCodeComplete} />;
  }

  return (

    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div>
          <h2 className="mt-6 text-center text-heading1 font-display font-bold">
            Create your account
          </h2>
        </div>

        <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
          {/* Error */}
          {error && (
            <div className="rounded-md bg-red p-4">
              <div className="text-body2 text-white">{error}</div>
            </div>
          )}

          {/* Fields */}
          <div className="flex flex-col gap-6 px-4 md:px-0">

            {/* Full Name */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="name"
                className="text-body2"
              >
                Full Name
              </label>

              <div className="flex items-center border-b py-layout-xxs focus-within:border-b-gray-800 transition">

                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent outline-none text-body1 text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-body2 "
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

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-body2"
              >
                Password
              </label>

              <div className="flex items-center border-b py-layout-xxs focus-within:border-b-gray-800 transition">

                <div className="flex-1 min-w-0">
                  <PasswordInput
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
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

                <div className="flex-1 min-w-0">
                  <PasswordInput
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    required
                    className="w-full bg-transparent outline-none text-body1 text-gray-900 placeholder-gray-400 border-none p-0"
                    labelClassName="sr-only"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Buttons */}
          <div>
            <Button
              variant="primary"
              size="md"
              fullWidth
              className="mt-4"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </Button>

            <p className="mt-10 text-center text-body2">
              Already have an account?
            </p>

            <Button
              variant="outline"
              size="md"
              fullWidth
              className="mt-4"
              onClick={() => navigate('/login')}
              type="button"
            >
              Sign in instead
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
