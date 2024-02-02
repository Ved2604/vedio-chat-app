import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import  { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
    VitePWA( {manifest: { 
      "name": "Vedio call application",
      "short_name": "Ve_call",
      "description": "This is an app to for vedio calling between two peers.",
      "start_url": "/",
      "display": "standalone",
      "background_color": "#121212",
      "theme_color": "#4CAF50",
      "icons": [
          { 
            "src":"maskable_icon.png",
            "sizes":"240x240",
            "type": "image/png",
            "purpose": "any maskable"
          },
        { 
          "src": "logo512.png",
          "sizes": "512x512",
          "type": "image/png"
        },
        {
          "src": "logo384.png",
          "sizes": "384x384",
          "type": "image/png"
        },
        {
          "src": "logo256.png",
          "sizes": "256x256",
          "type": "image/png"
        },
        {
          "src": "logo192.png",
          "sizes": "192x192",
          "type": "image/png"
        }
      ]
    }
  }
    )
  ],
})
