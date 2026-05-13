import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { getImageUrl, placeholderDataUri } from '../../utils/imageUtils';
import QuantityInput from '../common/QuantityInput';
import MaterialIcon from '../common/MaterialIcon';

const CartItem = ({ item }) => {
  const { updateCartItem, removeFromCart } = useCart();
  const [quantity, setQuantity] = useState(item?.quantity || 1);
  const [updating, setUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;
    if (!item) return;
    setUpdating(true);
    setQuantity(newQuantity);
    try {
      // Use _id if available, otherwise use tempId or index
      const itemId = item._id || item.tempId || item.product?._id;
      await updateCartItem(itemId, newQuantity);
    } catch (err) {
      console.error('updateCartItem failed', err);
    }
    setUpdating(false);
  };

  const handleRemove = async () => {
    if (!item) return;
    setUpdating(true);
    try {
      // Use _id if available, otherwise use tempId or index
      const itemId = item._id || item.tempId || item.product?._id;
      await removeFromCart(itemId);
    } catch (err) {
      console.error('removeFromCart failed', err);
    }
    setUpdating(false);
  };

  const product = item?.product || {};
  // Handle price - it might be a number or an array
  const itemPrice = item.price || 0;
  const itemVolume = item.volume || 0;
  const itemTotal = itemPrice * quantity;


  // If product data is missing, avoid rendering the item (prevents crashes)
  if (!item || !item.product) {
    console.error('Invalid cart item encountered:', item);
    return null;
  }

  return (
    <div className="flex items-start gap-layout-xs py-layout-lg">
      <div className="w-full p-2 flex items-center gap-layout-sm">
        <Link to={`/products/${product._id}`} className="flex-shrink-0">
          <div className="w-[45px] h-[45px] md:w-[70px] md:h-[70px]">
            {getImageUrl(product.image_path) ? (
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src={getImageUrl(product.image_path)}
                  alt={product.name}
                  className="w-full object-contain drop-shadow-lg"
                  onError={(e) => {
                    try { e.target.onerror = null; } catch (err) {}
                    e.target.src = placeholderDataUri(100, 100, 'Perfume');
                  }}
                />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        </Link>

        <div className="flex flex-col w-full">
          <div className="flex flex-col gap-1.5">
            <Link to={`/products/${product._id}`} className="text-body2 font-medium">
              {product.name}
            </Link>
            <p className="text-caption text-gray-600">{product.brand} - {itemVolume}ml</p>

            <div className="w-full flex items-center justify-between">
              <p className="text-body2 font-medium">€{itemTotal.toFixed(2)}</p>

              <QuantityInput
                value={quantity}
                onChange={handleQuantityChange}
                min={1}
                disabled={updating}
              />
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleRemove}
        disabled={updating}
        title="Remove item"
      >
        <MaterialIcon icon="close" size={24} />
      </button>
    </div>
  );
};

export default CartItem;

