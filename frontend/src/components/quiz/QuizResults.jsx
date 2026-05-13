import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { quizAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { getImageUrl, placeholderDataUri } from '../../utils/imageUtils';
import ProductCard from '../products/ProductCard';
import Button from '../common/Button';
import MaterialIcon from '../common/MaterialIcon';

const QuizResults = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadProfile();
  }, [isAuthenticated, navigate]);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!profile || !profile.recommendations || profile.recommendations.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No recommendations found. Please complete the quiz.</p>
          <Link
            to="/quiz"
            className="inline-block bg-black text-white px-6 py-2 rounded-full hover:bg-gray-700"
          >
            Take Quiz
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* HEADER */}
      <div className="flex flex-col gap-layout-normal mb-layout-xl">
        <h1 className="text-heading2 font-display font-bold text-center">
          The Scent Profile is Ready!
        </h1>

        <Link to="/account?tab=scent-profile" className="mx-auto">
          <Button size="sm">
            View my Scent Profile
            <MaterialIcon icon="arrow_forward" />
          </Button>
        </Link>
        <p className="text-body2 text-gray-600 mt-6 lg:text-center">
          Based on your preferences, here are your best fragrance matches.
        </p>
      </div>

      {/* RECOMMENDATIONS */}
      {profile.recommendations && profile.recommendations.length > 0 ? (
        <div className="flex flex-col gap-layout-xs lg:items-center">

          <div className="flex items-center justify-between">
            <h2 className="text-heading3 font-display font-semibold">
              Top 3 Best Matches
            </h2>
            {/* <Link to="/quiz">
              <Button variant="outline" size="sm" >Re-take Quiz</Button>
            </Link> */}
          </div>

          {/* PRODUCT ROW */}
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
                        ...product,
                      }}
                    />

                  </div>
                );
              })}
          </div>

          {/* CTA */}
          <div className="flex items-center justify-center mt-layout-sm">
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
  );
};

export default QuizResults;

