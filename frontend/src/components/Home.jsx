import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productsAPI } from '../services/api';
import ProductCard from './products/ProductCard';
import MaterialIcon from './common/MaterialIcon';
import SectionHeader from './common/SectionHeader';

// Import all brand logos using Vite's glob import
const brandLogoModules = import.meta.glob('../assets/imgs/home/brands_logo/*.png', { eager: true });

// Mapping from logo filename (without extension) to brand name in database
const brandLogoMap = {
  'amouage': 'Amouage',
  'by_kilian': 'By Kilian',
  'byredo': 'Byredo',
  'clive_christian': 'Clive Christian',
  'creed': 'Creed',
  'diptyque': 'Diptyque',
  'etat_libre_dorange': 'Etat Libre d\'Orange',
  'francesca_bianchi': 'Francesca Bianchi',
  'frederic_malle': 'Frédéric Malle',
  'gallivant': 'Gallivant',
  'initio_parfums': 'Initio Parfums',
  'juliette_has_a_gun': 'Juliette Has a Gun',
  'le_labo': 'Le Labo',
  'liquides_imaginaires': 'Liquides Imaginaires',
  'm_micallef': 'M. Micallef',
  'maison_francis_kurkdjian': 'Maison Francis Kurkdjian',
  'mancera': 'Mancera',
  'meo_fusciuni': 'Meo Fusciuni',
  'nishane': 'Nishane',
  'ormonde_jayne': 'Ormonde Jayne',
  'parfums_de_marly': 'Parfums de Marly',
  'serge_lutens': 'Serge Lutens',
  'tiziana_terenzi': 'Tiziana Terenzi',
  'zoologist': 'Zoologist'
};

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingNewArrivals, setLoadingNewArrivals] = useState(true);
  const sliderRef = useRef(null);
  const newArrivalsSliderRef = useRef(null);
  const brandsSliderRef = useRef(null);
  const autoSlideIntervalRef = useRef(null);

  // Get all brand logos with proper image paths (defined early for use in useEffect)
  const brandLogos = Object.keys(brandLogoMap).map((logoKey) => {
    const logoPath = `../assets/imgs/home/brands_logo/${logoKey}.png`;
    const imageModule = brandLogoModules[logoPath];
    const imagePath = imageModule?.default || imageModule || '';

    return {
      logoKey,
      brandName: brandLogoMap[logoKey],
      imagePath
    };
  }).filter(brand => brand.imagePath); // Filter out brands without images

  useEffect(() => {
    const loadBestSellers = async () => {
      try {
        setLoading(true);
        const response = await productsAPI.getProducts({ availability: 'bestSeller', limit: 8 });
        setBestSellers(response.data.data || []);
      } catch (error) {
        console.error('Error loading best sellers:', error);
        setBestSellers([]);
      } finally {
        setLoading(false);
      }
    };
    loadBestSellers();
  }, []);

  useEffect(() => {
    const loadNewArrivals = async () => {
      try {
        setLoadingNewArrivals(true);
        // Fetch a larger set of products to randomly select from
        const response = await productsAPI.getProducts({ limit: 50 });
        const allProducts = response.data.data || [];

        // Randomly select 8 products
        const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 8);
        setNewArrivals(selected);
      } catch (error) {
        console.error('Error loading new arrivals:', error);
        setNewArrivals([]);
      } finally {
        setLoadingNewArrivals(false);
      }
    };
    loadNewArrivals();
  }, []);

  // Auto-slide for brand slider
  useEffect(() => {
    if (brandLogos.length > 0 && brandsSliderRef.current) {
      // Clear any existing interval
      if (autoSlideIntervalRef.current) {
        clearInterval(autoSlideIntervalRef.current);
      }

      // Set up auto-slide every 3 seconds
      autoSlideIntervalRef.current = setInterval(() => {
        if (brandsSliderRef.current) {
          const container = brandsSliderRef.current;
          const logoWidth = container.querySelector('.flex-shrink-0')?.offsetWidth || 150;
          const gap = 32;
          const scrollAmount = logoWidth + gap;
          const maxScroll = container.scrollWidth - container.clientWidth;
          const currentScroll = container.scrollLeft;

          // If we've reached the end, scroll back to the beginning
          if (currentScroll + scrollAmount >= maxScroll) {
            container.scrollTo({
              left: 0,
              behavior: 'smooth'
            });
          } else {
            container.scrollBy({
              left: scrollAmount,
              behavior: 'smooth'
            });
          }
        }
      }, 3000); // Auto-slide every 3 seconds
    }

    // Cleanup interval on unmount
    return () => {
      if (autoSlideIntervalRef.current) {
        clearInterval(autoSlideIntervalRef.current);
      }
    };
  }, [brandLogos.length]);

  const scrollSlider = (direction, ref) => {
    if (ref.current) {
      const container = ref.current;
      const cardWidth = container.querySelector('.flex-shrink-0')?.offsetWidth || 320;
      const gap = 24; // gap-6 = 1.5rem = 24px
      const scrollAmount = cardWidth + gap;
      const currentScroll = container.scrollLeft;
      const newScroll = direction === 'next'
        ? currentScroll + scrollAmount
        : currentScroll - scrollAmount;

      container.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      });
    }
  };

  const scrollBrandsSlider = (direction) => {
    if (brandsSliderRef.current) {
      const container = brandsSliderRef.current;
      const logoWidth = container.querySelector('.flex-shrink-0')?.offsetWidth || 150;
      const gap = 32; // gap-8 = 2rem = 32px
      const scrollAmount = logoWidth + gap;
      const currentScroll = container.scrollLeft;
      const newScroll = direction === 'next'
        ? currentScroll + scrollAmount
        : currentScroll - scrollAmount;

      container.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-white via-secondary to-white mb-homepage-gap-btw-sections">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 md:py-24 ">
          {/* Left side with text and buttons, right side with image */}
          <div className=" relative text-left max-w-[350px] md:max-w-[500px] flex flex-col gap-layout-lg z-10">
            <h1 className="text-number font-heading font-bold">
              Discover niche perfumes with up to 30% off
            </h1>
            <p className="text-body2">
              Free shipping on orders over €90
            </p>
            <div className="flex flex-col gap-layout-lg justify-center text-body2">
              <Link
                to="/products"
                className="bg-black text-white flex items-center w-fit px-4 py-1 md:px-5 md:py-2 rounded-3xl hover:bg-gray-800 transition-colors"
              >
                Shop Now
                <MaterialIcon icon="arrow_forward" size={24} className="ml-2 color-white" />
              </Link>
              <Link
                to={isAuthenticated ? "/quiz" : "/login?redirect=/quiz"}
                className="bg-white text-black border border-black flex items-center w-fit px-4 py-1 md:px-5 md:py-2 rounded-3xl hover:bg-gray-100 transition-colors"
              >
                Free quiz - Find your signature scent
                <MaterialIcon icon="arrow_forward" size={24} className="ml-2 color-white" />
              </Link>
            </div>
          </div>
          {/* Image */}
          <div className="absolute left-[20%] top-[40%] md:top-1/2 -translate-y-[35%] pointer-events-none w-full">
            <img
              src="/imgs/home/hero_banner/hero_banner_image.png"
              alt="Hero"
              className="w-full mx-auto mt-12 md:mt-0"
            />
          </div>
        </div>
      </div>

      {/* Best Sellers Section */}
        <div className="max-w-7xl mx-auto px-homepage-margin-x py-homepage-gap-btw-sections">
          <div className="flex items-start justify-between">
            <SectionHeader title="Best Sellers" subtitle="Our most popular fragrances, loved by customers" />
            {!loading && bestSellers.length > 0 && (
              <Link
                to="/products?availability=bestSeller"
                className="flex items-center pt-1 gap-1 whitespace-nowrap text-black hover:text-gray-600 text-body2"
              >
                View all
                <MaterialIcon icon="arrow_forward" size={20} />
              </Link>
            )}
          </div>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
          ) : bestSellers.length > 0 ? (
            <>
              <div className="relative md:px-12">
                {/* Previous Button */}
                {bestSellers.length > 1 && (
                  <button
                    onClick={() => scrollSlider('prev', sliderRef)}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 transition-colors hidden md:block"
                    aria-label="Previous products"
                  >
                    <MaterialIcon icon="chevron_left" size={24} />
                  </button>
                )}

                {/* Slider Container */}
                <div
                  ref={sliderRef}
                  className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4 snap-x snap-mandatory"
                >
                  {bestSellers.map((product) => (
                    <div key={product._id} className="flex-shrink-0 snap-start">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>

                {/* Next Button */}
                {bestSellers.length > 1 && (
                  <button
                    onClick={() => scrollSlider('next', sliderRef)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 hidden md:block"
                    aria-label="Next products"
                  >
                    <MaterialIcon icon="chevron_right" size={24} />
                  </button>
                )}
              </div>

              {/* View All Link */}
              <div className="mt-2 mx-auto flex justify-center">
                <Link
                  to="/products?availability=bestSeller"
                  className=" flex items-center gap-1 w-fit md:hidden text-body2 text-white bg-black px-6 py-1 rounded-3xl hover:bg-gray-800 transition-colors "
                >
                  View All Best Sellers
                  <MaterialIcon icon="arrow_forward" size={24} className="ml-1" />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No best sellers available at the moment.</p>
            </div>
          )}
        </div>

      {/* New Arrivals Section */}
      <div className="max-w-7xl mx-auto px-homepage-margin-x py-homepage-gap-btw-sections">
        <div className="flex items-start justify-between">
          <SectionHeader
            title="New Arrivals"
            subtitle="Discover our latest additions to the collection"
          />

          {!loadingNewArrivals && newArrivals.length > 0 && (
            <Link
              to="/products?sort=newest"
              className="flex items-center gap-1 pt-1 whitespace-nowrap text-black hover:text-gray-600 text-body2"
            >
              View all
              <MaterialIcon icon="arrow_forward" size={20} />
            </Link>
          )}
        </div>

        {loadingNewArrivals ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : newArrivals.length > 0 ? (
          <>
            <div className="relative md:px-12">

              {/* Previous Button */}
              {newArrivals.length > 1 && (
                <button
                  onClick={() => scrollSlider('prev', newArrivalsSliderRef)}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 transition-colors hidden md:block"
                  aria-label="Previous products"
                >
                  <MaterialIcon icon="chevron_left" size={24} />
                </button>
              )}

              {/* Slider Container */}
              <div
                ref={newArrivalsSliderRef}
                className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4 snap-x snap-mandatory"
              >
                {newArrivals.map((product) => (
                  <div key={product._id} className="flex-shrink-0 snap-start">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* Next Button */}
              {newArrivals.length > 1 && (
                <button
                  onClick={() => scrollSlider('next', newArrivalsSliderRef)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 hidden md:block"
                  aria-label="Next products"
                >
                  <MaterialIcon icon="chevron_right" size={24} />
                </button>
              )}
            </div>

            {/* View All Button */}
            <div className="mx-auto flex justify-center">
              <Link
                to="/products?sort=newest"
                className=" flex items-center gap-1 w-fit md:hidden text-body2 text-white bg-black px-6 py-1 rounded-3xl hover:bg-gray-800 transition-colors"
              >
                View All New Arrivals
                <MaterialIcon icon="arrow_forward" size={24} className="ml-1" />
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No new arrivals available at the moment.</p>
          </div>
        )}
      </div>

      {/* Shop by Gender + Discover Scent Profile Section */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row md:gap-homepage-gap-btw-sections px-homepage-margin-x py-homepage-gap-btw-sections">
        {/* Shop by Gender */}
        <div className="w-full md:max-w-[500px] flex-col gap-4">
          <SectionHeader title="Shop by Gender" subtitle="Find the perfect fragrance for you" />
          {/* Gender list */}
          <div className="flex flex-col mt-4">
            <Link
              to="/products?gender=Male"
              className="flex justify-between p-layout-xl border-b text-body2 hover:text-gray-700 transition-colors"
            >
              <span>For Men</span>
              <MaterialIcon icon="arrow_forward" size={20} />
            </Link>
            <Link to="/products?gender=Female" className="flex justify-between p-layout-xl border-b text-body2 hover:text-gray-700 transition-colors">
              <span>For Women</span>
              <MaterialIcon icon="arrow_forward" size={20} />
            </Link>
            <Link to="/products?gender=Unisex" className="flex justify-between p-layout-xl border-b text-body2 hover:text-gray-700 transition-colors">
              <span>For All</span>
              <MaterialIcon icon="arrow_forward" size={20} />
            </Link>
          </div>
        </div>

        {/* Quiz Section */}
        <div className="w-full mt-6 md:mt-0">
          <SectionHeader title="Discover Your Scent Profile" subtitle="With a free 5-minute quiz" />
          <div className="flex flex-col md:flex-row md:justify-between">
            <div className="flex flex-col gap-6 mx-6 my-6">
              <ul className=" list-disc text-body2">
                <li>A personalized scent profile</li>
                <li>Three perfumes recommendations</li>
                <li>See the match score in every product</li>
              </ul>
              <Link
                to={isAuthenticated ? "/quiz" : "/login?redirect=/quiz"}
                className="w-fit hidden md:inline-flex mt-layout-lg items-center px-5 py-2 bg-black text-white rounded-3xl hover:bg-gray-800 transition-colors text-body2"
              >
                Take the Quiz
                <MaterialIcon icon="arrow_forward" size={20} className="ml-1" />
              </Link>
            </div>

            <div className="flex flex-col md:flex-row-reverse gap-4 items-center">
              <img src="/imgs/home/quiz/quiz-img.png" alt="Quiz image" className="h-auto w-[350px] object-cover" />
              <Link
                to={isAuthenticated ? "/quiz" : "/login?redirect=/quiz"}
                className="w-fit mt-layout-lg inline-flex md:hidden items-center px-5 py-2 bg-black text-white rounded-3xl hover:bg-gray-800 transition-colors text-body2"
              >
                Take the Quiz
                <MaterialIcon icon="arrow_forward" size={20} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Slider Section */}
      <div className="max-w-7xl mx-auto px-homepage-margin-x py-homepage-gap-btw-sections">
        <SectionHeader title="Shop by Brand" subtitle="Discover fragrances from top niche perfume brands" />
          <div className="relative px-8 md:px-12 mt-6">
            {/* Previous Button */}
            {brandLogos.length > 1 && (
              <button
                onClick={() => scrollBrandsSlider('prev')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden md:block "
                aria-label="Previous brands"
              >
                <MaterialIcon icon="chevron_left" size={24} className="text-black hover:text-gray-600" />
              </button>
            )}

            {/* Brands Slider Container */}
            <div
              ref={brandsSliderRef}
              className="flex gap-8 overflow-x-auto scrollbar-hide scroll-smooth pb-4 snap-x snap-mandatory"
              onMouseEnter={() => {
                // Pause auto-slide on hover
                if (autoSlideIntervalRef.current) {
                  clearInterval(autoSlideIntervalRef.current);
                }
              }}
              onMouseLeave={() => {
                // Resume auto-slide when mouse leaves
                if (brandLogos.length > 0 && brandsSliderRef.current) {
                  autoSlideIntervalRef.current = setInterval(() => {
                    if (brandsSliderRef.current) {
                      const container = brandsSliderRef.current;
                      const logoWidth = container.querySelector('.flex-shrink-0')?.offsetWidth || 150;
                      const gap = 32;
                      const scrollAmount = logoWidth + gap;
                      const maxScroll = container.scrollWidth - container.clientWidth;
                      const currentScroll = container.scrollLeft;

                      if (currentScroll + scrollAmount >= maxScroll) {
                        container.scrollTo({
                          left: 0,
                          behavior: 'smooth'
                        });
                      } else {
                        container.scrollBy({
                          left: scrollAmount,
                          behavior: 'smooth'
                        });
                      }
                    }
                  }, 3000);
                }
              }}
            >
              {brandLogos.map((brand) => (
                <Link
                  key={brand.logoKey}
                  to={`/products?brand=${encodeURIComponent(brand.brandName)}`}
                  className="flex-shrink-0 snap-start group"
                >
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-lg  p-4 flex items-center justify-center hover:border-gray-300 hover:shadow-md transition-all duration-200">
                    {brand.imagePath ? (
                      <img
                        src={brand.imagePath}
                        alt={brand.brandName}
                        className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-200"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const fallback = e.target.nextSibling;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="hidden items-center justify-center text-gray-400 text-xs text-center p-2">
                      {brand.brandName}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Next Button */}
            {brandLogos.length > 1 && (
              <button
                onClick={() => scrollBrandsSlider('next')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden md:block "
                aria-label="Next brands"
              >
                <MaterialIcon icon="chevron_right" size={24} className="text-black hover:text-gray-600" />
              </button>
            )}
          </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl flex flex-col lg:flex-row gap-9 lg:justify-between mx-auto px-homepage-margin-x py-homepage-gap-btw-sections">
        <div className="relative lg:w-[324px] flex flex-col px-5 py-4 gap-layout-sm bg-secondary rounded-lg">
          <p className="absolute right-[15px] top-[-39px] font-display text-[50px]">01</p>
          <h1 className="font-display font-bold text-heading3">Premium Quality</h1>
          <p className="text-body2 line-height-6">Only the finest fragrances from renowned brands</p>
        </div>
        <div className="relative lg:w-[324px] flex flex-col px-5 py-4 gap-layout-sm bg-secondary rounded-lg">
          <p className="absolute right-[15px] top-[-39px] font-display text-[50px]">02</p>
          <h1 className="font-display font-bold text-heading3">Free Shipping</h1>
          <p className="text-body2 line-height-6">Free shipping on orders over €90. Quick and secure delivery to your doorstep</p>
        </div>
        <div className="relative lg:w-[324px] flex flex-col px-5 py-4 gap-layout-sm bg-secondary rounded-lg">
          <p className="absolute right-[15px] top-[-39px] font-display text-[50px]">03</p>
          <h1 className="font-display font-bold text-heading3">Personalized Recommendations</h1>
          <p className="text-body2 line-height-6">Find your perfect match with our scent quiz</p>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="max-w-7xl flex justify-center mx-auto px-homepage-margin-x py-homepage-gap-btw-sections">
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
  );
};

export default Home;

