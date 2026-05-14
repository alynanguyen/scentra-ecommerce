import { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { ordersAPI, reviewsAPI } from '../../services/api';
import ReviewForm from '../reviews/ReviewForm';
import { Link as RouterLink } from 'react-router-dom';
import { getImageUrl, placeholderDataUri } from '../../utils/imageUtils';
import LoadingSpinner from '../common/LoadingSpinner';
import StatusBadge from '../common/StatusBadge';
import Alert from '../common/Alert';
import Button from '../common/Button';
import MaterialIcon from '../common/MaterialIcon';

const OrderDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [message, setMessage] = useState('');
  const [productReviews, setProductReviews] = useState({}); // { productId: review }

  const navigate = useNavigate();

  const handleBack = () => {
    try {
      navigate('/account?tab=orders');
    } catch (err) {
      navigate('/orders');
    }
  };

  useEffect(() => {
    loadOrder();
    // Show success message if coming from checkout
    if (location.state?.success) {
      setMessage(location.state.message || 'Order placed successfully!');
      setTimeout(() => setMessage(''), 5000);
    }
  }, [id, location.state]);

  useEffect(() => {
    // Load existing reviews for delivered orders
    if (order && order.orderStatus === 'delivered' && order.items) {
      loadProductReviews();
    }
  }, [order, id]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getOrder(id);
      setOrder(response.data.data);
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProductReviews = async () => {
    if (!order || order.orderStatus !== 'delivered') return;

    const reviews = {};
    // Get unique product IDs (in case same product is ordered in different volumes)
    const uniqueProductIds = [...new Set(order.items.map(item => {
      const productId = typeof item.product === 'object' && item.product !== null
        ? String(item.product._id)
        : String(item.product);
      return productId;
    }))];

    for (const productId of uniqueProductIds) {
      try {
        const response = await reviewsAPI.getUserReview(id, productId);
        if (response.data.success && response.data.data) {
          reviews[productId] = response.data.data;
        }
      } catch (error) {
        // Silently fail - review might not exist yet
        console.error(`Error loading review for product:`, error);
      }
    }
    setProductReviews(reviews);
  };

  const handleReviewSubmitted = (reviewData) => {
    const productId = reviewData.product;
    setProductReviews(prev => ({
      ...prev,
      [productId]: reviewData
    }));
  };

  const handleReviewUpdated = (reviewData) => {
    const productId = reviewData.product;
    setProductReviews(prev => ({
      ...prev,
      [productId]: reviewData
    }));
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    setCancelling(true);
    setMessage('');
    try {
      const response = await ordersAPI.cancelOrder(id);
      if (response.data.success) {
        setMessage('Order cancelled successfully');
        await loadOrder(); // Reload order to show updated status
        // Trigger event to update Header unread notification count
        window.dispatchEvent(new Event('notificationUpdated'));
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const canCancel = order?.orderStatus === 'processing';
  const cannotModify = order?.orderStatus === 'shipped' || order?.orderStatus === 'delivered' || order?.orderStatus === 'confirmed';

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-gray-500">Order not found</p>
      </div>
    );
  }

  const groupedItems = (() => {
    if (!order?.items) return {};

    const grouped = {};

    order.items.forEach((item) => {
      const productId =
        typeof item.product === 'object' && item.product !== null
          ? String(item.product._id)
          : String(item.product);

      if (!grouped[productId]) {
        grouped[productId] = {
          productId,
          items: [],
          productImagePath:
            typeof item.product === 'object' && item.product !== null
              ? item.product.image_path
              : null,
          productName: item.name,
        };
      }

      grouped[productId].items.push(item);
    });

    return grouped;
  })();

  const getTrackingStep = (status) => {
    switch (status) {
      case 'placed': return 0;
      case 'processing': return 1;
      case 'shipped': return 2;
      case 'delivered': return 3;
      default: return 0;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* <Link to="/orders" className="text-indigo-600 hover:text-indigo-700 mb-4 inline-block">
        ← Back to Orders
      </Link> */}

      <Button onClick={handleBack} variant="text" size="sm">
        <MaterialIcon icon="arrow_back" size={20} />
        Back to Orders
      </Button>

      <div className="flex flex-col gap-layout-normal px-2 py-6 mb-6">
        <div className="flex items-start gap-6 md:gap-10 ">
          <div className="flex flex-col gap-layout-xxs">
            <h1 className="text-heading3 font-bold">Order #{order.orderNumber}</h1>
            <p className="text-caption text-gray-500">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-GB')}
            </p>
          </div>

          <StatusBadge status={order.orderStatus} className="mt-1" />
        </div>
        <div className="">

          {message && (
            <Alert
              type={message.includes('success') || message.includes('placed') ? 'success' : 'error'}
              message={message}
              className="mt-2"
            />
          )}
          {canCancel && (
            <Button
              onClick={handleCancelOrder}
              disabled={cancelling}
              variant="danger"
              size="sm"
              className="mt-2"
            >
              {cancelling ? 'Cancelling...' : 'Cancel Order'}
            </Button>
          )}
          {cannotModify && (
            <p className="mt-2 text-body2 text-gray-600">
              This order cannot be modified as it has been {order.orderStatus}.
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 ">

        {/* LEFT SIDE */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* ========================= */}
          {/* REVIEW SECTION (DELIVERED ONLY) */}
          {/* ========================= */}
          {order.orderStatus === 'delivered' && (
            <div className="p-layout-normal border border-gray-500 flex flex-col gap-layout-lg">
              <div className="text-body1 font-semibold font-display pb-layout-sm border-b border-gray-500">Review Items</div>

              <div className="flex flex-col gap-6">

                {Object.values(groupedItems).map((group) => {
                  const imageUrl = getImageUrl(group.productImagePath);

                  return (
                    <div
                      key={group.productId}
                      className="border-b border-gray-500 pb-layout-xl last:border-0 flex flex-col gap-layout-sm"
                    >

                      {/* Product Header */}
                      <div className="flex items-center gap-layout-xs mb-4">

                        {/* Product Image */}
                        <div className="w-[56px] h-[56px] flex-shrink-0 overflow-hidden rounded-lg bg-white">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={group.productName}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                try {
                                  e.target.onerror = null;
                                } catch (err) {}

                                e.target.src = placeholderDataUri(56, 56, 'Perfume');
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                              <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Product Name and Quantity */}
                        <div>
                          <p className="text-body1 font-medium mb-1">
                          {group.productName}
                          </p>
                          {group.items.map((item, i) => (
                            <p key={i} className="text-caption text-gray-500">
                              {item.volume ? `${item.volume}ml` : 'Standard'} • {item.quantity>1 ? `${item.quantity} items` : `${item.quantity} item`}
                            </p>
                          ))}
                        </div>


                      </div>

                      {/* Review Form */}
                      <ReviewForm
                        productId={group.productId}
                        orderId={id}
                        productName={group.productName}
                        existingReview={productReviews[group.productId]}
                        onReviewSubmitted={handleReviewSubmitted}
                        onReviewUpdated={handleReviewUpdated}
                      />

                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================= */}
          {/* ORDER SUMMARY (WITH ITEMS) */}
          {/* ========================= */}
          <div className="border border-gray-500 flex flex-col gap-layout-lg p-layout-normal">
            <div className="text-body1 font-display font-semibold pb-layout-sm border-b border-gray-500">Order Summary</div>

            {/* ITEMS */}

            <div className="flex flex-col gap-layout-normal">
              {Object.values(groupedItems).map((group) => {
                const imageUrl = getImageUrl(group.productImagePath);

                return group.items.map((item, i) => {
                  const itemTotal = item.price * item.quantity;

                  return (
                    <div
                      key={`${group.productId}-${item.volume}-${i}`}
                      className="flex items-center gap-layout-sm border-b border-gray-500 pb-4 last:border-0 last:pb-0"
                    >

                      {/* IMAGE */}
                      <div className="w-[40px] h-[40px] md:w-[60px] md:h-[60px] flex-shrink-0">
                        <img
                          src={imageUrl}
                          alt={group.productName}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* INFO */}
                      <div className="flex-1">
                        <p className="text-body2 font-medium mb-1">
                          {group.productName} - {item.volume ? `${item.volume}ml` : 'Standard'}
                        </p>

                        <p className="text-caption text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      {/* PRICE */}
                      <div className="text-body2 font-semibold">
                        €{itemTotal.toFixed(2)}
                      </div>

                    </div>
                  );
                });
              })}
            </div>

            {/* TOTAL */}
            <div className="border-t border-gray-500 pt-4 flex flex-col gap-layout-xs">
              <div className="flex justify-between text-caption">
                <span>Subtotal</span>
                <span>€{order.totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-caption">
                <span>Shipping</span>
                <span>Free</span>
              </div>

              <div className="flex justify-between text-body2 font-semibold mt-2 pt-6 border-t border-gray-500">
                <span>Total</span>
                <span>€{order.totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* PAYMENT */}
            <div className="border-t border-gray-500 pt-4">
              <p className="text-caption text-gray-500">
                {/* Payment: {order.paymentInfo.method} */}
                Payment: Card
              </p>

              {order.paymentInfo.demo && (
                <p className="text-caption mt-2">
                  Demo transaction – no real payment processed
                </p>
              )}
            </div>
          </div>

          {/* ========================= */}
          {/* DELIVERY INFO */}
          {/* ========================= */}
          <div className="border border-gray-500 p-layout-normal flex flex-col gap-layout-lg">
            <div className="text-body1 font-display font-semibold pb-layout-sm border-b border-gray-500">Delivery Information</div>

            <div className="text-body2 flex gap-layout-normal">
              <div className="flex flex-col gap-layout-normal">
                <p>Customer Name</p>
                <p>Phone Number</p>
                <p>Address</p>
              </div>

              <div className="flex flex-col gap-layout-normal font-medium">
                <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                <p>{order.shippingAddress.phoneNumber}</p>
                <div>
                  {order.shippingAddress.apartment && (
                    <p>{order.shippingAddress.apartment}</p>
                  )}
                  <p>{order.shippingAddress.street}</p>
                  <p>
                      {order.shippingAddress.city}, {order.shippingAddress.zipCode}
                    </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ========================= */}
          {/* TRACKING */}
          {/* ========================= */}
          <div className="border border-gray-500 p-layout-normal flex flex-col gap-layout-lg">
            <h2 className="text-body1 font-display font-semibold pb-layout-sm border-b border-gray-500">Tracking History</h2>

            <div className="flex flex-col">
              {[
                {
                  key: 'placed',
                  label: 'Order Placed',
                  description: 'Your order has been successfully created.',
                },
                {
                  key: 'processing',
                  label: 'Processing',
                  description: 'We are preparing and packing your items.',
                },
                {
                  key: 'shipped',
                  label: 'Shipped',
                  description: 'Your package is on the way to you.',
                },
                {
                  key: 'delivered',
                  label: 'Delivered',
                  description: 'Your order has been delivered successfully.',
                },
              ].map((step, index) => {
                const currentTrackingStep = getTrackingStep(order.orderStatus);

                const isPassed = currentTrackingStep > index;
                const isCurrent = currentTrackingStep === index;
                const isUpcoming = currentTrackingStep < index;

                return (
                  <div
                    key={step.key}
                    className="flex items-start gap-layout-normal"
                  >

                    {/* DOT + LINE */}
                    <div className="flex flex-col items-center">

                      {/* DOT */}
                      <div
                        className={`
                          relative w-3 h-3 rounded-full transition-all duration-500
                          ${
                            isPassed || isCurrent
                              ? 'bg-black'
                              : 'bg-gray-300'
                          }
                        `}
                      >

                        {/* pulse animation for current step */}
                        {isCurrent && (
                          <div className="absolute inset-0 rounded-full bg-black animate-ping opacity-20" />
                        )}
                      </div>

                      {/* LINE */}
                      {index !== 3 && (
                        <div className="relative w-[1px] h-14 md:h-20 overflow-hidden">

                          {/* background */}
                          <div className="absolute inset-0 bg-gray-300" />

                          {/* full black if passed */}
                          {isPassed && (
                            <div className="absolute inset-0 bg-black" />
                          )}

                          {/* half progress if current */}
                          {isCurrent && (
                            <div className="absolute top-0 left-0 w-full h-1/2 bg-black" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* TEXT */}
                    <div className=" mt-[-4px]">
                      <p
                        className={`
                          text-body2 font-medium transition-colors duration-300
                          ${
                            isPassed || isCurrent
                              ? 'text-black'
                              : 'text-gray-400'
                          }
                        `}
                      >
                        {step.label}
                      </p>

                      <p
                        className={`
                          text-caption mt-1 max-w-[260px]
                          ${
                            isPassed || isCurrent
                              ? 'text-gray-600'
                              : 'text-gray-400'
                          }
                        `}
                      >
                        {step.description}
                      </p>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* ========================= */}
        {/* RIGHT SIDE */}
        {/* ========================= */}
        <div className="lg:col-span-1">
          <div className="px-layout-normal sticky top-4">

            <h2 className="text-body1 font-display font-semibold mb-4">Need help? Contact us 24/7</h2>

            <div className="text-body2 flex flex-col gap-layout-sm">
              <p>
                In case you need any help relating to your order, please contact us via email.
                We will reply as soon as possible during working hours (9AM-17PM, Mon-Fri).
              </p>
              <p>Note: It might take 1-2 business days for us to reply to your email.</p>
              <p>
                Contact our support team at:
              </p>
              <span className="font-medium mt-[-10px]">
                support@scentra.com
              </span>
            </div>


            {/* TRACKING NUMBER */}
            {order.trackingNumber && (
              <div className="mt-6 border-t border-gray-500 pt-4">
                <p className="text-caption text-gray-500">Tracking Number</p>
                <p className="text-body2">{order.trackingNumber}</p>
              </div>
            )}

          </div>
        </div>
      </div>

    </div>
  );
};

export default OrderDetail;

