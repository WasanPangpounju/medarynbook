import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: "#4E7358",
        "sage-mid": "#7A9E82",
        "sage-light": "#EBF2EC",
        cream: "#F7F4EE",
        ink: "#1C1C1A",
        muted: "#6B6B65",
      },
    },
  },
} satisfies Config;
