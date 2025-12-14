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
                    glow: "#bf572b", // Rust Orange
                    dim: "#4a2c20",
                },
                museum: {
                    DEFAULT: "#2c2c2c", // Main Background
                    card: "#383838", // Header/Card BG
                    highlight: "#404040",
                    sliderEmpty: "#555555",
                    sliderFilled: "#151515", // Black active part
                },
                metal: {
                    light: "#e0e0e0",
                    DEFAULT: "#888888",
                    dark: "#1a1a1a",
                },
            },
            boxShadow: {
                'knob': '5px 5px 10px #1a1a1a, -5px -5px 10px #3a3a3a',
                'knob-pressed': 'inset 5px 5px 10px #1a1a1a, inset -5px -5px 10px #3a3a3a',
                'led-glow': '0 0 10px #bf572b, 0 0 20px #bf572b',
            },
        },
    },
    plugins: [],
};
export default config;
