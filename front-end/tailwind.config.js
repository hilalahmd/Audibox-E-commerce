export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: "#D2FA45",
        brandlight: "#E6F8AA",
      },
      borderRadius: {
        '4xl': '2rem',
      },
      translate: {
        '1/2': '50%',
      },
    },
  },
  plugins: [],
}
