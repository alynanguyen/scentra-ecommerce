import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ordersAPI } from '../../services/api';
import Button from '../common/Button';
import MaterialIcon from '../common/MaterialIcon';

const OrdersTab = () => {
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

  const getStatusColor = (status) => {
    const colors = {
      processing: 'bg-processing-bg text-processing-text',
      confirmed: 'bg-confirmed-bg text-confirmed-text',
      shipped: 'bg-shipped-bg text-shipped-text',
      delivered: 'bg-delivered-bg text-delivered-text',
      cancelled: 'bg-cancelled-bg text-cancelled-text',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-layout-lg">
      <h2 className="text-heading3 font-semibold font-display">My Orders</h2>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-body1 mb-6">You have no orders yet</p>
          <Link
            to="/products"
          >
            <Button className="mx-auto">
              Start Shopping
            </Button>
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

                <div className="flex items-center justify-between gap-layout-xs">
                  <h3 className="text-body2 font-medium truncate">
                    Order #{order.orderNumber}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-overline font-medium ${getStatusColor(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus}
                  </span>
                </div>

                <div className="flex items-end justify-between">
                  <div className="flex flex-col gap-layout-xxs">
                    <p className="text-caption text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} item(s)
                    </p>

                    <p className="text-body2 font-semibold">
                      ${order.totalPrice.toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <Button size="sm" variant="text" className="text-caption py-0">
                      Details
                      <MaterialIcon icon="arrow_forward" size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersTab;

