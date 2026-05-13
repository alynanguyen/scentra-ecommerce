import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { quizAPI } from '../../services/api';
import { getImageUrl, placeholderDataUri } from '../../utils/imageUtils';
import ProductCard from '../products/ProductCard';
import Button from '../common/Button';
import MaterialIcon from '../common/MaterialIcon';

const ScentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await quizAPI.getProfile();
      setProfile(response.data.data);
    } catch (error) {
      console.error('Error loading profile:', error);
      if (error.response?.status === 404) {
        navigate('/quiz');
      }
    } finally {
      setLoading(false);
    }
  };


  const handleRetakeQuiz = () => {
    navigate('/quiz?retake=true');
  };

  const getFieldLabel = (field) => {
    const labels = {
      gender: 'Gender Preference',
      vibe: 'Vibe or Personality',
      occasion: 'Occasion',
      season: 'Season',
      longevity_category: 'Longevity',
      accords: 'Accords',
      liked_notes: 'Liked Notes',
      disliked_notes: 'Disliked Notes',
      secondary_accords: 'Secondary Accords',
      price: 'Price Range'
    };
    return labels[field] || field;
  };

  const formatValue = (value) => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'object' && value !== null) {
      if (value.label) return value.label;
      if (value.range) return `${value.range[0]} - ${value.range[1]}`;
      return JSON.stringify(value);
    }
    return value;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!profile || !profile.answers) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No profile found. Please complete the quiz.</p>
          <button
            onClick={handleRetakeQuiz}
            className="inline-block bg-black text-white px-6 py-2 rounded-full hover:bg-gray-700"
          >
            Take Quiz
          </button>
        </div>
      </div>
    );
  }

  const { answers } = profile;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <div className="space-y-6">

        {/* PROFILE */}
        <div className="flex flex-col gap-layout-lg">

          <div className="flex items-center justify-between">
            <h1 className="text-heading2 font-display font-bold">
              My Scent Profile
            </h1>

            {/* <button
              onClick={handleRetakeQuiz}
              className="border border-black px-4 py-2 rounded-full text-body2 hover:bg-black hover:text-white transition-colors"
            >
              Re-take Quiz
            </button> */}
            <Button onClick={handleRetakeQuiz} variant="outline" size="sm" >Re-take Quiz</Button>
          </div>

          {/* ANSWERS */}
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-4 rounded-xl px-layout-sm bg-secondary md:[&>*:nth-last-child(-n+2)]:border-none">
            {Object.entries(answers).map(([field, value]) => (
              <div
                key={field}
                className="border-b border-gray-200 py-layout-normal flex flex-col gap-layout-xs last:border-none"
              >
                <h3 className="text-caption font-medium text-gray-800">
                  {getFieldLabel(field)}
                </h3>

                <p className="text-body2">
                  {formatValue(value) || 'Not set'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RECOMMENDATIONS */}
        {profile.recommendations && profile.recommendations.length > 0 ? (
          <div className="mt-homepage-gap-btw-sections py-3">

            <h2 className="text-heading2 font-display font-bold">
              Top 3 Best Matches
            </h2>

            {/* PRODUCTS */}
            <div className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 scrollbar-hide">

              {profile.recommendations
                .filter((rec) => rec.product)
                .map((rec, index) => {

                  const product = rec.product;

                  // KEEPING YOUR EXISTING LOGIC
                  const minPrice =
                    product.price && product.price.length > 0
                      ? Math.min(...product.price)
                      : 0;

                  const maxPrice =
                    product.price && product.price.length > 0
                      ? Math.max(...product.price)
                      : 0;

                  const displayPrice =
                    minPrice === maxPrice
                      ? `€${minPrice.toFixed(2)}`
                      : `€${minPrice.toFixed(2)} - €${maxPrice.toFixed(2)}`;

                  return (
                    <div
                      key={product._id || index}
                      className="relative flex-shrink-0 snap-start"
                    >

                      {/* MATCH BADGE */}
                      <div className="absolute top-8 left-3 z-10 bg-lemonbalm text-linencloud px-2 py-1 rounded-full">
                        <p className="text-overline">
                          Match Score:{' '}
                          <span className="font-medium">
                            {rec.matchScore?.toFixed(0) || 'N/A'}%
                          </span>
                        </p>
                      </div>

                      {/* PRODUCT CARD */}
                      <ProductCard
                        product={{
                          ...product
                        }}
                      />

                    </div>

                  );
                })}
            </div>

            {/* CTA */}
            <div className="mt-2 flex items-center justify-center max-w-[700px]">
              <Link to="/products">
                <Button className="text-body2">
                  Browse All Products
                  <MaterialIcon icon="arrow_forward" />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-yellow rounded-xl p-4">
            <p className="text-white text-body2">
              No recommendations available. Try re-taking the quiz.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default ScentProfile;

