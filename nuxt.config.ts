import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  // devtools: { enabled: true },
  nitro: {
    devProxy: {
      '/ws': {  // 使用 /ws 作为代理路径
        target: 'ws://localhost:8080', // 目标 WebSocket 服务器的 URL
        ws: true,  // 开启 WebSocket 支持
        changeOrigin: true,  // 更改原始主机头为目标 URL 的主机头
        prependPath: false
      }
    }
  },
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    //...
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
})
