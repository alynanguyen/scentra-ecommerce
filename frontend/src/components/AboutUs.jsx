import MaterialIcon from './common/MaterialIcon';

const AboutUs = () => {
  // return (
  //   <div className="min-h-screen bg-gray-50 py-8">
  //     <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
  //       {/* Hero Section */}
  //       <div className="bg-white rounded-lg shadow-md p-8 mb-8">
  //         <h1 className="text-4xl font-bold text-gray-900 mb-4">About Us</h1>
  //         <p className="text-xl text-gray-600 leading-relaxed">
  //           Welcome to our perfume store, where luxury meets authenticity. We are passionate about bringing you the finest fragrances from the world's most prestigious brands.
  //         </p>
  //       </div>

  //       {/* Our Story */}
  //       <div className="bg-white rounded-lg shadow-md p-8 mb-8">
  //         <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Story</h2>
  //         <div className="space-y-4 text-gray-700 leading-relaxed">
  //           <p>
  //             Founded with a vision to make luxury perfumes accessible to everyone, our store has been a trusted destination for fragrance enthusiasts since our inception. We believe that a great perfume is more than just a scent—it's a statement, a memory, and an expression of your unique personality.
  //           </p>
  //           <p>
  //             Our journey began with a simple mission: to curate the finest collection of authentic perfumes from renowned brands around the world. We carefully select each fragrance in our collection, ensuring that every bottle meets our high standards for quality and authenticity.
  //           </p>
  //           <p>
  //             Today, we are proud to offer an extensive range of perfumes, from timeless classics to the latest releases, all while maintaining our commitment to exceptional customer service and genuine products.
  //           </p>
  //         </div>
  //       </div>

  //       {/* Our Values */}
  //       <div className="bg-white rounded-lg shadow-md p-8 mb-8">
  //         <h2 className="text-2xl font-semibold text-gray-900 mb-6">Our Values</h2>
  //         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //           <div className="flex items-start gap-4">
  //             <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
  //               <MaterialIcon icon="verified" size={24} className="text-indigo-600" />
  //             </div>
  //             <div>
  //               <h3 className="text-lg font-semibold text-gray-900 mb-2">Authenticity</h3>
  //               <p className="text-gray-600">
  //                 We guarantee 100% authentic products. Every perfume in our store is sourced directly from authorized distributors and comes with a certificate of authenticity.
  //               </p>
  //             </div>
  //           </div>

  //           <div className="flex items-start gap-4">
  //             <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
  //               <MaterialIcon icon="star" size={24} className="text-indigo-600" />
  //             </div>
  //             <div>
  //               <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality</h3>
  //               <p className="text-gray-600">
  //                 We are committed to offering only the highest quality fragrances. Our team carefully tests and verifies each product to ensure it meets our strict quality standards.
  //               </p>
  //             </div>
  //           </div>

  //           <div className="flex items-start gap-4">
  //             <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
  //               <MaterialIcon icon="support_agent" size={24} className="text-indigo-600" />
  //             </div>
  //             <div>
  //               <h3 className="text-lg font-semibold text-gray-900 mb-2">Customer Service</h3>
  //               <p className="text-gray-600">
  //                 Your satisfaction is our priority. Our dedicated customer service team is here to help you find the perfect fragrance and answer any questions you may have.
  //               </p>
  //             </div>
  //           </div>

  //           <div className="flex items-start gap-4">
  //             <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
  //               <MaterialIcon icon="eco" size={24} className="text-indigo-600" />
  //             </div>
  //             <div>
  //               <h3 className="text-lg font-semibold text-gray-900 mb-2">Sustainability</h3>
  //               <p className="text-gray-600">
  //                 We are committed to sustainable practices and work with brands that share our environmental values. We use eco-friendly packaging whenever possible.
  //               </p>
  //             </div>
  //           </div>
  //         </div>
  //       </div>

  //       {/* What Makes Us Different */}
  //       <div className="bg-white rounded-lg shadow-md p-8 mb-8">
  //         <h2 className="text-2xl font-semibold text-gray-900 mb-6">What Makes Us Different</h2>
  //         <div className="space-y-4">
  //           <div className="flex items-start gap-3">
  //             <MaterialIcon icon="check_circle" size={24} className="text-green-500 flex-shrink-0 mt-1" />
  //             <div>
  //               <h3 className="font-semibold text-gray-900 mb-1">Perfume Finder Quiz</h3>
  //               <p className="text-gray-600">
  //                 Our innovative Perfume Finder quiz helps you discover fragrances that match your personality, preferences, and lifestyle. Simply answer a few questions, and we'll recommend the perfect scents for you.
  //               </p>
  //             </div>
  //           </div>

  //           <div className="flex items-start gap-3">
  //             <MaterialIcon icon="check_circle" size={24} className="text-green-500 flex-shrink-0 mt-1" />
  //             <div>
  //               <h3 className="font-semibold text-gray-900 mb-1">Expert Curation</h3>
  //               <p className="text-gray-600">
  //                 Our team of fragrance experts carefully curates our collection, ensuring we offer a diverse range of scents from established luxury brands to emerging niche perfumers.
  //               </p>
  //             </div>
  //           </div>

  //           <div className="flex items-start gap-3">
  //             <MaterialIcon icon="check_circle" size={24} className="text-green-500 flex-shrink-0 mt-1" />
  //             <div>
  //               <h3 className="font-semibold text-gray-900 mb-1">Free Shipping</h3>
  //               <p className="text-gray-600">
  //                 We offer free shipping on orders over €90, making luxury fragrances more accessible. Fast and secure delivery ensures your perfumes arrive in perfect condition.
  //               </p>
  //             </div>
  //           </div>

  //           <div className="flex items-start gap-3">
  //             <MaterialIcon icon="check_circle" size={24} className="text-green-500 flex-shrink-0 mt-1" />
  //             <div>
  //               <h3 className="font-semibold text-gray-900 mb-1">30-Day Return Policy</h3>
  //               <p className="text-gray-600">
  //                 We stand behind our products with a generous 30-day return policy. If you're not completely satisfied, we'll make it right.
  //               </p>
  //             </div>
  //           </div>
  //         </div>
  //       </div>

  //       {/* Our Mission */}
  //       <div className="bg-white rounded-lg shadow-md p-8 mb-8">
  //         <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
  //         <p className="text-gray-700 leading-relaxed text-lg">
  //           To inspire and empower individuals to express their unique identity through the art of fragrance. We believe that everyone deserves to find their perfect scent—one that resonates with their personality, enhances their confidence, and creates lasting memories.
  //         </p>
  //       </div>

  //       {/* Contact Section */}
  //       <div className="bg-indigo-50 rounded-lg p-8">
  //         <h2 className="text-2xl font-semibold text-gray-900 mb-4">Get in Touch</h2>
  //         <p className="text-gray-700 mb-6">
  //           We'd love to hear from you! Whether you have a question, feedback, or just want to say hello, our team is here to help.
  //         </p>
  //         <div className="space-y-3">
  //           <div className="flex items-center gap-3">
  //             <MaterialIcon icon="email" size={24} className="text-indigo-600" />
  //             <a
  //               href="mailto:support@perfumestore.com"
  //               className="text-indigo-600 hover:text-indigo-800 underline"
  //             >
  //               support@perfumestore.com
  //             </a>
  //           </div>
  //           <div className="flex items-center gap-3">
  //             <MaterialIcon icon="phone" size={24} className="text-indigo-600" />
  //             <a
  //               href="tel:+15551234567"
  //               className="text-indigo-600 hover:text-indigo-800 underline"
  //             >
  //               +1 (555) 123-4567
  //             </a>
  //           </div>
  //           <div className="flex items-center gap-3">
  //             <MaterialIcon icon="schedule" size={24} className="text-indigo-600" />
  //             <span className="text-gray-700">Monday - Friday, 9 AM - 6 PM CET</span>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-5xl mx-auto flex flex-col gap-pdp-gap-btw-sections">

        {/* HERO */}
        <div className="flex flex-col gap-layout-lg">

          <div className="flex flex-col gap-layout-sm">

            <h1 className="text-heading1 font-display font-semibold">
              Fragrance is more than scent — it’s identity, memory, and emotion.
            </h1>

            <p className="text-caption text-gray-600 leading-relaxed">
              We curate authentic luxury perfumes from around the world and help
              people discover fragrances that truly feel like them.
            </p>
          </div>

          {/* HERO CARD */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-layout-xl">

              <div className="flex flex-col gap-layout-xs bg-linencloud rounded-xl px-layout-sm py-layout-sm">
                <p className="text-heading2 font-display font-bold">
                  100%
                </p>
                <p className="text-body2 text-gray-700">
                  Authentic fragrances sourced from trusted distributors.
                </p>
              </div>

              <div className="flex flex-col gap-layout-xs bg-linencloud rounded-xl px-layout-sm py-layout-sm">
                <p className="text-heading3 font-display font-bold">
                  Curated
                </p>
                <p className="text-body2 text-gray-700 ">
                  Carefully selected scents from luxury and niche perfume houses.
                </p>
              </div>

              <div className="flex flex-col gap-layout-xs bg-linencloud rounded-xl px-layout-sm py-layout-sm">
                <p className="text-heading3 font-display font-bold">
                  Personal
                </p>
                <p className="text-body2 text-gray-700">
                  Recommendations tailored to your vibe and preferences.
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* OUR STORY */}
        <div className="flex flex-col gap-layout-normal ">


          <h2 className="text-heading3 font-display font-semibold">
            Our Story
          </h2>

          <div className="flex flex-col gap-layout-normal text-body2">

            <p className="leading-relaxed">
              Founded with a vision to make luxury perfumes more accessible,
              our store began with a simple belief — fragrance should feel personal.
              A perfume is not just a scent; it becomes part of your memories,
              personality, and confidence.
            </p>

            <p className="leading-relaxed">
              We carefully curate authentic fragrances from renowned perfume houses,
              selecting scents that range from timeless classics to modern niche creations.
              Every bottle in our collection is chosen for its craftsmanship,
              uniqueness, and emotional character.
            </p>

            <p className="leading-relaxed">
              Today, we continue to focus on delivering premium fragrances,
              personalized recommendations, and an elevated shopping experience
              for fragrance lovers around the world.
            </p>

          </div>
        </div>

        {/* VALUES */}
        <div className="flex flex-col gap-layout-lg">

          <h2 className="text-heading3 font-display font-semibold">
            Our Values
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-layout-normal">

            {[
              {
                icon: 'verified',
                title: 'Authenticity',
                text: 'Every perfume is sourced from trusted suppliers to guarantee authenticity and quality.',
              },
              {
                icon: 'star',
                title: 'Quality',
                text: 'We carefully curate fragrances that meet our standards for craftsmanship and performance.',
              },
              {
                icon: 'support_agent',
                title: 'Customer Experience',
                text: 'We help customers discover scents that truly fit their personality and lifestyle.',
              },
              {
                icon: 'eco',
                title: 'Sustainability',
                text: 'We support brands and practices that move toward more conscious and sustainable fragrance retail.',
              },
            ].map((value, index) => (
              <div
                key={index}
                className="rounded-xl bg-secondary p-layout-sm flex flex-col gap-layout-sm"
              >

                <div className="flex items-center gap-layout-xs">
                  <MaterialIcon icon={value.icon} size={24} />
                  <h3 className="text-heading3 font-display font-semibold">
                    {value.title}
                  </h3>

                </div>

                <p className="text-body2 text-gray-700 leading-relaxed">
                  {value.text}
                </p>
              </div>
            ))}

          </div>
        </div>

        {/* WHAT MAKES US DIFFERENT */}
        <div className="flex flex-col gap-layout-normal ">


          <h2 className="text-heading3 font-display font-semibold">
            What Makes Us Different
          </h2>

          <div className="flex flex-col gap-layout-normal">

            {[
              {
                title: 'Perfume Finder Quiz',
                text: 'Discover fragrances tailored to your personality, preferences, and lifestyle.',
              },
              {
                title: 'Expert Curation',
                text: 'A carefully selected collection from luxury and niche fragrance brands.',
              },
              {
                title: 'Free Shipping',
                text: 'Free shipping on orders over €90 with fast and secure delivery.',
              },
              {
                title: '30-Day Returns',
                text: 'A flexible return policy designed to make shopping stress-free.',
              },
            ].map((item, index, array) => (
              <div
                key={index}
                className={"flex gap-layout-normal p-layout-sm border border-lemonbalm rounded-xl"}
              >

                <div className="flex flex-col gap-layout-xs">
                  <h3 className="text-body1 font-medium ">
                    {item.title}
                  </h3>

                  <p className="text-body2 text-gray-700 leading-relaxed">
                    {item.text}
                  </p>
                </div>

              </div>
            ))}

          </div>
        </div>

        {/* MISSION */}
        <div className="rounded-xl bg-lemonbalm px-layout-lg py-layout-xl">

          <div className="max-w-3xl flex flex-col gap-layout-sm">

            <p className="text-caption text-gray-200">
              Our Mission
            </p>

            <h2 className="text-heading2 font-display font-bold">
              Helping people discover scents that feel uniquely theirs.
            </h2>

            <p className="text-body2 text-linencloud leading-relaxed">
              We believe fragrance is deeply personal. Our mission is to make
              discovering your perfect scent easier, more inspiring, and more meaningful —
              whether you're exploring perfumes for the first time or building a signature collection.
            </p>

          </div>
        </div>

        {/* CONTACT */}
        <div className="rounded-xl bg-secondary px-layout-lg py-layout-lg">

          <div className="flex flex-col gap-layout-xl">

            <div className="flex flex-col gap-layout-xs">
              <p className="text-caption text-gray-500">
                Contact
              </p>

              <h2 className="text-heading3 font-display font-semibold">
                Get in Touch
              </h2>

              <p className="text-body2 text-gray-600 max-w-xl">
                Have questions about fragrances, orders, or recommendations?
                Our team is here to help.
              </p>
            </div>

            <div className="flex flex-col gap-layout-sm">

              <a
                href="mailto:support@scentra.com"
                className="flex items-center gap-3 text-body2 hover:opacity-70 transition-opacity"
              >
                <MaterialIcon icon="mail" size={20} />
                support@scentra.com
              </a>

              <a
                href="tel:+15551234567"
                className="flex items-center gap-3 text-body2 hover:opacity-70 transition-opacity"
              >
                <MaterialIcon icon="call" size={20} />
                +358 123456789
              </a>

              <div className="flex items-center gap-3 text-body2">
                <MaterialIcon icon="schedule" size={20} />
                Monday – Friday, 9 AM – 5 PM
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutUs;

