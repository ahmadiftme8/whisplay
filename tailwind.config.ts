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
        amber: {
          glow: '#FFB300',
          dim: '#4A3200',
        },
        metal: {
          light: '#4a4a4a',
          DEFAULT: '#2b2b2b',
          dark: '#1a1a1a',
        },
      },
      boxShadow: {
        'knob': '5px 5px 10px #1a1a1a, -5px -5px 10px #3a3a3a',
        'knob-pressed': 'inset 5px 5px 10px #1a1a1a, inset -5px -5px 10px #3a3a3a',
        'led-glow': '0 0 10px #FFB300, 0 0 20px #FFB300',
      },
    },
  },
  plugins: [],
};
export default config;
