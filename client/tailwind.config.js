/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust this path according to your project structure
  ],
  theme: {
    extend: {
      colors: {
        'glass-bg': 'rgba(255, 255, 255, 0.9)', // Background with a frosted glass effect
        'glass-blur': 'rgba(255, 255, 255, 0.6)', // Backdrop blur effect
        'primary-text': '#333333', // Dark gray text color
        'primary-accent': '#1A73E8', // Vibrant blue accent color
        'secondary-accent': '#E8EAF6', // Light lavender secondary accent
        'grid-item-bg': '#F8F9FA', // Light gray background for grid items
        'error-toast': '#E53935', // Red color for error toast
      },
      backgroundImage: {
        'glass': 'rgba(255, 255, 255, 0.8)',
      },
      backdropBlur: {
        'glass-blur': 'blur(10px)',
      },
    },
  },
  plugins: [],
};
