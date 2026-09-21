import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Enterprise Cybersecurity Palette
        primary: {
          DEFAULT: "#1F3A5F",
          dark: "#17202A",
          accent: "#3B6EA5",
          hover: "#182E4B",
          subtle: "#EFF5FB",
        },
        navy: {
          sidebar: "#17202A",
          active: "#1F3A5F",
          border: "#253342",
          text: "#E2E8F0",
          muted: "#8A99AD",
        },
        appbg: "#F4F6F8",
        surface: "#FFFFFF",
        primarytext: "#17202A",
        secondarytext: "#667085",
        appborder: "#D9DEE5",
        apphover: "#E9EEF3",
        appsuccess: {
          DEFAULT: "#287D55",
          light: "#EAF5EF",
          border: "#C2E2D1",
        },
        appwarning: {
          DEFAULT: "#B7791F",
          light: "#FEF7EC",
          border: "#F7DEBA",
        },
        appdanger: {
          DEFAULT: "#B54747",
          light: "#FDF2F2",
          border: "#F5C7C7",
        },
        appinfo: {
          DEFAULT: "#3B6EA5",
          light: "#EFF5FB",
          border: "#BED7EE",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
      },
      borderRadius: {
        DEFAULT: "8px",
        sm: "6px",
        md: "8px",
        lg: "8px",
        xl: "10px",
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(16, 24, 40, 0.06), 0 1px 2px 0 rgba(16, 24, 40, 0.04)",
        card: "0 1px 3px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
};
export default config;
