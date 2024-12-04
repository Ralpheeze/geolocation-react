import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  base: "/geolocation-react/",
  plugins: [react()],
  // build: {
  //   outDir: 'dist', // Default output directory
  // },
  
  // server: {
  //   https: false,
  // },
});