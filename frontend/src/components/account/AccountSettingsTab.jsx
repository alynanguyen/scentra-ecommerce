import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import PasswordInput from '../common/PasswordInput';
import Button from '../common/Button';
import MaterialIcon from '../common/MaterialIcon';

const AccountSettingsTab = () => {
  const { user, loadUser, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showResetCode, setShowResetCode] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [resetCodeLoading, setResetCodeLoading] = useState(false);
  const [resetCodeMessage, setResetCodeMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      apartment: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
  });
  const [originalFormData, setOriginalFormData] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [resetCodeData, setResetCodeData] = useState({
    code: '',
    confirmCode: '',
  });

  useEffect(() => {
    if (user) {
      const initialData = {
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: {
          apartment: user.address?.apartment || '',
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipCode: user.address?.zipCode || '',
          country: user.address?.country || '',
        },
      };
      setFormData(initialData);
      setOriginalFormData(initialData);
    }
  }, [user]);

  const handleEditClick = () => {
    setIsEditing(true);
    setOriginalFormData(JSON.parse(JSON.stringify(formData)));
    setMessage('');
  };

  const handleCancelEdit = () => {
    if (originalFormData) {
      setFormData(JSON.parse(JSON.stringify(originalFormData)));
    }
    setIsEditing(false);
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await authAPI.updateProfile(formData);
      if (response.data.success) {
        setMessage('Profile updated successfully!');
        await loadUser();
        setIsEditing(false);
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const handleResetCodeChange = (e) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    setResetCodeData({
      ...resetCodeData,
      [name]: numericValue,
    });
    setResetCodeMessage('');
  };

  const handleSetResetCode = async (e) => {
    e.preventDefault();
    setResetCodeLoading(true);
    setResetCodeMessage('');

    if (resetCodeData.code.length !== 6) {
      setResetCodeMessage('Code must be exactly 6 digits');
      setResetCodeLoading(false);
      return;
    }

    if (resetCodeData.code !== resetCodeData.confirmCode) {
      setResetCodeMessage('Codes do not match');
      setResetCodeLoading(false);
      return;
    }

    try {
      const response = await authAPI.setResetCode({ code: resetCodeData.code });
      if (response.data.success) {
        setResetCodeMessage('Reset code set successfully!');
        setResetCodeData({
          code: '',
          confirmCode: '',
        });
        setShowResetCode(false);
        await loadUser();
        setTimeout(() => setResetCodeMessage(''), 3000);
      }
    } catch (error) {
      setResetCodeMessage(error.response?.data?.message || 'Failed to set reset code');
    } finally {
      setResetCodeLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordMessage('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage('New passwords do not match');
      setPasswordLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordMessage('New password must be at least 6 characters long');
      setPasswordLoading(false);
      return;
    }

    try {
      const response = await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      if (response.data.success) {
        setPasswordMessage('Password changed successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setShowChangePassword(false);
        setTimeout(() => setPasswordMessage(''), 3000);
      }
    } catch (error) {
      setPasswordMessage(error.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    setMessage('');

    try {
      const response = await authAPI.deleteAccount();
      if (response.data.success) {
        // Logout and redirect to home
        logout();
        navigate('/');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to delete account');
      setShowDeleteConfirm(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-layout-lg">

      {/* HEADER */}
      <div className="flex items-center justify-between">

        <h2 className="text-heading3 font-display font-semibold">
          Account Settings
        </h2>

        {!isEditing && (
          <Button onClick={handleEditClick} size="sm" variant="outline">
            Edit Profile
            <MaterialIcon icon="edit" size={20}/>
          </Button>
        )}
      </div>

      {/* MESSAGE */}
      {message && (
        <div
          className={`rounded-xl px-layout-normal py-layout-sm text-body2 ${
            message.toLowerCase().includes('success')
              ? 'bg-green text-white'
              : 'bg-red text-white'
          }`}
        >
          {message}
        </div>
      )}

      {/* PROFILE FORM */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-homepage-gap-btw-sections">

        {/* PERSONAL INFO */}
        <div className="flex flex-col gap-layout-normal border rounded-xl p-layout-normal">
          <h3 className="text-body1 font-medium font-heading">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-layout-lg ">

            {/* NAME */}
            <div className="flex flex-col gap-layout-xs">
              <label className="text-body2">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                required
                className={`w-full text-body2 bg-transparent outline-none transition ${
                  isEditing
                    ? 'py-2 border-b border-gray-300 focus:border-black'
                    : 'font-medium'
                }`}
              />
            </div>

            {/* EMAIL */}
            <div className="flex flex-col gap-layout-xs">
              <label className="text-body2">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                required
                className={`w-full text-body2 bg-transparent outline-none transition ${
                  isEditing
                    ? 'py-2 border-b border-gray-300 focus:border-black'
                    : 'font-medium'
                }`}
              />
            </div>

            {/* PHONE */}
            <div className="flex flex-col gap-layout-xs md:col-span-2">
              <label className="text-body2">
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full text-body2 bg-transparent outline-none transition ${
                  isEditing
                    ? 'py-2 border-b border-gray-300 focus:border-black'
                    : 'font-medium'
                }`}
              />
            </div>

          </div>
        </div>

        {/* ADDRESS */}
        <div className="flex flex-col gap-layout-normal border rounded-xl p-layout-normal">
          <h3 className="text-body1 font-medium font-heading">
            Shipping Address
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-layout-lg">

            {/* STREET */}
            <div className=" flex flex-col gap-layout-xs">
              <label className="text-body2">
                Street Address
              </label>

              <input
                type="text"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full text-body2 bg-transparent outline-none transition ${
                  isEditing
                    ? 'py-2 border-b border-gray-300 focus:border-black'
                    : 'font-medium'
                }`}
              />
            </div>

            {/* APARTMENT */}
            <div className="flex flex-col gap-layout-xs">
              <label className="text-body2">
                Apartment / Unit
              </label>

              <input
                type="text"
                name="address.apartment"
                value={formData.address.apartment || ''}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full text-body2 bg-transparent outline-none transition ${
                  isEditing
                    ? 'py-2 border-b border-gray-300 focus:border-black'
                    : 'font-medium'
                }`}
              />
            </div>

            {/* CITY */}
            <div className="flex flex-col gap-layout-xs">
              <label className="text-body2">
                City
              </label>

              <input
                type="text"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full text-body2 bg-transparent outline-none transition ${
                  isEditing
                    ? 'py-2 border-b border-gray-300 focus:border-black'
                    : 'font-medium'
                }`}
              />
            </div>


            {/* ZIP */}
            <div className="flex flex-col gap-layout-xs">
              <label className="text-body2">
                Postal Code
              </label>

              <input
                type="text"
                name="address.zipCode"
                value={formData.address.zipCode}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full text-body2 bg-transparent outline-none transition ${
                  isEditing
                    ? 'py-2 border-b border-gray-300 focus:border-black'
                    : 'font-medium'
                }`}
              />
            </div>

            {/* COUNTRY */}
            <div className="md:col-span-2 flex flex-col gap-layout-xs">
              <label className="text-body2">
                Country
              </label>

              <input
                type="text"
                name="address.country"
                value={formData.address.country}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full text-body2 bg-transparent outline-none transition ${
                  isEditing
                    ? 'py-2 border-b border-gray-300 focus:border-black'
                    : 'font-medium'
                }`}
              />
            </div>

          </div>
        </div>

        {/* ACTION BUTTONS */}
        {isEditing && (
          <div className="flex items-center gap-4 md:gap-10">
            <Button
              type="submit"
              disabled={loading}
              fullWidth
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleCancelEdit}
              disabled={loading}
              fullWidth
            >
              Cancel
            </Button>
          </div>
        )}
      </form>



      {/* RESET CODE */}
      <div className=" flex flex-col gap-layout-normal border rounded-xl p-layout-normal">

        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-body1 font-medium font-heading">
              6-Digit Password Reset Code
            </h3>

            <p className="text-caption text-gray-500 mt-1">
              This code is required when resetting your password. {user?.hasResetCode ? 'You have set up a reset code.' : 'You have not set up a reset code yet.'}
            </p>
          </div>

          {!showResetCode && (
            <Button
              onClick={() => setShowResetCode(true)}
              className="mx-auto"
            >
              {user?.hasResetCode ? 'Update Code' : 'Set Up Code'}
            </Button>
          )}
        </div>

        {/* KEEP YOUR EXISTING RESET CODE FORM */}
        {showResetCode && (
          <form onSubmit={handleSetResetCode} className="flex flex-col gap-layout-lg">
            {resetCodeMessage && (
              <div
                className={`p-3 rounded-md ${
                  resetCodeMessage.includes('success')
                    ? 'bg-green text-white'
                    : 'bg-red text-white'
                }`}
              >
                {resetCodeMessage}
              </div>
            )}

            <div className="flex flex-col gap-layout-xs p-1">
              <label className="text-body2 font-medium">
                {user?.hasResetCode ? 'New 6-Digit Code' : '6-Digit Code'}
              </label>
              <input
                type="text"
                name="code"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={resetCodeData.code}
                onChange={handleResetCodeChange}
                required
                className="w-fit mx-auto border rounded-lg py-2 border-gray-300 focus:outline-none focus:border-black text-center text-heading1 tracking-widest"
                placeholder="000000"
              />
            </div>

            <div className="p-1 flex flex-col gap-layout-xs">
              <label className="text-body2 font-medium">
                Confirm Code
              </label>
              <input
                type="text"
                name="confirmCode"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={resetCodeData.confirmCode}
                onChange={handleResetCodeChange}
                required
                className="w-fit mx-auto border rounded-lg py-2 border-gray-300 focus:outline-none focus:border-black text-center text-heading1 tracking-widest"
                placeholder="000000"
              />
            </div>

            <div className="flex gap-4 md:gap-10 text-body2">
              <button
                type="submit"
                disabled={resetCodeLoading || resetCodeData.code.length !== 6 || resetCodeData.confirmCode.length !== 6}
                className="flex-1 bg-black text-white py-2 px-4 rounded-full hover:bg-gray-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {resetCodeLoading ? 'Setting up...' : user?.resetCode ? 'Update Code' : 'Set Up Code'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowResetCode(false);
                  setResetCodeData({
                    code: '',
                    confirmCode: '',
                  });
                  setResetCodeMessage('');
                }}
                disabled={resetCodeLoading}
                className="flex-1 border border-black bg-white text-black py-2 px-4 rounded-full hover:border-gray-700 hover:text-gray-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* PASSWORD */}
      <div className="flex flex-col gap-layout-normal border rounded-xl p-layout-normal">

        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-body1 font-medium font-heading">
              Password
            </h3>

            <p className="text-caption text-gray-500 mt-1">
              Change your account password securely.
            </p>
          </div>

          {!showChangePassword && (
            <Button
              variant="outline"
              onClick={() => setShowChangePassword(true)}
              className="mx-auto"
            >
              Change Password
            </Button>
          )}
        </div>

        {/* KEEP YOUR EXISTING PASSWORD FORM */}
          {showChangePassword && (
            <form onSubmit={handleChangePassword} className="flex flex-col gap-layout-lg">
              {passwordMessage && (
                <div
                  className={`p-3 rounded-md ${
                    passwordMessage.includes('success')
                      ? 'bg-green text-white'
                      : 'bg-red text-white'
                  }`}
                >
                  {passwordMessage}
                </div>
              )}

              <PasswordInput
                id="currentPassword"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Enter your current password"
                required
                label="Current Password"
                className="w-full py-2 border-b border-gray-300 focus:outline-none focus:border-black text-body2"
              />

              <PasswordInput
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter your new password (min. 6 characters)"
                required
                minLength={6}
                label="New Password"
                className="w-full py-2 border-b border-gray-300 focus:outline-none focus:border-black text-body2"            />

              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm your new password"
                required
                minLength={6}
                label="Confirm New Password"
                className="w-full py-2 border-b border-gray-300 focus:outline-none focus:border-black text-body2"
              />

              <div className="flex gap-4 md:gap-10 text-body2">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="flex-1 bg-black text-white py-2 px-4 rounded-full hover:bg-gray-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {passwordLoading ? 'Changing...' : 'Change Password'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowChangePassword(false);
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: '',
                    });
                    setPasswordMessage('');
                  }}
                  disabled={passwordLoading}
                  className="flex-1 border border-black bg-white text-black py-2 px-4 rounded-full hover:border-gray-700 hover:text-gray-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
      </div>

      {/* DANGER ZONE */}
      <div className="border-t pt-layout-xl">

        <div className="rounded-2xl border border-red-200 bg-red-50 p-layout-normal">

          <div className="flex flex-col gap-layout-sm">
            <div>
              <h3 className="text-body1 font-medium font-heading">
                Danger Zone
              </h3>

              <p className="text-caption text-red mt-1">
                Deleting your account is permanent and cannot be undone.
              </p>
            </div>

            {!showDeleteConfirm ? (
              <Button
                onClick={() => setShowDeleteConfirm(true)}
                className="mx-auto"
                variant="danger"
              >
                Delete Account
              </Button>
            ) : (
              <div className="flex flex-col gap-layout-normal">

                <p className="text-body2 text-red">
                  Are you sure you want to permanently delete your account? This action cannot be undone.
                </p>

                <div className="flex gap-layout-sm">
                  <Button
                    onClick={handleDeleteAccount}
                    disabled={deleteLoading}
                    className="bg-red hover:opacity-90"
                  >
                    {deleteLoading
                      ? 'Deleting...'
                      : 'Yes, delete my account'}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={deleteLoading}
                  >
                    Cancel
                  </Button>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default AccountSettingsTab;
