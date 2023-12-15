import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  define: {
    'import.meta.env.APP_VERSION': JSON.stringify(
      process.env.npm_package_version
    )
  }
})
