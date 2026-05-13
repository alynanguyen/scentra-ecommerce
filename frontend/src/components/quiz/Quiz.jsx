import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { quizAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import ScentProfile from './ScentProfile';
import Button from '../common/Button';
import MaterialIcon from '../common/MaterialIcon';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [quizStarted, setQuizStarted] = useState(false);
  const location = useLocation();
  const justSubmitted = location.state?.justSubmitted;
  const [hasProfile, setHasProfile] = useState(justSubmitted || false);
  const [checkingProfile, setCheckingProfile] = useState(!justSubmitted);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const retake = searchParams.get('retake') === 'true';

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/quiz');
      return;
    }
    // If we just submitted, skip the loading check and go straight to profile
    if (justSubmitted) {
      setHasProfile(true);
      setCheckingProfile(false);
      setLoading(false);
      setAnalyzing(false);
    } else if (!hasProfile && !analyzing && !justSubmitted) {
      checkProfile();
    }
  }, [isAuthenticated, navigate, retake, justSubmitted]);

  // Reset scroll position when question changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentQuestion]);

  const checkProfile = async () => {
    try {
      setCheckingProfile(true);
      const response = await quizAPI.getProfile();
      if (response.data.success && response.data.data && !retake) {
        // User has a profile and not retaking
        setHasProfile(true);
        setLoading(false);
      } else {
        // User doesn't have a profile or is retaking
        setHasProfile(false);
        setQuizStarted(false); // Reset quiz started state when loading questions
        loadQuestions();
      }
    } catch (error) {
      // No profile found or error - show quiz
      if (error.response?.status === 404 || retake) {
        setHasProfile(false);
        setQuizStarted(false); // Reset quiz started state
        loadQuestions();
      } else {
        console.error('Error checking profile:', error);
        setHasProfile(false);
        setQuizStarted(false); // Reset quiz started state
        loadQuestions();
      }
    } finally {
      setCheckingProfile(false);
    }
  };

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const response = await quizAPI.getQuestions();
      setQuestions(response.data.data.questions || []);
    } catch (error) {
      console.error('Error loading questions:', error);
      setError('Failed to load quiz questions');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (value) => {
    const question = questions[currentQuestion];
    const field = question.field;

    // Single-select fields (should be strings, not arrays)
    const singleSelectFields = ['gender', 'vibe', 'longevity_category', 'price'];

    // For price field, store the entire object (with range)
    if (field === 'price' && typeof value === 'object') {
      setAnswers({
        ...answers,
        [field]: value,
      });
      return;
    }

    // Handle single-select fields (gender, vibe, longevity_category)
    if (singleSelectFields.includes(field) && field !== 'price') {
      // For longevity_category, extract label if it's an object
      if (field === 'longevity_category' && typeof value === 'object' && value.label) {
        setAnswers({
          ...answers,
          [field]: value.label,
        });
      } else {
        // For gender and vibe, store as string
        setAnswers({
          ...answers,
          [field]: typeof value === 'string' ? value : String(value),
        });
      }
      return;
    }

    // Handle multiple-select fields (arrays)
    if (question.type === 'multiple') {
      if (Array.isArray(answers[field])) {
        // Check if value is already in array (handle both objects and primitives)
        const isSelected = answers[field].some((v) => {
          if (typeof v === 'object' && typeof value === 'object') {
            return JSON.stringify(v) === JSON.stringify(value);
          }
          return v === value;
        });

        if (isSelected) {
          setAnswers({
            ...answers,
            [field]: answers[field].filter((v) => {
              if (typeof v === 'object' && typeof value === 'object') {
                return JSON.stringify(v) !== JSON.stringify(value);
              }
              return v !== value;
            }),
          });
        } else {
          setAnswers({
            ...answers,
            [field]: [...answers[field], value],
          });
        }
      } else {
        setAnswers({
          ...answers,
          [field]: [value],
        });
      }
    } else {
      setAnswers({
        ...answers,
        [field]: value,
      });
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    // Reset scroll position to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      // Format answers according to backend expectations
      const formattedAnswers = { ...answers };

      // Single-select fields that should be strings, not arrays
      const singleSelectFields = ['gender', 'vibe', 'longevity_category'];

      // Extract single values from arrays if they were stored as arrays
      singleSelectFields.forEach(field => {
        if (Array.isArray(formattedAnswers[field])) {
          const value = formattedAnswers[field][0];
          if (field === 'longevity_category' && typeof value === 'object' && value.label) {
            formattedAnswers[field] = value.label;
          } else {
            formattedAnswers[field] = typeof value === 'string' ? value : String(value);
          }
        } else if (formattedAnswers[field] && typeof formattedAnswers[field] === 'object') {
          // Handle longevity_category object
          if (field === 'longevity_category' && formattedAnswers[field].label) {
            formattedAnswers[field] = formattedAnswers[field].label;
          }
        }
      });

      // Handle price range format
      if (formattedAnswers.price) {
        if (Array.isArray(formattedAnswers.price)) {
          // If price is an array, extract the first element if it's an object
          const priceValue = formattedAnswers.price[0];
          if (typeof priceValue === 'object' && priceValue.range) {
            formattedAnswers.price = priceValue;
          } else {
            formattedAnswers.price = { range: formattedAnswers.price };
          }
        } else if (typeof formattedAnswers.price === 'object') {
          if (!formattedAnswers.price.range) {
            // If price object doesn't have range, it might be invalid
            formattedAnswers.price = { range: [0, 100] }; // Default
          }
        }
      }

      // Show analyzing state
      setSubmitting(false);
      setAnalyzing(true);

      // Start timer for minimum 10 seconds
      const startTime = Date.now();
      const minDisplayTime = 5000; // 5 seconds
      const maxDisplayTime = 10000; // 10 seconds

      const response = await quizAPI.submitQuiz(formattedAnswers);
      if (response.data.success) {
        // Calculate remaining time to ensure minimum display time
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, Math.min(maxDisplayTime, minDisplayTime) - elapsedTime);

        // Wait for remaining time if needed
        if (remainingTime > 0) {
          await new Promise(resolve => setTimeout(resolve, remainingTime));
        }

        // Clear analyzing state and set profile before navigation
        setAnalyzing(false);
        setHasProfile(true);
        setCheckingProfile(false);
        setLoading(false);

        // Navigate to scent profile with state to skip loading check
        navigate('/quiz', {
          replace: true,
          state: { justSubmitted: true }
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit quiz');
      setAnalyzing(false);
      setSubmitting(false);
    }
  };

  const isQuestionAnswered = () => {
    const question = questions[currentQuestion];
    if (!question) return false;

    const field = question.field;
    const answer = answers[field];

    if (question.optional) return true;
    if (!answer) return false;

    // Single-select fields (should be strings, not arrays)
    const singleSelectFields = ['gender', 'vibe', 'longevity_category', 'price'];
    if (singleSelectFields.includes(field)) {
      // For single-select fields, check if it's a valid string or object
      if (field === 'price') {
        return typeof answer === 'object' && answer !== null && (answer.range || answer.label);
      }
      if (field === 'longevity_category') {
        return (typeof answer === 'string' && answer !== '') ||
               (typeof answer === 'object' && answer !== null && answer.label);
      }
      return typeof answer === 'string' && answer !== '';
    }

    // Multiple-select fields (should be arrays)
    if (Array.isArray(answer)) return answer.length > 0;
    return answer !== null && answer !== undefined && answer !== '';
  };

  const canProceed = () => {
    return isQuestionAnswered();
  };

  if (checkingProfile || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  // Show analyzing state after quiz submission
  if (analyzing) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black mb-4"></div>
        <h2 className="text-heading2 font-bold text-gray-900 mb-2">Analyzing Your Preferences</h2>
        <p className="text-gray-600">We're calculating your perfect scent matches...</p>
      </div>
    );
  }

  // If user has a profile and not retaking, show profile view
  if (hasProfile && !retake) {
    return <ScentProfile />;
  }

  // Show intro screen before quiz starts
  if (!quizStarted && questions.length > 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-secondary rounded-xl flex flex-col items-center justify-center gap-pdp-gap-btw-sections p-homepage-margin-x">
          <div className="flex flex-col gap-layout-normal items-center text-center">
            <h1 className="text-heading2 font-bold font-display">Find Your Perfect Scent</h1>
            <p className="text-caption">
              Take our personalized quiz to discover fragrances that match your unique preferences and style.
            </p>
            <img src="/imgs/quiz/perfume.png" alt="perfume" className="h-[50px] md:h-[70px]" />
          </div>

          <div className="flex flex-col gap-layout-xl">
            <h2 className="text-body1 font-display font-medium">What to Expect</h2>
            <ul className="flex flex-col gap-layout-sm text-body2 list-disc px-4">
              <li>
                <span>Answer a few quick questions about your preferences</span>
              </li>
              <li>
                <span>Get personalized fragrance recommendations</span>
              </li>
              <li>
                <span>Discover scents tailored to your personality and lifestyle</span>
              </li>
              <li>
                <span>Takes approximately {Math.ceil(questions.length * 0.5)} minutes to complete</span>
              </li>
            </ul>
          </div>

          {/* <button
            onClick={() => {
              setQuizStarted(true);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full md:w-auto px-8 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors text-lg font-semibold"
          >
            Start Quiz
          </button> */}

          <Button
            size="md"
            onClick={() => {
              setQuizStarted(true);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}>
              Start quiz
              <MaterialIcon icon="arrow_forward" size={24} />
            </Button>

        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-gray-500">No questions available</p>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const answer = answers[question.field];
  const isLastQuestion = currentQuestion === questions.length - 1;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col gap-pdp-gap-btw-sections p-homepage-margin-x bg-secondary rounded-xl">
        {/* Progress Bar */}
        <div className="flex flex-col gap-layout-sm">
          <div className="flex justify-between text-body2 text-gray-600">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-layout-normal flex items-center px-0.5">
            <div
              className="bg-black h-layout-sm rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {(() => {
          const singleSelectFields = ['gender', 'vibe', 'longevity_category', 'price'];
          const isSingleSelect = singleSelectFields.includes(question.field);
          const isFewOptions = question.options.length <= 3;

          const optionIcons = {
            // Gender
            male: '♂',
            female: '♀',
            unisex: '⚧',

            // Vibe
            sexy: '❤️‍🔥',
            romantic: '💕',
            playful: '😉',
            fresh: '🌊',
            elegant: '🦢',
            dark: '🌑',
            comforting: '🧣',
            bold: '⚡️',
            natural: '🌿',
            unusual: '😮',

            // Occasion
            office: '👔',
            casual: '☕️',
            school: '📚',
            'daytime event': '☀️',
            travel: '✈️',
            'date night': '🍷',
            party: '🎉',
            'formal dinner': '🍽️',
            'theatre or concert': '🎭',
            'evening out': '🌆',
            nightclub: '🪩',
            'outdoor event': '⚽️',
            'special occasion': '🎂',
            'formal gala': '🍾',
            'after-hours event': '🎤',
            'romantic night': '🌹',
            'luxury event': '💎',

            // Season
            spring: '🌸',
            summer: '☀️',
            autumn: '🍂',
            'autumn / fall': '🍂',
            winter: '❄️',
            'all-year': '🌈',

            // Accord categories
            floral: '🌷',
            'fruity & sweet': '🍒',
            'woody & resinous': '🪵',
            'spicy & warm': '☕️',
            'fresh & clean': '🫧',
            'green & earthy': '🌳',
            'aquatic & marine': '🌊',
            'musky & powdery': '🧴',
            'oriental & exotic': '🚬',

            // Notes
            citrus: '🍋',
            fruity: '🍓',
            spicy: '🫚',
            woody: '🪵',
            'resinous / balsamic': '🌲',
            'gourmand / sweet': '🍫',
            'aromatic / herbal / green': '🌿',
            'musky / animalic': '🦌',
            'oriental / warm': '☕️',
            'earthy / smoky / dry': '👞',
            'marine / fresh': '🌊',
            unique: '🍷',
          };

          const optionLabelOverrides = {
            'Soft / Moderate': 'Soft – Moderate (below 6 hours)',
            'Moderate / Strong': 'Moderate - Strong (6 - 10 hours)',
            'Long-lasting': 'Very Strong (above 10 hours)',
            'Budget': 'Affordable (below €150)',
            'Mid': 'Mid (€150 - €350)',
            'Luxury': 'Luxury (above €350)'
          };

          return (
            <div className="flex flex-col gap-layout-lg">
              {/* Question */}
              <div className="flex flex-col gap-layout-xxs">
                <h2 className="text-heading3 font-heading">{question.question}</h2>
                <p className="text-caption text-gray-500">
                  {isSingleSelect ? '(Choose 1 option that suits you best)' : '(Choose many options as needed)'}
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red rounded-xl">
                  <p className="text-body2 text-white">{error}</p>
                </div>
              )}

              {/* Options */}
              <div
                className={`mb-layout-normal ${
                  isFewOptions
                    ? 'flex flex-col gap-3'
                    : 'flex flex-wrap gap-4'
                }`}
              >
                {question.options.map((option, index) => {
                  const optionValue = typeof option === 'object' ? option : option;
                  // const optionLabel =
                  //   typeof option === 'object'
                  //     ? option.label || option.value
                  //     : option;

                  const rawLabel =
                    typeof option === 'object'
                      ? option.label || option.value
                      : option;

                  const optionLabel = optionLabelOverrides[rawLabel] || rawLabel;

                  // Single-select fields
                  const isSingleSelectInner = singleSelectFields.includes(question.field);

                  // Disable logic
                  let isDisabled = false;
                  if (question.field === 'disliked_notes' && answers.liked_notes) {
                    const likedNotes = Array.isArray(answers.liked_notes)
                      ? answers.liked_notes
                      : [answers.liked_notes];

                    isDisabled = likedNotes.some((likedNote) => {
                      if (typeof likedNote === 'string' && typeof optionValue === 'string') {
                        return likedNote === optionValue;
                      }
                      return false;
                    });
                  }

                  // Selection logic
                  let isSelected = false;

                  if (isSingleSelectInner) {
                    if (question.field === 'longevity_category') {
                      if (typeof answer === 'object' && answer !== null && answer.label) {
                        isSelected = answer.label === (optionValue.label || optionValue);
                      } else if (typeof answer === 'string') {
                        isSelected = answer === (optionValue.label || optionValue);
                      }
                    } else if (question.field === 'price') {
                      if (typeof answer === 'object' && answer !== null && typeof optionValue === 'object') {
                        isSelected =
                          answer.label === optionValue.label ||
                          JSON.stringify(answer) === JSON.stringify(optionValue);
                      }
                    } else {
                      const answerStr = typeof answer === 'string' ? answer : String(answer);
                      const optionStr = typeof optionValue === 'string' ? optionValue : String(optionValue);
                      isSelected = answerStr === optionStr;
                    }
                  } else if (Array.isArray(answer)) {
                    isSelected = answer.some((a) => {
                      if (typeof a === 'object' && typeof optionValue === 'object') {
                        return JSON.stringify(a) === JSON.stringify(optionValue);
                      }
                      return a === optionValue;
                    });
                  } else {
                    if (typeof answer === 'object' && typeof optionValue === 'object') {
                      isSelected = JSON.stringify(answer) === JSON.stringify(optionValue);
                    } else {
                      isSelected = answer === optionValue;
                    }
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => !isDisabled && handleAnswer(optionValue)}
                      disabled={isDisabled}
                      className={`${
                        isFewOptions ? 'w-full' : 'w-auto'
                      } text-left text-body2 text-black px-layout-normal py-layout-xxs rounded-full border border-0.5 transition-colors ${
                        isDisabled
                          ? ' border-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                          : isSelected
                          ? ' border-black bg-black text-white'
                          : ' border-gray-500 hover:border-black text-black'
                      }`}
                      title={isDisabled ? 'You have chosen this note as your love note.' : ''}
                    >
                      <span className="flex items-center gap-1.5 md:gap-2">
                        {optionIcons[optionLabel?.toLowerCase?.()] && (
                          <span>{optionIcons[optionLabel.toLowerCase()]}</span>
                        )}
                        {optionLabel}
                      </span>

                      {isDisabled && (
                        <span className="ml-2 text-overline text-gray-400">
                          (You have chosen this note as your love note.)
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="px-4 md:px-6 py-2 flex items-center gap-1 bg-white text-gray-700 rounded-full hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <MaterialIcon icon="arrow_back" />
            Previous
          </button>

          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              disabled={!canProceed() || submitting}
              className="px-4 md:px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="px-4 md:px-6 py-2 flex items-center gap-1 bg-black text-white rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <MaterialIcon icon="arrow_forward" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;

