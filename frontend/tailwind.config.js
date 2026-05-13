/** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,jsx,ts,tsx}",
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Base Colors
        whitesand: "#E7E7DD",
        stargold: "#E4C062",
        almondsuede: "#CEC0B3",
        lightalmondsuede: "#E7DFD9",
        white: "#FFFFFF",
        neutral: {
          100: "#E4E4E4",
          200: "#A3A3A3",
          300: "#707070",
        },
        black: "#262626",
        fullblack: "#000000",

        green: "#4DCB88",
        darkgreen: "#102F15",
        red: "#CB4D4D",
        darkred: "#2F1010",
        yellow: "#E9CC58",
        darkyellow: "#2E2F10",
        blue: "#4FA0D9",
        darkblue: "#10232F",

        linencloud: "#F8F9ED",
        lemonbalm: "#7FA85A",
        khaki: "#FAF8F5",

        // Semantic / Branding
        primary: "#262626",
        secondary: "#FAF8F5",

        success: {
          text: "#102F15",
          bg: "#4DCB88",
        },
        error: {
          text: "#2F1010",
          bg: "#CB4D4D",
        },
        warning: {
          text: "#2E2F10",
          bg: "#E9CC58",
        },
        info: {
          text: "#10232F",
          bg: "#4FA0D9",
        },

        star: "#E4C062",

        season:{
          spring: "#FFA6A8",
          summer: "#FBEA79",
          autumn: "#FFC180",
          winter: "#ADE4FF",
          allyear: "#BBEB9F",
        },
        accord: {
          floral: "#FFD8E4",
          fruity: "#FFF3BE",
          woody: "#E7C8B0",
          spicy: "#FFD6AD",
          fresh: "#E1F3FF",
          green: "#D4F2C8",
          aquatic: "#C9F0F9",
          musky: "#F0F0FF",
          oriental: "#ECD7FF",
        },

        processing:{
          text: "#262626",
          bg:"#E4E4E4"
        },
        confirmed:{
          text: "#10232F",
          bg:"#DCF4FA"
        },
        shipped:{
          text: "#2E2F10",
          bg:"#F9FADC"
        },
        delivered:{
          text: "#102F15",
          bg:"#EBFADC"
        },
        cancelled:{
          text: "#2F1010",
          bg:"#FADCDC"
        },
      },
      fontFamily: {
        sans: ["Montserrat", "sans-serif"],
        heading: ["Playfair Display", "serif"],
        display: ["Playfair Display SC", "serif"],
      },
      fontSize: {
        number: "var(--font-number)",
        heading1: "var(--font-heading1)",
        heading2: "var(--font-heading2)",
        heading3: "var(--font-heading3)",
        body1: "var(--font-body1)",
        body2: "var(--font-body2)",
        caption: "var(--font-caption)",
        overline: "var(--font-overline)",
      },
      spacing: {
        'layout-xxs': 'var(--layout-xxs)',
        'layout-xs': 'var(--layout-xs)',
        'layout-sm': 'var(--layout-sm)',
        'layout-normal': 'var(--layout-normal)',
        'layout-lg': 'var(--layout-lg)',
        'layout-xl': 'var(--layout-xl)',
        'homepage-margin-x': 'var(--homepage-margin-x)',
        'homepage-gap-btw-sections': 'var(--homepage-gap-btw-sections)',
        'pdp-gap-btw-sections': 'var(--pdp-gap-btw-sections)',
        'button-padding-sm': 'var(--button-padding-sm)',
        'button-padding-md': 'var(--button-padding-md)',
        'button-padding-lg': 'var(--button-padding-lg)',
        'button-gap-sm': 'var(--button-gap-sm)',
        'button-gap-md': 'var(--button-gap-md)',
        'button-gap-lg': 'var(--button-gap-lg)',
        'paragraph-line-height': 'var(--paragraph-line-height)',
      },
    },
  },
  plugins: [],
};
