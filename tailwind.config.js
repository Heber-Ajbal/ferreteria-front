export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
    "./node_modules/flowbite-vue/**/*.{js,vue,ts,jsx,tsx}", 
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [
    require("flowbite/plugin"),
  ],
};
