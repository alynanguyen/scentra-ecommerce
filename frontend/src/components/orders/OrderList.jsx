import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ordersAPI } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';
import MaterialIcon from '../common/MaterialIcon';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getOrders();
      setOrders(response.data.data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-heading2 font-bold font-display mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-body1 mb-4">You have no orders yet</p>
          <Link to="/products">
            <Button className="mx-auto">Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-layout-lg">
          {orders.map((order) => (
            <Link
              key={order._id}
              to={`/orders/${order._id}`}
              className="block bg-secondary rounded-xl px-layout-normal py-layout-sm hover:opacity-75 transition-colors"
            >
              <div className="flex flex-col gap-layout-xs">

                {/* Top row */}
                <div className="flex items-center justify-between gap-layout-xs">
                  <h3 className="text-body2 font-medium truncate">
                    Order #{order.orderNumber}
                  </h3>

                  {/* Use your existing StatusBadge instead of manual styling */}
                  <StatusBadge status={order.orderStatus} size="sm" />
                </div>

                {/* Bottom row */}
                <div className="flex items-end justify-between">

                  <div className="flex flex-col gap-layout-xxs">
                    <p className="text-caption text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} item(s)
                    </p>

                    <p className="text-body2 font-semibold">
                      ${order.totalPrice.toFixed(2)}
                    </p>
                  </div>

                  <Button size="sm" variant="text" className="px-0">
                    Details
                    <MaterialIcon icon="arrow_forward" size={20} />
                  </Button>

                </div>

              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderList;

