import { useState } from 'react';
import MaterialIcon from './common/MaterialIcon';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      category: 'Orders & Shipping',
      questions: [
        {
          question: 'How long does shipping take?',
          answer: 'We offer free shipping on orders over €90. Standard shipping typically takes 3-5 business days within Europe. Express shipping options are available at checkout for faster delivery.'
        },
        {
          question: 'What are the shipping costs?',
          answer: 'Shipping is free for orders over €90. For orders below €90, standard shipping costs €5.99. Express shipping options are available at checkout with varying costs based on your location.'
        },
        {
          question: 'Can I track my order?',
          answer: 'Yes! Once your order ships, you will receive a tracking number via email. You can use this number to track your package in real-time through our shipping partner\'s website.'
        },
        {
          question: 'What countries do you ship to?',
          answer: 'We currently ship to all countries within the European Union. We are working on expanding our shipping to other regions. Please check our shipping page for the most up-to-date list of countries.'
        }
      ]
    },
    {
      category: 'Products',
      questions: [
        {
          question: 'Are your perfumes authentic?',
          answer: 'Absolutely! We only sell 100% authentic, original perfumes directly from authorized distributors and brands. All our products are guaranteed authentic, and we provide certificates of authenticity upon request.'
        },
        {
          question: 'What sizes are available?',
          answer: 'Most perfumes are available in multiple sizes, typically 30ml, 50ml, and 100ml. Some fragrances may also be available in 15ml travel sizes. The available sizes for each product are displayed on the product page.'
        },
        {
          question: 'How do I choose the right perfume?',
          answer: 'We recommend using our Perfume Finder quiz, which asks you questions about your preferences, lifestyle, and scent profile. Based on your answers, we\'ll recommend perfumes that match your taste. You can also browse by brand, gender, season, or accord type.'
        },
        {
          question: 'Do you offer samples?',
          answer: 'Currently, we offer sample sets for select brands. Check our "Samples" section or contact our customer service team for more information about available sample options.'
        }
      ]
    },
    {
      category: 'Returns & Exchanges',
      questions: [
        {
          question: 'What is your return policy?',
          answer: 'We offer a 30-day return policy for unopened and unused products in their original packaging. Items must be returned in their original condition with all seals intact. Opened products cannot be returned for hygiene reasons.'
        },
        {
          question: 'How do I return a product?',
          answer: 'To initiate a return, please log into your account, go to "My Account" > "Orders", select the order you wish to return, and click "Return Item". You will receive a return label and instructions via email. Returns are free for orders over €90.'
        },
        {
          question: 'Can I exchange a product?',
          answer: 'Yes, you can exchange a product for a different size or fragrance. Please initiate a return for the original item and place a new order for the desired product. Once we receive the returned item, we will process a refund for the original purchase.'
        },
        {
          question: 'How long does it take to process a refund?',
          answer: 'Once we receive your returned item, we will inspect it and process your refund within 5-7 business days. The refund will be issued to your original payment method and may take an additional 3-5 business days to appear in your account.'
        }
      ]
    },
    {
      category: 'Payment & Security',
      questions: [
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards (Visa, Mastercard, American Express) and debit cards. All payments are processed securely through our encrypted payment gateway.'
        },
        {
          question: 'Is my payment information secure?',
          answer: 'Yes, absolutely. We use industry-standard SSL encryption to protect all payment information. We never store your full credit card details on our servers. All transactions are processed through secure, PCI-compliant payment gateways.'
        },
        {
          question: 'Do you charge real money?',
          answer: 'For demo purposes, we use a special "FREE" coupon code that provides 100% discount. In a production environment, real payment processing would be enabled. Currently, no actual charges are made to your card.'
        }
      ]
    },
    {
      category: 'Account & Support',
      questions: [
        {
          question: 'How do I create an account?',
          answer: 'You can create an account by clicking "Sign Up" in the top navigation bar. You\'ll need to provide your name, email address, and create a password. Creating an account allows you to track orders, save your scent profile, and receive personalized recommendations.'
        },
        {
          question: 'I forgot my password. How do I reset it?',
          answer: 'Click "Login" and then "Forgot Password". Enter your email address, and you will receive instructions to reset your password. You will need to enter your 6-digit reset code that you set up during account creation or in your account settings.'
        },
        {
          question: 'How do I update my account information?',
          answer: 'Log into your account and go to "My Account" > "Settings". From there, you can update your profile information, change your password, and manage your account preferences.'
        },
        {
          question: 'How can I contact customer support?',
          answer: 'You can reach our customer support team via email at support@perfumestore.com or by phone at +1 (555) 123-4567. Our support team is available Monday through Friday, 9 AM to 6 PM CET.'
        }
      ]
    },
    {
      category: 'Perfume Care & Storage',
      questions: [
        {
          question: 'How should I store my perfume?',
          answer: 'Store perfumes in a cool, dry place away from direct sunlight and heat sources. Avoid storing them in the bathroom due to humidity and temperature fluctuations. Keep the cap tightly closed when not in use to prevent evaporation.'
        },
        {
          question: 'How long does perfume last?',
          answer: 'Unopened perfumes can last 3-5 years if stored properly. Once opened, most perfumes maintain their quality for 2-3 years. The shelf life can vary depending on the fragrance composition and storage conditions.'
        },
        {
          question: 'What is the difference between Eau de Parfum and Eau de Toilette?',
          answer: 'The main difference is the concentration of fragrance oils. Eau de Parfum (EDP) contains 15-20% fragrance oil and typically lasts 4-6 hours. Eau de Toilette (EDT) contains 5-15% fragrance oil and typically lasts 2-4 hours. EDP is generally more intense and longer-lasting.'
        }
      ]
    }
  ];

  const toggleQuestion = (categoryIndex, questionIndex) => {
    const index = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-pdp-gap-btw-sections">

        {/* HEADER */}
        <div className="flex flex-col gap-layout-sm">

          <h1 className="text-heading1 font-display font-semibold">
            Frequently Asked Questions
          </h1>

          <p className="text-caption text-gray-600">
            Find answers about shipping, returns, orders, perfumes, payments, and more.
          </p>
        </div>

        {/* FAQ LIST */}
        <div className="flex flex-col gap-layout-xl">

          {faqs.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className="flex flex-col gap-layout-normal"
            >

              {/* CATEGORY TITLE */}

              <h2 className="text-heading3 font-heading font-medium">
                {category.category}
              </h2>

              {/* QUESTIONS */}
              <div className="rounded-xl bg-secondary px-layout-normal">

                {category.questions.map((faq, questionIndex) => {
                  const index = `${categoryIndex}-${questionIndex}`;
                  const isOpen = openIndex === index;

                  return (
                    <div
                      key={questionIndex}
                      className="border-b border-gray-200 last:border-0"
                    >

                      {/* QUESTION */}
                      <button
                        onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                        className="w-full py-layout-normal flex items-center justify-between gap-4 text-left group"
                      >
                        <span className="text-body2 transition-colors group-hover:text-gray-600">
                          {faq.question}
                        </span>

                        <div
                          className={`transition-transform duration-300 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        >
                          <MaterialIcon
                            icon="keyboard_arrow_down"
                            size={24}
                          />
                        </div>
                      </button>

                      {/* ANSWER */}
                      <div
                        className={`grid transition-all duration-300 ease-in-out ${
                          isOpen
                            ? 'grid-rows-[1fr] opacity-100 pb-layout-normal'
                            : 'grid-rows-[0fr] opacity-0'
                        }`}
                      >
                        <div className="overflow-hidden">
                          <p className="text-body2 text-gray-700 leading-relaxed pr-8">
                            {faq.answer}
                          </p>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          ))}
        </div>

        {/* CONTACT BOX */}
        <div className="mt-homepage-gap-btw-sections rounded-xl border border-black px-layout-normal py-layout-normal flex flex-col gap-layout-normal">

          <div className="flex flex-col gap-layout-xs">
            <h3 className="text-heading3 font-display font-semibold">
              Still need help?
            </h3>

            <p className="text-body2 text-gray-700">
              Our support team is happy to assist you with orders, shipping, or fragrance recommendations.
            </p>

            <p className="text-body2 text-gray-700">
              Email: support@scentra.com
            </p>

            <p className="text-body2 text-gray-700">
              Phone number (Mon-Fri, 9AM-5PM): +358 123456789
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-layout-sm">

            <a
              href="mailto:support@scentra.com"
              className="px-5 py-2 rounded-full border border-black text-body2 hover:bg-black hover:text-white transition-colors"
            >
              Email Us
            </a>

            <a
              href="tel:+358 123456789"
              className="px-5 py-2 rounded-full bg-black text-white text-body2 hover:bg-gray-800 transition-colors"
            >
              Call Support
            </a>

          </div>
        </div>

      </div>
    </div>
  );
};

export default FAQ;

