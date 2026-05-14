import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ordersAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { getImageUrl, placeholderDataUri } from '../../utils/imageUtils';
import Button from '../common/Button';
import MaterialIcon from '../common/MaterialIcon';

const Checkout = () => {
  const { cart, cartTotal, loadCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // const [shippingAddress, setShippingAddress] = useState({
  //   street: user?.address?.street || '',
  //   city: user?.address?.city || '',
  //   state: user?.address?.state || '',
  //   zipCode: user?.address?.zipCode || '',
  //   country: user?.address?.country || '',
  // });
  const [shippingAddress, setShippingAddress] = useState({
  firstName: user?.address?.firstName || '',
  lastName: user?.address?.lastName || '',
  phoneNumber: user?.address?.phoneNumber || '',
  company: user?.address?.company || '',
  street: user?.address?.street || '',
  apartment: user?.address?.apartment || '',
  city: user?.address?.city || '',
  zipCode: user?.address?.zipCode || '',
  country: user?.address?.country || '',
  });
  const [useDifferentBilling, setUseDifferentBilling] = useState(false);
  const [billingAddress, setBillingAddress] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    company: '',
    street: '',
    apartment: '',
    city: '',
    zipCode: '',
    country: '',
  });
  // const [paymentMethod] = useState('card'); // Only card payment available
  const [paymentMethod, setPaymentMethod] = useState('card'); // default
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [detectedCardType, setDetectedCardType] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    // Require authentication for checkout
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
      return;
    }

    if (!cart || !cart.items || cart.items.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate, isAuthenticated]);

  const handleCouponApply = (e) => {
    e.preventDefault();
    setCouponError('');

    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    const code = couponCode.trim().toUpperCase();
    if (code === 'FREE') {
      setDiscount(cartTotal);
      setCouponApplied(true);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code. Please use "FREE" for 100% discount.');
      setCouponApplied(false);
      setDiscount(0);
    }
  };

  const detectCardType = (cardNumber) => {
    const cleaned = cardNumber.replace(/\s/g, '');
    if (!cleaned) return null;

    // Visa: starts with 4
    if (cleaned.startsWith('4')) {
      return 'visa';
    }
    // Mastercard: starts with 5 (51-55)
    if (cleaned.startsWith('5') && cleaned.length >= 2) {
      const firstTwo = parseInt(cleaned.substring(0, 2));
      if (firstTwo >= 51 && firstTwo <= 55) {
        return 'mastercard';
      }
    }
    // American Express: starts with 3 (34 or 37)
    if (cleaned.startsWith('3') && cleaned.length >= 2) {
      const firstTwo = cleaned.substring(0, 2);
      if (firstTwo === '34' || firstTwo === '37') {
        return 'amex';
      }
    }
    return null;
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\s/g, '');
    if (value.length <= 16) {
      value = value.match(/.{1,4}/g)?.join(' ') || value;
      setCardDetails({ ...cardDetails, cardNumber: value });
      // Detect card type
      const cardType = detectCardType(value);
      setDetectedCardType(cardType);
    }
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2);
      }
      setCardDetails({ ...cardDetails, expiryDate: value });
    }
  };

  const handleCvvChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 3) {
      setCardDetails({ ...cardDetails, cvv: value });
    }
  };

  const validateShippingAddress = () => {
    if (!shippingAddress.street.trim()) {
      return 'Please enter street address';
    }
    if (!shippingAddress.city.trim()) {
      return 'Please enter city';
    }
    if (!shippingAddress.zipCode.trim()) {
      return 'Please enter zip code';
    }
    if (!shippingAddress.country.trim()) {
      return 'Please enter country';
    }
    return null;
  };

  const validateCardDetails = () => {
    if (!cardDetails.cardNumber || cardDetails.cardNumber.replace(/\s/g, '').length !== 16) {
      return 'Please enter a valid 16-digit card number';
    }
    if (!cardDetails.expiryDate || !/^\d{2}\/\d{2}$/.test(cardDetails.expiryDate)) {
      return 'Please enter a valid expiry date (MM/YY)';
    }
    const [month, year] = cardDetails.expiryDate.split('/');
    const expiryMonth = parseInt(month);
    const expiryYear = 2000 + parseInt(year);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
      return 'Card has expired';
    }
    if (!cardDetails.cvv || cardDetails.cvv.length !== 3) {
      return 'Please enter a valid 3-digit CVV';
    }
    if (!cardDetails.cardholderName || cardDetails.cardholderName.trim().length < 2) {
      return 'Please enter cardholder name';
    }
    return null;
  };

  const handleNext = () => {
    setError('');

    if (currentStep === 1) {
      // Validate shipping address
      const addressError = validateShippingAddress();
      if (addressError) {
        setError(addressError);
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Validate coupon code
      if (!couponApplied || couponCode.trim().toUpperCase() !== 'FREE') {
        setError('You must apply the "FREE" coupon code to proceed.');
        return;
      }
      setCurrentStep(3);
    }
  };

  const handlePrevious = () => {
    setError('');
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setPaymentProcessing(false);
    setPaymentSuccess(false);

    // Validate coupon code
    if (!couponApplied || couponCode.trim().toUpperCase() !== 'FREE') {
      setError('You must apply the "FREE" coupon code to proceed. This ensures no real money is charged.');
      setLoading(false);
      return;
    }

    // Validate card details
    const cardValidationError = validateCardDetails();
    if (cardValidationError) {
      setError(cardValidationError);
      setLoading(false);
      return;
    }

    try {
      const finalTotal = cartTotal - discount;

      const orderData = {
        shippingAddress,
        paymentMethod: 'card',
        paymentIntentId: `demo-${Date.now()}`,
        couponCode: 'FREE',
        discount: discount,
        totalPrice: finalTotal,
        cardDetails: {
          last4: cardDetails.cardNumber.slice(-4).replace(/\s/g, ''),
          brand: detectedCardType || 'visa',
        }
      };

      // Show payment processing state
      setPaymentProcessing(true);

      // Simulate payment processing delay (1-2 seconds)
      await new Promise(resolve => setTimeout(resolve, 1500));

      const response = await ordersAPI.createOrder(orderData);
      if (response.data.success) {
        // Show payment success state
        setPaymentProcessing(false);
        setPaymentSuccess(true);

        await loadCart();
        // Trigger event to update Header unread notification count
        window.dispatchEvent(new Event('notificationUpdated'));

        // Wait a bit to show success message, then navigate to cart
        setTimeout(() => {
          navigate('/cart', {
            state: {
              success: true,
              message: 'Order placed successfully!',
              orderNumber: response.data.data.orderNumber
            }
          });
        }, 2000);
      }
    } catch (err) {
      setPaymentProcessing(false);
      setPaymentSuccess(false);
      setError(err.response?.data?.message || 'Failed to create order');
      setLoading(false);
    }
  };

  if (!cart || !cart.items || cart.items.length === 0) {
    return null;
  }


  const steps = [
    { number: 1, title: 'Shipping Information' },
    { number: 2, title: 'Billing Address' },
    { number: 3, title: 'Payment Details' },
  ];

  return (
    <>
      {/* Payment Processing Overlay */}
      {(paymentProcessing || paymentSuccess) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            {paymentProcessing && (
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-700 mx-auto mb-4"></div>
                <h3 className="text-heading2 font-semibold text-gray-900 mb-2">Processing Payment</h3>
                <p className="text-gray-600">Please wait while we process your payment...</p>
              </div>
            )}
            {paymentSuccess && (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-heading2 font-semibold text-gray-900 mb-2">Payment Successful!</h3>
                <p className="text-gray-600">Your order has been placed successfully.</p>
                <p className="text-body2 text-gray-500 mt-2">Redirecting to cart...</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-pdp-gap-btw-sections">
        <div className="flex flex-col gap-layout-lg">
          <h1 className="text-heading2 font-display font-bold">Checkout</h1>

          {/* Step Indicator */}
          <div className="flex items-center gap-layout-xs">

            {steps.map((step, index) => {
              const isCompleted = currentStep > step.number;
              const isActive = currentStep === step.number;
              const isPassed = currentStep >= step.number;
              const isLastStep = index === steps.length - 1;

              return (
                <div
                  key={step.number}
                  className={`flex items-center  ${
                    !isLastStep ? "flex-1" : "flex-none"
                  }`}
                >

                  {/* Step */}
                  <div className="flex items-center gap-layout-xs">

                    {/* Circle */}
                    <div
                      className={`flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-full text-caption font-medium transition-colors duration-300
                        ${
                          isPassed
                            ? 'bg-black text-white'
                            : 'bg-gray-200 text-gray-400'
                        }`}
                    >
                      {step.number}
                    </div>

                    {/* Title */}
                    <div className="flex flex-col min-w-fit">
                      {/* Mobile */}
                      <span
                        className={`text-body2 font-medium md:hidden whitespace-nowrap ${
                          isActive ? 'block text-black mr-layout-xs' : 'hidden'
                        }`}
                      >
                        {step.title}
                      </span>

                      {/* Desktop */}
                      <span
                        className={`hidden md:block text-body2 font-medium whitespace-nowrap ${
                          isPassed ? 'text-black mr-layout-xs' : 'text-gray-500 mr-layout-xs'
                        }`}
                      >
                        {step.title}
                      </span>
                    </div>

                  </div>

                  {/* Progress Line */}
                  {index < steps.length - 1 && (
                    <div
                      className={`h-[2px] min-w-[1rem] flex-1 transition-colors duration-300 ${
                        isCompleted ? 'bg-black' : 'bg-gray-300'
                      }`}
                    />
                  )}

                </div>
              );
            })}

          </div>

        </div>

      {error && (
        <div className="mb-4 p-4 bg-red rounded-md">
          <p className="text-body2 text-white">{error}</p>
        </div>
      )}

      {/* <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8"> */}
      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-pdp-gap-btw-sections">
        <div className="w-full gap-pdp-gap-btw-sections flex flex-col">
          {/* Step 1: Shipping Information */}
          {currentStep === 1 && (
          <div className="flex flex-col gap-layout-lg">
            <h2 className="text-body1 font-semibold font-display">Shipping Information</h2>

            {/* Information form */}

            <div className="grid grid-cols-2 gap-layout-lg text-body2">

              {/* Row 1: First Name */}
              <div className="flex flex-col">
                {shippingAddress.firstName && (
                  <label className="text-caption text-gray-700 transition-all duration-200">First Name</label>
                )}
                <input
                  type="text"
                  placeholder="First Name *"
                  required
                  value={shippingAddress.firstName}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, firstName: e.target.value })
                  }
                  className="w-full py-layout-xs border-b border-gray-300 focus:border-b-black focus:outline-none"
                />
              </div>

              {/* Row 1: Last Name */}
              <div className="flex flex-col">
                {shippingAddress.lastName && (
                  <label className="text-caption text-gray-700 transition-all duration-200">Last Name</label>
                )}
                <input
                  type="text"
                  placeholder="Last Name *"
                  required
                  value={shippingAddress.lastName}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, lastName: e.target.value })
                  }
                  className="w-full py-layout-xs border-b border-gray-300 focus:border-b-black focus:outline-none"
                />
              </div>

              {/* Row 2: Phone (full width) */}
              <div className="col-span-2 flex flex-col">
                {shippingAddress.phoneNumber && (
                  <label className="text-caption text-gray-700 transition-all duration-200">Phone Number</label>
                )}
                <input
                  type="text"
                  placeholder="Phone Number * (eg. +358 123456789)"
                  required
                  value={shippingAddress.phoneNumber}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, phoneNumber: e.target.value })
                  }
                  className="w-full py-layout-xs border-b border-gray-300 focus:border-b-black focus:outline-none"
                />
              </div>

              {/* Row 3: Company */}
              <div className="col-span-2 flex flex-col">
                {shippingAddress.company && (
                  <label className="text-caption text-gray-700 transition-all duration-200">Company</label>
                )}
                <input
                  type="text"
                  placeholder="Company (optional)"
                  value={shippingAddress.company}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, company: e.target.value })
                  }
                  className="w-full py-layout-xs border-b border-gray-300 focus:border-b-black focus:outline-none"
                />
              </div>

              {/* Row 4: Street */}
              <div className="col-span-2 flex flex-col">
                {shippingAddress.street && (
                  <label className="text-caption text-gray-700 transition-all duration-200">Street Address</label>
                )}
                <input
                  type="text"
                  placeholder="Street Address *"
                  required
                  value={shippingAddress.street}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, street: e.target.value })
                  }
                  className="w-full py-layout-xs border-b border-gray-300 focus:border-b-black focus:outline-none"
                />
              </div>

              {/* Row 5: Apartment */}
              <div className="col-span-2 flex flex-col">
                {shippingAddress.apartment && (
                  <label className="text-caption text-gray-700 transition-all duration-200">Apartment</label>
                )}
                <input
                  type="text"
                  placeholder="Apartment, suite, etc. (optional)"
                  value={shippingAddress.apartment}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, apartment: e.target.value })
                  }
                  className="w-full py-layout-xs border-b border-gray-300 focus:border-b-black focus:outline-none"
                />
              </div>

              {/* Row 6: City */}
              <div className="flex flex-col">
                {shippingAddress.city && (
                  <label className="text-caption text-gray-700 transition-all duration-200">City</label>
                )}
                <input
                  type="text"
                  placeholder="City *"
                  required
                  value={shippingAddress.city}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, city: e.target.value })
                  }
                  className="w-full py-layout-xs border-b border-gray-300 focus:border-b-black focus:outline-none"
                />
              </div>

              {/* Row 6: Zip */}
              <div className="flex flex-col">
                {shippingAddress.zipCode && (
                  <label className="text-caption text-gray-700 transition-all duration-200">Zip Code</label>
                )}
                <input
                  type="text"
                  placeholder="Zip Code *"
                  required
                  value={shippingAddress.zipCode}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, zipCode: e.target.value })
                  }
                  className="w-full py-layout-xs border-b border-gray-300 focus:border-b-black focus:outline-none"
                />
              </div>

              {/* Row 7: Country */}
              <div className="col-span-2 flex flex-col">
                {shippingAddress.country && (
                  <label className="text-caption text-gray-700 transition-all duration-200">Country</label>
                )}
                <input
                  type="text"
                  placeholder="Country *"
                  required
                  value={shippingAddress.country}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, country: e.target.value })
                  }
                  className="w-full py-layout-xs border-b border-gray-300 focus:border-b-black focus:outline-none"
                />
              </div>

            </div>
          </div>
          )}

          {/* Step 2: Billing Address */}
          {currentStep === 2 && (
            <div className="flex flex-col gap-layout-lg">

              <h2 className="text-body1 font-semibold font-display">
                Billing Address
              </h2>

              {/* Checkbox */}
              <label className="flex items-center gap-2 text-body2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useDifferentBilling}
                  onChange={(e) => setUseDifferentBilling(e.target.checked)}
                  className="w-4 h-4 accent-black"
                />
                Different billing address?
              </label>

              {/* Conditional Billing Form (UI ONLY) */}
              {useDifferentBilling && (
                <div className="grid grid-cols-2 gap-layout-lg text-body2">

                  {/* Same structure as shipping — NO LOGIC CHANGE */}

                  <div className="flex flex-col">
                    {billingAddress.firstName && <label className="text-body2 text-gray-500 mb-1">First Name</label>}
                    <input
                      type="text"
                      placeholder="First Name *"
                      value={billingAddress.firstName}
                      onChange={(e) => setBillingAddress({ ...billingAddress, firstName: e.target.value })}
                      className="w-full py-layout-xs border-b border-gray-300 focus:border-b-black focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col">
                    {billingAddress.lastName && <label className="text-body2 text-gray-500 mb-1">Last Name</label>}
                    <input
                      type="text"
                      placeholder="Last Name *"
                      value={billingAddress.lastName}
                      onChange={(e) => setBillingAddress({ ...billingAddress, lastName: e.target.value })}
                      className="w-full py-layout-xs border-b border-gray-300 focus:border-b-black focus:outline-none"
                    />
                  </div>

                  <div className="col-span-2 flex flex-col">
                    {billingAddress.phoneNumber && <label className="text-body2 text-gray-500 mb-1">Phone Number</label>}
                    <input
                      type="text"
                      placeholder="Phone Number *"
                      value={billingAddress.phoneNumber}
                      onChange={(e) => setBillingAddress({ ...billingAddress, phoneNumber: e.target.value })}
                      className="w-full py-layout-xs border-b border-gray-300 focus:border-b-black focus:outline-none"
                    />
                  </div>

                  <div className="col-span-2 flex flex-col">
                    {billingAddress.company && <label className="text-body2 text-gray-500 mb-1">Company</label>}
                    <input
                      type="text"
                      placeholder="Company (optional)"
                      value={billingAddress.company}
                      onChange={(e) => setBillingAddress({ ...billingAddress, company: e.target.value })}
                      className="w-full py-layout-xs border-b border-gray-300 focus:border-b-black focus:outline-none"
                    />
                  </div>

                  <div className="col-span-2 flex flex-col">
                    {billingAddress.street && <label className="text-body2 text-gray-500 mb-1">Street Address</label>}
                    <input
                      type="text"
                      placeholder="Street Address *"
                      value={billingAddress.street}
                      onChange={(e) => setBillingAddress({ ...billingAddress, street: e.target.value })}
                      className="w-full py-layout-xs border-b border-gray-300 focus:border-b-black focus:outline-none"
                    />
                  </div>

                  <div className="col-span-2 flex flex-col">
                    {billingAddress.apartment && <label className="text-body2 text-gray-500 mb-1">Apartment</label>}
                    <input
                      type="text"
                      placeholder="Apartment (optional)"
                      value={billingAddress.apartment}
                      onChange={(e) => setBillingAddress({ ...billingAddress, apartment: e.target.value })}
                      className="w-full py-layout-xs border-b border-gray-300 focus:border-b-black focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col">
                    {billingAddress.city && <label className="text-body2 text-gray-500 mb-1">City</label>}
                    <input
                      type="text"
                      placeholder="City *"
                      value={billingAddress.city}
                      onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
                      className="w-full py-layout-xs border-b border-gray-300 focus:border-b-black focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col">
                    {billingAddress.zipCode && <label className="text-body2 text-gray-500 mb-1">Zip Code</label>}
                    <input
                      type="text"
                      placeholder="Zip Code *"
                      value={billingAddress.zipCode}
                      onChange={(e) => setBillingAddress({ ...billingAddress, zipCode: e.target.value })}
                      className="w-full py-layout-xs border-b border-gray-300 focus:border-b-black focus:outline-none"
                    />
                  </div>

                  <div className="col-span-2 flex flex-col">
                    {billingAddress.country && <label className="text-body2 text-gray-500 mb-1">Country</label>}
                    <input
                      type="text"
                      placeholder="Country *"
                      value={billingAddress.country}
                      onChange={(e) => setBillingAddress({ ...billingAddress, country: e.target.value })}
                      className="w-full py-layout-xs border-b border-gray-300 focus:border-b-black focus:outline-none"
                    />
                  </div>

                </div>
              )}

              {/* Info message */}
              <div className="px-3 py-2 rounded-lg border border-yellow text-body2">
                <strong>Important:</strong> To proceed to the next step, you must apply the coupon code FREE.
              </div>

            </div>
          )}

          {/* Step 3: Payment Details */}

          {currentStep === 3 && (
            <div className="flex flex-col gap-layout-lg">
              <h2 className="text-body1 font-display font-semibold">Payment Details</h2>

              <div className="flex flex-col gap-layout-xs">

                {/* CARD */}
                <div className="flex flex-col gap-layout-sm">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className="w-full flex items-center gap-layout-sm"
                  >
                    {/* Radio */}
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        paymentMethod === 'card' ? 'border-black' : 'border-gray-400'
                      }`}
                    >
                      {paymentMethod === 'card' && (
                        <div className="w-2 h-2 bg-black rounded-full" />
                      )}
                    </div>

                    {/* Label + Icons */}
                    <div className="flex items-center gap-layout-normal">
                      <span className="text-body2">Card (VISA, Mastercard)</span>
                      <div className="flex items-center gap-layout-xs">
                        <img src="/imgs/checkout/payment_methods/visa.png" alt="Visa" className="h-6 md:h-8 object-contain" />
                        <img src="/imgs/checkout/payment_methods/mastercard.png" alt="Mastercard" className="h-6 md:h-8 object-contain" />
                        <img src="/imgs/checkout/payment_methods/amex.png" alt="Amex" className="h-10 md:h-12 object-contain" />
                      </div>
                    </div>
                  </button>

                  {paymentMethod === 'card' && (
                    <div className="py-layout-normal px-layout-sm mb-layout-sm border rounded-xl flex flex-col gap-layout-lg">

                      {/* Cardholder */}
                      <div className="flex flex-col gap-layout-xxs">
                        <label className="block text-caption">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="John Doe"
                          value={cardDetails.cardholderName}
                          onChange={(e) =>
                            setCardDetails({ ...cardDetails, cardholderName: e.target.value })
                          }
                          className="w-full py-layout-xxs border-b border-gray-300 focus:outline-none focus:ring-gray-700 text-body2"
                        />
                      </div>

                      {/* Card Number */}
                      <div className="flex flex-col gap-layout-xxs">
                        <label className="block text-caption">
                          Card Number
                        </label>

                        <div className="relative">
                          <input
                            type="text"
                            required
                            placeholder="1234 5678 9012 3456"
                            value={cardDetails.cardNumber}
                            onChange={handleCardNumberChange}
                            maxLength={19}
                            className="w-full py-layout-xxs pr-28 border-b border-gray-300 focus:outline-none focus:ring-gray-800 text-body2"
                          />

                          {/* Card Logos */}
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">

                            <img
                              src="/imgs/checkout/payment_methods/visa.png"
                              alt="Visa"
                              className={`h-4 transition ${
                                detectedCardType === 'visa'
                                  ? 'opacity-100 scale-110'
                                  : detectedCardType === null
                                  ? 'opacity-40'
                                  : 'opacity-20'
                              }`}
                            />

                            <img
                              src="/imgs/checkout/payment_methods/mastercard.png"
                              alt="Mastercard"
                              className={`h-4 transition ${
                                detectedCardType === 'mastercard'
                                  ? 'opacity-100 scale-110'
                                  : detectedCardType === null
                                  ? 'opacity-40'
                                  : 'opacity-20'
                              }`}
                            />

                            <img
                              src="/imgs/checkout/payment_methods/amex.png"
                              alt="Amex"
                              className={`h-6 transition ${
                                detectedCardType === 'amex'
                                  ? 'opacity-100 scale-110'
                                  : detectedCardType === null
                                  ? 'opacity-40'
                                  : 'opacity-20'
                              }`}
                            />

                          </div>
                        </div>
                      </div>

                      {/* Expiry + CVV */}
                      <div className="grid grid-cols-2 gap-layout-xl">
                        <div className="flex flex-col gap-layout-xxs">
                          <label className="block text-caption">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="MM/YY"
                            value={cardDetails.expiryDate}
                            onChange={handleExpiryChange}
                            maxLength={5}
                            className="w-full py-layout-xxs border-b border-gray-300 text-body2 focus:outline-none focus:ring-gray-800"
                          />
                        </div>

                        <div className="flex flex-col gap-layout-xxs">
                          <label className="block text-caption">
                            CVV
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="123"
                            value={cardDetails.cvv}
                            onChange={handleCvvChange}
                            maxLength={3}
                            className="w-full py-layout-xxs border-b border-gray-300 text-body2 focus:outline-none focus:ring-gray-800"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* OTHER METHODS */}
                {[
                  { key: 'apple', label: 'Apple Pay', img: '/imgs/checkout/payment_methods/applepay.png' },
                  { key: 'google', label: 'Google Pay', img: '/imgs/checkout/payment_methods/googlepay.png' },
                  { key: 'paypal', label: 'PayPal', img: '/imgs/checkout/payment_methods/paypal.png' },
                  { key: 'klarna', label: 'Klarna', img: '/imgs/checkout/payment_methods/klarna.png' },
                ].map((method) => (
                  <div key={method.key} className="py-layout-xs">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod(method.key)}
                      className="w-full flex items-center gap-layout-sm"
                    >
                      {/* Radio */}
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          paymentMethod === method.key ? 'border-black' : 'border-gray-400'
                        }`}
                      >
                        {paymentMethod === method.key && (
                          <div className="w-2 h-2 bg-black rounded-full" />
                        )}
                      </div>

                      {/* Icon + Label */}
                      <div className="flex items-center gap-layout-normal">
                        <span className="text-body2">{method.label}</span>
                        <img src={method.img} alt={method.label} className="h-6 md:h-8 object-contain" />
                      </div>
                    </button>

                    {paymentMethod === method.key && (
                      <div className="py-layout-sm">
                        <p className="text-body2 text-gray-600">
                          This method is not available yet. Right now we only accept card payments.
                        </p>
                      </div>
                    )}
                  </div>
                ))}

              </div>

              {/* NOTE */}
              <div className="mt-4 py-2 px-3 border rounded-xl border-blue">
                <p className="text-body2 text-black">
                  <strong>Note:</strong> We never store your card payment details.
                  To test the card payment function, use card number "4242 4242 4242 4242".
                  For other card details, you can type random information.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-6">
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="px-4 py-1 md:px-6 md:py-2 flex items-center gap-1 border border-black text-black rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <MaterialIcon icon="arrow_back" />
                Previous
              </button>


              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-4 py-1 md:px-6 md:py-2 flex items-center gap-1 bg-black text-white rounded-full hover:bg-gray-700 transition-colors"
                >
                  Next
                  <MaterialIcon icon="arrow_forward" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading || !couponApplied}
                  className="px-4 py-1 md:px-6 md:py-2 bg-black text-white rounded-full hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
              )}

            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:min-w-[360px]">
          <div className="border border-gray-500 p-layout-normal flex flex-col gap-layout-lg sticky top-4">
            <div className="border-b-[0.5px] border-solid border-gray-500 text-body1 font-semibold font-display pb-layout-sm">Order Summary</div>
            <div>
              {cart.items.map((item) => {
                const itemPrice = Array.isArray(item.price)
                  ? (item.price.length > 0 ? item.price[0] : 0)
                  : (item.price || 0);
                const itemVolume = item.volume || 0;
                const imageUrl = getImageUrl(item.product?.image_path);
                return (
                  <div key={item._id || item.product?._id} className="flex items-center gap-layout-sm ">
                    {/* Product Image */}
                    <div className="flex-shrink-0 w-[40px] h-[40px] md:w-[60px] md:h-[60px] overflow-hidden flex items-center justify-center p-1">
                      {imageUrl ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <img
                            src={imageUrl}
                            alt={item.product.name}
                            className="w-full object-contain drop-shadow-sm"
                            onError={(e) => {
                              try { e.target.onerror = null; } catch (err) {}
                              e.target.src = placeholderDataUri(30, 30, 'Perfume');
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="w-full flex items-center justify-between">
                      {/* Product Info */}
                      <div className="w-full flex flex-col gap-layout-xxs">
                        <div className="text-caption font-medium">
                          {item.product.name} {itemVolume > 0 ? `- ${itemVolume}ml` : ''}
                        </div>
                        <div className="text-overline">
                          Quantity: {item.quantity}
                        </div>
                      </div>
                      {/* Price */}
                      <div className="">
                        <span className="text-body2 font-semibold">
                          €{(itemPrice * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Coupon Code */}
            <div className="flex flex-col gap-layout-xxs border-y-[0.5px] border-solid border-gray-500 py-layout-lg">
              <p className="text-caption">Discount Code</p>
              <div className="flex gap-layout-sm">
                <input
                  type="text"
                  placeholder="YOURDISCOUNTCODE"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value);
                    if (couponApplied) {
                      setCouponApplied(false);
                      setDiscount(0);
                    }
                  }}
                  className="flex-1 text-body2 py-layout-xxs border-b focus:outline-none bg-white"
                  disabled={couponApplied}
                />

                <button
                  type="button"
                  onClick={handleCouponApply}
                  disabled={couponApplied}
                  className="px-3 py-1 lg:px-4 lg:py-2 rounded-full text-body2 bg-black text-white disabled:opacity-50"
                >
                  {couponApplied ? 'Applied' : 'Apply'}
                </button>
              </div>

              {couponError && (
                <p className="text-caption text-red mt-2">{couponError}</p>
              )}

              {couponApplied && (
                <p className="text-caption text-green mt-2">
                  FREE coupon applied successfully
                </p>
              )}
            </div>


            <div className="flex flex-col gap-layout-xs">
              <div className="flex justify-between text-caption">
                <span>Subtotal</span>
                <span>€{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-caption ">
                <span>Shipping fee</span>
                <span>€0.00</span>
              </div>
              {couponApplied && discount > 0 && (
                <div className="flex justify-between text-caption">
                  <span>Discount (FREE)</span>
                  <span>-€{discount.toFixed(2)}</span>
                </div>
              )}
              {/* {couponApplied && (
                <p className="text-xs text-green-600 font-medium text-center pt-2">
                  ✓ Order total: €0.00 (100% discount applied)
                </p>
              )} */}
            </div>

            <div className="flex justify-between text-body2 font-semibold border-t border-black pt-layout-lg">
                <span>Total</span>
                <span>€{(cartTotal - discount).toFixed(2)}</span>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red rounded-lg">
                <p className="text-body2 text-white">{error}</p>
              </div>
            )}

            {currentStep === 2 && !couponApplied && (
              <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                <p className="text-body2 text-white">
                  <strong>Required:</strong> Please apply the "FREE" coupon code to continue.
                </p>
              </div>
            )}

            {currentStep === 3 && !couponApplied && (
              <div className="mb-4 p-3 bg-red rounded-lg">
                <p className="text-body2 text-white">
                  <strong>Required:</strong> Please go back and apply the "FREE" coupon code.
                </p>
              </div>
            )}
          </div>
        </div>
      </form>

      {/* Payment methods */}
      <div className="max-w-7xl flex justify-center">
        {/* Image of payment methods on mobile */}
        <img
          src="/imgs/home/payment/payment_mobile.png"
          alt="Payment Methods"
          className="max-w-[300px] md:hidden"
        />
        {/* Image of payment methods on desktop */}
        <img
          src="/imgs/home/payment/payment_desktop.png"
          alt="Payment Methods"
          className="hidden md:block max-w-[500px]"
        />
      </div>

    </div>
    </>
  );
};

export default Checkout;


