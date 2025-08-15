// tailwind.config.js
module.exports = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          500: "#00B59B", // سبز برند Satrass
          600: "#00A089",
          700: "#008A75",
          yellow: "#F9BE2C", // زرد برند (اگر خواستی دکمه‌ها رو هم با این بازی بدی)
        },
      },
    },
  },
  darkMode: ["class"], // اختیاری، بد نیست داشته باشیم
  plugins: [],
};