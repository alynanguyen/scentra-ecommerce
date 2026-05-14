import { Link } from 'react-router-dom';
import { getImageUrl, placeholderDataUri } from '../../utils/imageUtils';
import MaterialIcon from '../common/MaterialIcon';

const ProductCard = ({ product }) => {
  // Handle price - can be array, single number, or missing
  let minPrice = 0;
  let maxPrice = 0;
  let minOriginalPrice = 0;
  let maxOriginalPrice = 0;
  let isOnSale = false;

  if (product.price) {
    if (Array.isArray(product.price) && product.price.length > 0) {
      // Filter out any null/undefined values
      const validPrices = product.price.filter(p => p != null && !isNaN(p));
      if (validPrices.length > 0) {
        minPrice = Math.min(...validPrices);
        maxPrice = Math.max(...validPrices);
      }
    } else if (typeof product.price === 'number' && !isNaN(product.price)) {
      minPrice = product.price;
      maxPrice = product.price;
    }
  }

  // Check if product is on sale (has originalPrice)
  if (product.originalPrice) {
    if (Array.isArray(product.originalPrice) && product.originalPrice.length > 0) {
      const validOriginalPrices = product.originalPrice.filter(p => p != null && !isNaN(p));
      if (validOriginalPrices.length > 0) {
        minOriginalPrice = Math.min(...validOriginalPrices);
        maxOriginalPrice = Math.max(...validOriginalPrices);
        isOnSale = true;
      }
    } else if (typeof product.originalPrice === 'number' && !isNaN(product.originalPrice)) {
      minOriginalPrice = product.originalPrice;
      maxOriginalPrice = product.originalPrice;
      isOnSale = true;
    }
  }

  const displayPrice = minPrice > 0
    ? (minPrice === maxPrice
      ? `€${minPrice.toFixed(2)}`
      : `€${minPrice.toFixed(2)} - €${maxPrice.toFixed(2)}`)
    : 'Price not available';

  const displayOriginalPrice = isOnSale && minOriginalPrice > 0
    ? (minOriginalPrice === maxOriginalPrice
      ? `€${minOriginalPrice.toFixed(2)}`
      : `€${minOriginalPrice.toFixed(2)} - €${maxOriginalPrice.toFixed(2)}`)
    : null;

  // Calculate discount percentage
  const discountPercent = isOnSale && minOriginalPrice > 0 && minPrice > 0
    ? Math.round(((minOriginalPrice - minPrice) / minOriginalPrice) * 100)
    : 0;

  const imageUrl = getImageUrl(product.image_path);

  const typeShort = {
    'Eau de Parfum (EDP)': 'EDP',
    'Eau de Toilette (EDT)': 'EDT',
    'Eau de Cologne (EDC)': 'EDC',
    'Parfum': 'Parfum',
    'Perfume Oil': 'Oil',
    'Extrait de Parfum': 'Extrait',
  }

  return (
    <Link
      to={`/products/${product._id}`}
      className="group relative bg-white rounded-lg overflow-hidden p-layout-xxs max-w-[150px] min-[400px]:max-w-[175px] md:max-w-[220px] min-[1200px]:max-w-[270px]"
    >
      <div className="relative aspect-square w-full max-w-[150px] min-[400px]:max-w-[175px] md:max-w-[220px] min-[1200px]:max-w-[270px] overflow-hidden bg-secondary flex items-center justify-center p-4 rounded-xl">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              try { e.target.onerror = null; } catch (err) {}
              e.target.src = placeholderDataUri(400, 400, 'Perfume');
            }}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-400">
            <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        )}

        {isOnSale && discountPercent > 0 && (
          <span className="absolute top-[8px] right-[8px] bg-red text-white text-caption px-2 py-0.5 rounded-xl">
            - {discountPercent}%
          </span>
        )}
      </div>

      <div className="mt-layout-normal max-w-[150px] min-[400px]:max-w-[175px] md:max-w-[220px] min-[1200px]:max-w-[270px]">

        <div className="flex w-full items-center justify-between gap-0.5">
          <h3 className="text-body1 font-heading mb-1 line-clamp-1">
          {product.name}
          </h3>
          <p className="text-caption text-gray-600">{typeShort[product.type] || product.type}</p>
        </div>

        <div className="flex flex-row items-center gap-1">
          <p className="text-caption w-full line-clamp-1">{product.brand}</p>
          {product.reviews > 0 && (
            <div className="flex items-center">
              <span className="text-stargold text-caption">★</span>
              <span className="text-caption ml-1">{product.reviews.toFixed(1)}</span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mt-layout-sm">
          <div className="flex flex-col">
            {isOnSale && displayOriginalPrice && (
              <p className="text-caption font-heading text-gray-400 line-through">
                {displayOriginalPrice}
              </p>
            )}
            <p className={`text-heading3 font-heading font-bold ${minPrice > 0 ? (isOnSale ? 'text-red' : 'text-black') : 'text-gray-400'}`}>
              {displayPrice}
            </p>
          </div>
        </div>
        {product.stock === 0 && (
          <p className="text-body1 font-heading text-gray-400 font-semibold mt-2">Out of stock</p>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;

