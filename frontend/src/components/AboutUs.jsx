import MaterialIcon from './common/MaterialIcon';

const AboutUs = () => {

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

