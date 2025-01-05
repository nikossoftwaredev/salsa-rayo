import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: "#282929",
        purple: "#7737b8",
        yellow: "#DEBE54",
      },
      fontFamily: {
        custom: ["faculty", "roboto", "custom-font", "sans-serif"], // Replace 'CustomFontName' with the actual font name
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        forest: {
          ...require("daisyui/src/theming/themes")["forest"],
          primary: "#18A07B",
          accent: "#7737b8",
        },
      },
    ],
  },
};
export default config;
