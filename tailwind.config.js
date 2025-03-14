/** @type {import('tailwind').Config} */
import plugin from "tailwindcss/plugin";

export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      margin: {
        320: "320px",
      },
      width: {
        190: "190px",
        275: "275px",
        300: "300px",
        340: "340px",
        350: "350px",
        656: "656px",
        880: "880px",
        508: "508px",
      },
      height: {
        80: "80px",
        340: "340px",
        370: "370px",
        420: "420px",
        510: "510px",
        600: "600px",
        685: "685px",
        800: "800px",
        "90vh": "90vh",
      },
      flex: {
        0.7: "0.7 1 0%",
      },
      maxHeight: {
        370: "370px",
      },
      minHeight: {
        210: "210px",
        350: "350px",
        470: "470px",
        620: "620px",
      },
      minWidth: {
        210: "210px",
        350: "350px",
        470: "470px",
        620: "620px",
      },
      transitionDuration: {
        20: "20ms",
        40: "40ms",
      },
      textColor: {
        lightGray: "#F1EFEE",
        primary: "#FAFAFA",
        secColor: "#efefef",
        navColor: "#BEBEBE",
      },
      backgroundColor: {
        mainColor: "#FBF8F9",
        secondaryColor: "#F0F0F0",
        blackOverlay: "rgba(0, 0 ,0 ,0.7)",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      scale: {
        102: "1.02",
      },
      transitionProperty: {
        height: "height",
      },
      cursor: {
        "zoom-in": "zoom-in",
        pointer: "pointer",
      },
      // Note: Animation configs are now moved to CSS using @theme directive
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-hidden::-webkit-scrollbar": {
          display: "none",
        },
        ".scrollbar-hidden": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        },
        ".custom-scrollbar": {
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#E5E7EB",
            borderRadius: "4px",
          },
          "scrollbar-width": "thin",
          "scrollbar-color": "#E5E7EB transparent",
        },
      });
    }),
  ],
};
