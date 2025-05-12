module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
  ],
  darkMode: "class",
  theme: {
    fontFamily: {
      roboto: ["Roboto", "sans-serif"],
      merriweather: ["Merriweather"],
      sans: [
        "Inter",
        "system-ui",
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        '"Noto Sans"',
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
        '"Noto Color Emoji"',
      ],
      helvetica: ["Helvetica Neue"],
      arial: ["Arial"],
      display: ["Open Sans", "sans-serif", "Calibri"],
      body: ["Open Sans", "sans-serif", "Calibri"],
      "google-ads": ["Roboto", "Open Sans", "sans-serif"], // Added for Google Ads style
    },
    extend: {
      animation: {
        ellipsis: "ellipsis 1.5s steps(4, end) infinite",
      },
      keyframes: {
        ellipsis: {
          "0%": { content: '""' },
          "25%": { content: '"."' },
          "50%": { content: '".."' },
          "75%": { content: '"..."' },
          "100%": { content: '""' },
        },
      },
      fontSize: {
        14: "14px",
      },
      backgroundColor: {
        "main-bg": "#FAFBFB",
        "main-dark-bg": "#20232A",
        "secondary-dark-bg": "#33373E",
        "light-gray": "#F7F7F7",
        "half-transparent": "rgba(0, 0, 0, 0.5)",
      },
      borderWidth: {
        1: "1px",
      },
      borderColor: {
        color: "rgba(0, 0, 0, 0.1)",
      },
      width: {
        400: "400px",
        760: "760px",
        780: "780px",
        800: "800px",
        1000: "1000px",
        1200: "1200px",
        1400: "1400px",
      },
      height: {
        80: "80px",
      },
      minHeight: {
        590: "590px",
      },
      backgroundImage: {
        "hero-pattern": "url('https://i.ibb.co/MkvLDfb/Rectangle-4389.png')",
      },
    },
  },
  plugins: [],
};
