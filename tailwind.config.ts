import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brown: {
          50: '#fdf8f6',
          100: '#f5e6d3',
          200: '#e8c9a7',
          300: '#d9a97a',
          400: '#c88a53',
          500: '#b06d3a',
          600: '#8b5729',
          700: '#6F4E37',
          800: '#5a3d2c',
          900: '#3d2a1f',
        },
        cream: '#F5E6D3',
        leaf: {
          50: '#f2f9ed',
          100: '#e2f2d8',
          200: '#c5e5b1',
          300: '#9ed180',
          400: '#75b951',
          500: '#569c38',
          600: '#2E5A1C',
          700: '#2a4f19',
          800: '#233f15',
          900: '#1d3512',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
