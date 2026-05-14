import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productsAPI, reviewsAPI } from '../../services/api';
import MaterialIcon from '../common/MaterialIcon';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { getImageUrl, placeholderDataUri } from '../../utils/imageUtils';
import ProductCard from './ProductCard';
import LoadingSpinner from '../common/LoadingSpinner';
import Alert from '../common/Alert';
import Button from '../common/Button';
import QuantityInput from '../common/QuantityInput';
import ToggleContent from './ToggleContent';

// Helper function to convert note name to image file name
// "Orange Blossom" -> "orange_blossom.png"
// "Ylang-ylang" -> "ylang-ylang.png"
const getNoteImagePath = (noteName) => {
  if (!noteName) return null;
  // Convert to lowercase, replace spaces with underscores, keep hyphens
  const imageName = noteName.toLowerCase().replace(/\s+/g, '_');
  return `imgs/notes/${imageName}.png`;
};

// Get the full URL for a note image
const getNoteImageUrl = (noteName) => {
  const imagePath = getNoteImagePath(noteName);
  if (!imagePath) return null;

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const baseUrl = apiUrl.replace('/api', '');
  return `${baseUrl}/${imagePath}`;
};

// Get color for season pill
const getSeasonColor = (season) => {
  const seasonColors = {
    'Spring': 'bg-season-spring text-black',
    'Summer': 'bg-season-summer text-black',
    'Autumn': 'bg-season-autumn text-black',
    'Fall': 'bg-season-autumn text-black', // Fall is same as Autumn
    'Winter': 'bg-season-winter text-black',
    'All-year': 'bg-season-allyear text-black',
    'All Year': 'bg-season-allyear text-black', // All Year is same as All-year
  };
  return seasonColors[season] || 'bg-gray-200 text-gray-800';
};

// Accord categories mapping
const accordCategories = {
  "Floral": [
    "Floral",
    "White Floral",
    "Rose",
    "Jasmine",
    "Tuberose",
    "Fig",
    "Chypre Floral",
    "Oriental Floral"
  ],
  "Fruity & Sweet": [
    "Fruity",
    "Sweet",
    "Vanilla",
    "Coconut",
    "Honey",
    "Gourmand",
    "Sparkling",
    "Oriental Fruity"
  ],
  "Woody & Resinous": [
    "Woody",
    "Aromatic Woody",
    "Resinous",
    "Balsamic",
    "Amber",
    "Patchouli",
    "Vetiver",
    "Oud",
    "Incense",
    "Oriental Woody"
  ],
  "Spicy & Warm": [
    "Spicy",
    "Warm",
    "Tobacco",
    "Leather",
    "Smoky",
    "Boozy"
  ],
  "Fresh & Clean": [
    "Fresh",
    "Citrus",
    "Clean",
    "Minimal",
    "Sparkling"
  ],
  "Green & Earthy": [
    "Green",
    "Herbal",
    "Earthy",
    "Dry",
    "Tea"
  ],
  "Aquatic & Marine": [
    "Aquatic",
    "Marine",
    "Salty"
  ],
  "Musky & Powdery": [
    "Musky",
    "Powdery",
    "Animalic"
  ],
  "Oriental & Exotic": [
    "Chypre",
    "Metallic"
  ]
};

// Category colors
const categoryColors = {
  "Floral": 'bg-accord-floral text-black',
  "Fruity & Sweet": 'bg-accord-fruity text-black',
  "Woody & Resinous": 'bg-accord-woody text-black',
  "Spicy & Warm": 'bg-accord-spicy text-black',
  "Fresh & Clean": 'bg-accord-fresh text-black',
  "Green & Earthy": 'bg-accord-green text-black',
  "Aquatic & Marine": 'bg-accord-aquatic text-black',
  "Musky & Powdery": 'bg-accord-musky text-black',
  "Oriental & Exotic": 'bg-accord-oriental text-black'
};

// Get color for accord pill based on category
const getAccordColor = (accord) => {
  // Find which category this accord belongs to
  for (const [category, accords] of Object.entries(accordCategories)) {
    if (accords.includes(accord)) {
      return categoryColors[category];
    }
  }
  // Default color if accord not found in any category
  return 'bg-gray-200 text-gray-800';
};

// Longevity is stored in min and max hours, we want to convert it to a user-friendly text
// Check if max < 4 -> "Short-lasting (0-4 hours)", if max < 8 -> "Moderate (4-8 hours)", if max >= 8 -> "Long-lasting (8+ hours)"
const getLongevityText = (longevity) => {
  if (!longevity?.max) return 'N/A';

  if (longevity.max < 4) {
    return `Short-lasting (${longevity.min} - ${longevity.max} hours)`;
  } else if (longevity.max < 8) {
    return `Moderate (${longevity.min} - ${longevity.max} hours)`;
  } else {
    return `Long-lasting (${longevity.min} - ${longevity.max} hours)`;
  }
};

// Reusable Info Tooltip
const InfoTooltip = ({ text }) => {
  return (
    <div className="relative group inline-flex items-center ml-1">
      {/* Info Icon */}
      <MaterialIcon icon="info" size={16} className="text-gray-500 hover:text-gray-700" />

      {/* Tooltip */}
      <div className="absolute left-20 top-full z-20 mt-2 -translate-x-1/2 whitespace-normal w-48 rounded-lg bg-gray-50 text-black text-caption px-3 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200 shadow-lg">
        {text}
      </div>
    </div>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [selectedVolume, setSelectedVolume] = useState(null);
  const [suitabilityScore, setSuitabilityScore] = useState(null);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [addingToCart, setAddingToCart] = useState(false);
  const [message, setMessage] = useState('');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewsPage, setReviewsPage] = useState(1);
  const [reviewsTotalPages, setReviewsTotalPages] = useState(1);

  const loadReviews = async () => {
    if (!id) return;
    try {
      setLoadingReviews(true);
      const response = await reviewsAPI.getProductReviews(id, { page: reviewsPage, limit: 10 });
      if (response.data.success) {
        setReviews(response.data.data);
        setReviewsTotalPages(response.data.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadProduct();
      loadReviews();
    }
  }, [id, reviewsPage]);

  useEffect(() => {
    if (product) {
      loadRelatedProducts();
      if (isAuthenticated && product.stock === 0) {
        checkSubscription();
      } else if (product.stock > 0) {
        setIsSubscribed(false); // Reset subscription state when product is in stock
      }
    }
  }, [product, isAuthenticated]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getProduct(id);
      setProduct(response.data.data);
      setSuitabilityScore(response.data.suitabilityScore);
      if (response.data.data.price && response.data.data.price.length > 0) {
        setSelectedPrice(response.data.data.price[0]);
        setSelectedVolume(response.data.data.volume?.[0] || null);
      }
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    setAddingToCart(true);
    setMessage('');

    // Find the index of the selected price in the price array
    let priceIndex = 0;
    if (product.price && product.price.length > 1) {
      priceIndex = product.price.findIndex(p => p === selectedPrice);
      if (priceIndex === -1) priceIndex = 0;
    }

    const result = await addToCart(id, quantity, priceIndex);
    if (result.success) {
      setMessage('Added to cart successfully!');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(result.message || 'Failed to add to cart');
    }
    setAddingToCart(false);
  };

  const handleBuyNow = async () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
      return;
    }

    setAddingToCart(true);
    setMessage('');

    // Find the index of the selected price in the price array
    let priceIndex = 0;
    if (product.price && product.price.length > 1) {
      priceIndex = product.price.findIndex(p => p === selectedPrice);
      if (priceIndex === -1) priceIndex = 0;
    }

    const result = await addToCart(id, quantity, priceIndex);
    if (result.success) {
      // Navigate to checkout
      navigate('/checkout');
    } else {
      setMessage(result.message || 'Failed to add to cart');
      setAddingToCart(false);
    }
  };

  const checkSubscription = async () => {
    try {
      const response = await productsAPI.checkStockSubscription(id);
      setIsSubscribed(response.data.subscribed || false);
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const handleSubscribeStock = async () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=' + window.location.pathname);
      return;
    }

    try {
      setSubscribing(true);
      if (isSubscribed) {
        await productsAPI.unsubscribeStockNotification(id);
        setIsSubscribed(false);
        setMessage('Unsubscribed from stock notifications');
      } else {
        await productsAPI.subscribeStockNotification(id);
        setIsSubscribed(true);
        setMessage('You will be notified when this product is back in stock');
      }
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update subscription');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setSubscribing(false);
    }
  };

  const loadRelatedProducts = async () => {
    if (!product) return;

    try {
      setLoadingRelated(true);
      // Try to fetch products from the same brand first
      const params = {
        brand: product.brand,
        limit: 4,
      };

      const response = await productsAPI.getProducts(params);
      let products = response.data.data || [];

      // Filter out the current product
      products = products.filter(p => p._id !== product._id);

      // If we don't have enough products from the same brand, try same gender or type
      if (products.length < 4 && product.gender && product.gender.length > 0) {
        const genderParams = {
          gender: product.gender[0],
          limit: 8,
        };
        const genderResponse = await productsAPI.getProducts(genderParams);
        const genderProducts = (genderResponse.data.data || [])
          .filter(p => p._id !== product._id && !products.find(existing => existing._id === p._id));
        products = [...products, ...genderProducts].slice(0, 4);
      }

      // If still not enough, try same type
      if (products.length < 4 && product.type) {
        const typeParams = {
          type: product.type,
          limit: 8,
        };
        const typeResponse = await productsAPI.getProducts(typeParams);
        const typeProducts = (typeResponse.data.data || [])
          .filter(p => p._id !== product._id && !products.find(existing => existing._id === p._id));
        products = [...products, ...typeProducts].slice(0, 4);
      }

      setRelatedProducts(products.slice(0, 4));
    } catch (error) {
      console.error('Error loading related products:', error);
      setRelatedProducts([]);
    } finally {
      setLoadingRelated(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-gray-500">Product not found</p>
      </div>
    );
  }

  const minPrice = product.price && product.price.length > 0
    ? Math.min(...product.price)
    : 0;
  const maxPrice = product.price && product.price.length > 0
    ? Math.max(...product.price)
    : 0;

  const score = parseFloat(suitabilityScore); // "95%" → 95

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image */}
        <div className="aspect-square w-full overflow-hidden bg-secondary rounded-lg flex items-center justify-center p-4">
          {getImageUrl(product.image_path) ? (
            <img
              src={getImageUrl(product.image_path)}
              alt={product.name}
              className="h-full w-full object-contain drop-shadow-lg"
              onError={(e) => {
                try { e.target.onerror = null; } catch (err) {}
                e.target.src = placeholderDataUri(600, 600, 'Perfume');
              }}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-400">
              <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex justify-between mb-4">
            {/* Brand Name - Clickable */}
            {product.brand && (
              <Link
                to={`/products?brand=${encodeURIComponent(product.brand)}`}
                className="text-body2 underline text-gray-800 hover:text-gray-600 inline-block"
              >
                {product.brand}
              </Link>
            )}

            {/* Type of Perfume */}
            {product.type && (
              <p className="text-body2 text-gray-800">{product.type}</p>
            )}
          </div>

          <div className="flex justify-between">
            <div className="flex flex-col gap-layout-normal">
              {/* Perfume Name */}
              <h1 className="text-heading1 font-semibold font-display">{product.name}</h1>

              {/* Rating */}
              {product.reviews > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const rating = product.reviews;
                      const filled = star <= Math.round(rating);
                      return (
                        <MaterialIcon
                          key={star}
                          icon="star"
                          size={20}
                          filled={true}
                          className={filled ? 'text-star' : 'text-gray-300'}
                        />
                      );
                    })}
                  </div>
                  <span className="text-body2">{product.reviews.toFixed(1)}</span>
                  {/* Show review count
                  <span className="text-body2 text-gray-500">
                    {product.reviewCount > 0
                      ? ` (${product.reviewCount})`
                      : ' (0)'}
                  </span> */}
                </div>
              )}
            </div>

            {suitabilityScore && (
              <div className="flex flex-col items-center gap-layout-xs">
                <div className="px-3 py-1 bg-linencloud rounded-full">
                  <p className="text-caption text-gray-800">Match score</p>
                </div>
                <p className="text-number font-bold font-display">{suitabilityScore}</p>
              </div>
            )}
          </div>

          <div className="mb-4">
            <div className="flex gap-layout-xl justify-start items-center">
              <div className="flex flex-col">
                {product.originalPrice && product.originalPrice.length > 0 && (() => {
                  const priceIndex = product.price?.findIndex(p => p === selectedPrice) ?? 0;
                  const originalPrice = product.originalPrice[priceIndex] || product.originalPrice[0];
                  return originalPrice ? (
                    <p className="text-body2 font-display text-gray-400 line-through">
                      €{originalPrice.toFixed(2)}
                    </p>
                  ) : null;
                })()}
                <p className={`text-number font-display font-bold ${product.originalPrice && product.originalPrice.length > 0 ? 'text-red' : 'text-black'}`}>
                  {product.price && product.price.length > 0
                    ? `€${selectedPrice.toFixed(2)}`
                    : 'Price not available'}
                </p>
              </div>

              {product.originalPrice && product.originalPrice.length > 0 && (() => {
                const priceIndex = product.price?.findIndex(p => p === selectedPrice) ?? 0;
                const originalPrice = product.originalPrice[priceIndex] || product.originalPrice[0];
                const currentPrice = selectedPrice;
                const discountPercent = originalPrice && currentPrice
                  ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
                  : 0;
                return discountPercent > 0 ? (
                  <div className="h-fit flex items-center bg-red text-white text-body2 px-3 py-0.5 rounded-2xl">
                    <span>- {discountPercent}%</span>
                  </div>
                ) : null;
              })()}

            </div>


            {/* {product.price && product.price.length > 1 && ( */}
            {product.price.length > 0 && (
              <div className="mt-layout-xl">
                <label className="block text-body2 text-gray-700 mb-layout-sm">
                  Size
                </label>
                <div className="flex gap-layout-lg">
                  {product.price.map((price, index) => {
                    const originalPrice = product.originalPrice?.[index];
                    const isOnSale = originalPrice && originalPrice > price;
                    return (
                      <label className="group flex items-start gap-2 cursor-pointer" key={index}>
                        <input
                          type="radio"
                          name="price"
                          value={price}
                          checked={Number(selectedPrice) === Number(price)}
                          onChange={() => {
                            setSelectedPrice(Number(price));
                            setSelectedVolume(product.volume?.[index] || null);
                          }}
                          className="hidden"
                        />

                        {/* Custom circle */}
                        <div className="mt-1 w-4 h-4 rounded-full border border-black flex items-center justify-center">
                          <div className="w-3 h-3 bg-black rounded-full opacity-0 group-has-[:checked]:opacity-100 transition" />
                        </div>

                        {/* Text */}
                        <span className="flex flex-col gap-1">
                          {product.volume?.[index]
                            ? `${product.volume[index]}ml`
                            : 'Standard'}
                          <span className="text-gray-600 text-caption">
                            €{price.toFixed(2)}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Add to Cart */}
          <div className="pt-6">
            {product.stock === 0 ? (
              <>
                <p className="text-heading2 font-medium mb-4">Out of Stock</p>
                {message && (
                  <div className={`mb-4 p-3 rounded-md ${message.includes('success') || message.includes('notified') || message.includes('Unsubscribed') ? 'bg-success-bg text-success-text' : 'bg-error-bg text-error-text'}`}>
                    {message}
                  </div>
                )}
                <button
                  onClick={handleSubscribeStock}
                  disabled={subscribing}
                  className="w-fit bg-black text-white py-3 px-4 rounded-3xl text-body2 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {subscribing ? 'Processing...' : isSubscribed ? 'Unsubscribe from Stock Notifications' : 'Notify me when it is back in stock'}
                </button>
              </>
            ) : (
              <>
                <div className="flex flex-col mb-4 gap-layout-sm">
                  <label className="text-body2 text-gray-700">Quantity</label>
                  <div className="flex items-center gap-layout-lg">
                    <QuantityInput
                      value={quantity}
                      onChange={setQuantity}
                      min={1}
                      max={product.stock}
                      className="border rounded-full text-center py-1 px-3 gap-2"
                    />
                    <span className=" text-caption">
                      {product.stock > 4 ? 'In stock' : `Only ${product.stock} left`}
                    </span>
                  </div>
                </div>
                {message && (
                  <Alert
                    type={message.includes('success') || message.includes('notified') || message.includes('Unsubscribed') ? 'success' : 'error'}
                    message={message}
                    className="mb-4"
                  />
                )}
                <div className="flex gap-2 md:gap-4 mt-layout-xl">
                  <Button
                    onClick={handleAddToCart}
                    disabled={addingToCart || product.stock === 0}
                    fullWidth
                    size="md"
                    className="flex-1"
                    variant='outline'
                  >
                    {addingToCart ? 'Adding...' : 'Add to cart'}
                    <MaterialIcon icon="shopping_cart" size={24} />
                  </Button>
                  <Button
                    onClick={handleBuyNow}
                    disabled={addingToCart || product.stock === 0}
                    fullWidth
                    size="md"
                    className="flex-1"
                  >
                    {addingToCart ? 'Adding...' : 'Buy Now'}
                    <MaterialIcon icon="arrow_forward" size={24} />
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Description and Product Details - Below the grid */}
      <div className="mt-pdp-gap-btw-sections">
        {/* Description */}
        <ToggleContent title="Description">
          <p className="text-body2 whitespace-pre-line">
            {product.description}
          </p>
        </ToggleContent>

        {/* Match Score */}

        {suitabilityScore && (
          <div className="pt-pdp-gap-btw-sections">
            <ToggleContent title="Match Score">
              <div className="flex flex-col items-start gap-layout-lg">
                <div className="text-number font-bold font-display">{suitabilityScore}</div>
                <div className="text-body2">
                  {score >= 75
                    ? 'This fragrance is highly aligned with your scent profile, making it a strong match for your preferences and overall taste.'
                    : score >= 50
                      ? 'This fragrance shares some characteristics with your scent profile and may suit your preferences, though it may not be your ideal match.'
                      : 'This fragrance differs from your usual scent profile, but it could still be an interesting choice if you are open to exploring something new.'
                  }
                </div>
              </div>
            </ToggleContent>
          </div>
        )}


        {/* Product Details */}
        <div className="pt-pdp-gap-btw-sections">
          <ToggleContent title="Product Details">

            <dl className="grid grid-cols-1 md:grid-cols-3 gap-layout-xl">

              {/* Type */}
              {product.type && (
                <div className="flex flex-col gap-layout-sm">
                  <dt className="text-body2 text-gray-600">Type</dt>
                  <dd className="text-body2">{product.type}</dd>
                </div>
              )}

              {/* Gender */}
              {product.gender?.length > 0 && (
                <div className="flex flex-col gap-layout-sm">
                  <dt className="text-body2 text-gray-600">Gender</dt>
                  <dd className="text-body2">
                    {product.gender.join(', ')}
                  </dd>
                </div>
              )}

              {/* Season */}
              {product.season?.length > 0 && (
                <div className="flex flex-col gap-layout-sm">
                  <dt className="text-body2 text-gray-600">Season</dt>
                  <dd className="text-body2">
                    <div className="flex flex-wrap gap-2">
                      {product.season.map((season, index) => (
                        <span
                          key={index}
                          className={`px-layout-sm py-1 rounded-full text-body2 ${getSeasonColor(season)}`}
                        >
                          {season}
                        </span>
                      ))}
                    </div>
                  </dd>
                </div>
              )}

              {/* Longevity */}
              {product.longevity && (
                <div className="flex flex-col gap-layout-sm">
                  <dt className="text-body2 text-gray-600">
                    Longevity
                    <InfoTooltip text="How long the fragrance typically lasts on the skin after application." />
                  </dt>
                  <dd className="text-body2">
                    {getLongevityText(product.longevity)}
                  </dd>
                </div>
              )}

              {/* Sillage */}
              {product.sillage && (
                <div className="flex flex-col gap-layout-sm">
                  <dt className="text-body2 text-gray-600">
                    Sillage
                    <InfoTooltip text="The scent trail left behind by the perfume as you move." />
                  </dt>
                  <dd className="text-body2">
                    {product.sillage}
                  </dd>
                </div>
              )}

              {/* Accords */}
              {product.accords?.length > 0 && (
                <div className="flex flex-col gap-layout-sm">
                  <dt className="text-body2 text-gray-600">
                    Accords
                    <InfoTooltip text="The main scent notes that make up the fragrance." />
                  </dt>
                  <dd className="text-body2">
                    <div className="flex flex-wrap gap-2 mt-1">
                      {product.accords.map((accord, index) => (
                        <span
                          key={index}
                          className={`px-layout-sm py-1 rounded-full text-body2 ${getAccordColor(accord)}`}
                        >
                          {accord}
                        </span>
                      ))}
                    </div>
                  </dd>
                </div>
              )}

            </dl>


            {product.notes && (
              <div className="mt-pdp-gap-btw-sections">
                <h4 className="text-body1 font-bold font-display mb-layout-lg">Fragrance Notes</h4>
                <div className="flex flex-col md:flex-row md:justify-between">
                  {/* Top Notes */}
                  {product.notes.top_notes && product.notes.top_notes.length > 0 && (
                    <div className="mb-layout-xl">
                      <span className="text-body2 text-gray-600 block mb-layout-normal">Top Notes</span>
                      <div className="flex flex-wrap gap-layout-sm">
                        {product.notes.top_notes.map((note, index) => {
                          const noteImageUrl = getNoteImageUrl(note);
                          return (
                            <div key={index} className="flex flex-col items-center">
                              {noteImageUrl && (
                                <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mb-1">
                                  <img
                                    src={noteImageUrl}
                                    alt={note}
                                    className="w-full h-full object-contain p-2"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      const fallback = e.target.nextSibling;
                                      if (fallback) fallback.style.display = 'flex';
                                    }}
                                  />
                                  <div className="hidden items-center justify-center text-body2 p-2">
                                    {note.charAt(0).toUpperCase()}
                                  </div>
                                </div>
                              )}
                              <span className="text-body2 text-center max-w-[80px]">{note}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Middle Notes */}
                  {product.notes.middle_notes && product.notes.middle_notes.length > 0 && (
                    <div className="mb-layout-xl">
                      <span className="text-body2 text-gray-600 block mb-layout-normal">Middle Notes</span>
                      <div className="flex flex-wrap gap-layout-sm">
                        {product.notes.middle_notes.map((note, index) => {
                          const noteImageUrl = getNoteImageUrl(note);
                          return (
                            <div key={index} className="flex flex-col items-center">
                              {noteImageUrl && (
                                <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mb-1">
                                  <img
                                    src={noteImageUrl}
                                    alt={note}
                                    className="w-full h-full object-contain p-2"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      const fallback = e.target.nextSibling;
                                      if (fallback) fallback.style.display = 'flex';
                                    }}
                                  />
                                  <div className="hidden items-center justify-center text-body2 p-2">
                                    {note.charAt(0).toUpperCase()}
                                  </div>
                                </div>
                              )}
                              <span className="text-body2 text-center max-w-[80px]">{note}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                    {/* Base Notes */}
                    {product.notes.base_notes && product.notes.base_notes.length > 0 && (
                      <div className="mb-layout-xl">
                        <span className="text-body2 text-gray-600 block mb-layout-normal">Base Notes</span>
                        <div className="flex flex-wrap gap-layout-sm">
                          {product.notes.base_notes.map((note, index) => {
                            const noteImageUrl = getNoteImageUrl(note);
                            return (
                              <div key={index} className="flex flex-col items-center">
                                {noteImageUrl && (
                                  <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mb-1">
                                    <img
                                      src={noteImageUrl}
                                      alt={note}
                                      className="w-full h-full object-contain p-2"
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                        const fallback = e.target.nextSibling;
                                        if (fallback) fallback.style.display = 'flex';
                                      }}
                                    />
                                    <div className="hidden items-center justify-center text-body2 p-2">
                                      {note.charAt(0).toUpperCase()}
                                    </div>
                                  </div>
                                )}
                                <span className="text-body2 text-center max-w-[80px]">{note}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                  )}
                </div>
              </div>
            )}
          </ToggleContent>
        </div>

        {/* Reviews Section */}
        <div className="mt-pdp-gap-btw-sections">
          <ToggleContent title={`Reviews (${product.reviews > 0 ? product.reviews.toFixed(1) : '0'})`}>
            {loadingReviews ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
              ) : reviews.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-body2">No reviews yet. The number shown on the title is the perfume's rating from the Fragrantica website.</p>
              </div>
              ) : (
              <>
                <div className="space-y-6 mb-layout-sm">
                  {reviews.map((review) => (
                    <div key={review._id} className="border-b border-gray-200 pb-layout-sm last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-body2">
                            {review.user?.name || 'Anonymous'}
                          </span>

                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <MaterialIcon
                                key={star}
                                icon="star"
                                size={24}
                                filled={true}
                                className={
                                  star <= review.rating
                                    ? 'text-star'
                                    : 'text-gray-300'
                                }
                              />
                            ))}
                          </div>

                        </div>
                        <span className="text-caption text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="text-body2 mt-layout-sm line-height-paragraph-line-height italic">"{review.comment}"</p>
                      )}
                    </div>
                  ))}
                </div>
                {reviewsTotalPages > 1 && (
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => setReviewsPage(prev => Math.max(1, prev - 1))}
                      disabled={reviewsPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 text-gray-700">
                      Page {reviewsPage} of {reviewsTotalPages}
                    </span>
                    <button
                      onClick={() => setReviewsPage(prev => Math.min(reviewsTotalPages, prev + 1))}
                      disabled={reviewsPage === reviewsTotalPages}
                      className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </ToggleContent>
        </div>

        {/* Delivery and Returns */}
        <div className="mt-pdp-gap-btw-sections">
          <ToggleContent title="Delivery and Returns">
            <div className="space-y-6">
              <div>
                <h4 className="text-body2 font-medium mb-layout-sm">Shipping Information</h4>
                <ul className="space-y-2 text-body2 pl-2">
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-black"></span>
                    <span>Free shipping on orders over €90</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-black"></span>
                    <span>Standard shipping: 3-5 business days</span>
                  </li>
                  <li className="flex items-start sm:items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-black"></span>
                    <span>Express shipping: 1-2 business days (additional fee)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-black"></span>
                    <span>Shipping all over Europe</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-body2 font-medium mb-2">Returns Policy</h4>
                <ul className="space-y-2 text-body2 pl-2">
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-black"></span>
                    <span>30-day return policy for unopened items</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-black"></span>
                    <span>Items must be in original packaging</span>
                  </li>
                  <li className="flex items-start sm:items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-black"></span>
                    <span>Return shipping costs are the responsibility of the customer</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-black"></span>
                    <span>Refunds will be processed within 5-7 business days</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-body2 font-medium mb-2">Contact Support</h4>
                <p className="text-body2 line-height-paragraph-line-height">
                  For any questions about delivery or returns, please contact our customer service team: support@scentra.com
                </p>
              </div>
            </div>
          </ToggleContent>
        </div>

        {/* Maybe you will also like */}
        {relatedProducts.length > 0 && (
          <div className="mt-pdp-gap-btw-sections">
            <h3 className="text-heading2 font-display font-bold mb-layout-normal">Maybe you will also like</h3>
            {loadingRelated ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 scrollbar-hide">
                {relatedProducts.map((relatedProduct) => (
                  <div
                    key={relatedProduct._id}
                    className="flex-shrink-0 snap-start"
                  >
                    <ProductCard product={relatedProduct} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;

