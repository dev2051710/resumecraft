/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#09090B',
        sidebar: '#111114',
        card: '#18181B',
        field: '#0F0F12',
        line: '#27272A',
        accent: '#8B5CF6',
        accent2: '#3B82F6',
        ink: '#FAFAFA',
        muted: '#A1A1AA',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
