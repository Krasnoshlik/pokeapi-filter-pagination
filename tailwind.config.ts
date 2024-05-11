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
        'yellow': '#F3CA52',
        'beige': '#F6E9B2',
        'dark-green': '#0A6847',
        'green': '#7ABA78'
      }
    },
  },
};
export default config;