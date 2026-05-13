import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import CartItem from './CartItem';
import LoadingSpinner from '../common/LoadingSpinner';
import Alert from '../common/Alert';
import Button from '../common/Button';
import MaterialIcon from '../common/MaterialIcon';

const Cart = () => {
  const { cart, loading, cartItemCount, cartTotal } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Show success message if coming from checkout
    if (location.state?.success && location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the state to prevent showing message on refresh
      window.history.replaceState({}, document.title);
      // Hide message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  }, [location.state]);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      // Redirect to login with return URL
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-heading2 font-bold font-display mb-pdp-gap-btw-sections">Shopping Cart</h1>
        <div className="h-[350px] flex flex-col items-center justify-center">
          <p className="text-gray-500 text-body2 mb-layout-xl">Your cart is empty.</p>
          <Link
            to="/products"
          >
            <Button variant="primary" size="lg" className="flex items-center">
              Continue Shopping
              <MaterialIcon icon="arrow_forward" size={24} />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-heading2 font-bold font-display mb-pdp-gap-btw-sections">Shopping Cart</h1>

      {successMessage && (
        <Alert type="success" message={successMessage} className="mb-6" />
      )}

      <div className="flex flex-col lg:flex-row gap-pdp-gap-btw-sections">

        {/* Cart Items Section */}
        <div className="w-full lg:w-2/3">
            <div className="divide-y divide-gray-200">
              {cart.items.map((item, index) => (
                <CartItem key={item._id || item.tempId || item.product?._id || index} item={item} />
              ))}
            </div>
        </div>

        {/* Order Summary Section */}
        <div className="w-full lg:w-1/3 border flex flex-col p-layout-normal gap-layout-lg">
            <h2 className="text-body1 font-display">Order Summary</h2>
            <div className="border-t" />
            <div className="space-y-2">
              <div className="flex justify-between text-caption">
                <span>Items ({cartItemCount})</span>
                <span>€{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-caption">
                <span>Shipping</span>
                <span>Free</span>
              </div>
            </div>
            <div className="border-t border-black" />
              <div className="flex justify-between text-body2 font-medium">
                <span>Total</span>
                <span>€{cartTotal.toFixed(2)}</span>
              </div>
            <Button
              onClick={handleCheckout}
              fullWidth
              size="md"
            >
              Checkout
              <MaterialIcon icon="arrow_forward" size={24} />
            </Button>
            <Link
              to="/products"
              className="mt-3 block"
            >
              <Button variant="secondary" fullWidth size="sm">
                Continue Shopping
              </Button>
            </Link>

        </div>
      </div>

      {/* Payment Methods */}
      <div className="max-w-7xl flex justify-center my-pdp-gap-btw-sections">
        {/* Image of payment methods on mobile */}
        <img
          src=".././src/assets/imgs/home/payment/payment_mobile.png"
          alt="Payment Methods"
          className="max-w-[300px] md:hidden"
        />
        {/* Image of payment methods on desktop */}
        <img
          src=".././src/assets/imgs/home/payment/payment_desktop.png"
          alt="Payment Methods"
          className="hidden md:block max-w-[500px]"
        />
      </div>
    </div>
  );
};

export default Cart;

