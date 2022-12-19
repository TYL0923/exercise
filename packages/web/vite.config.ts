import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import ComponentS from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import Unocss from 'unocss/vite'
import { presetAttributify, presetIcons, presetUno } from 'unocss'
const pathSrc = path.resolve(__dirname, 'src')

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue(),
    Pages(),
    Unocss({
      presets: [presetIcons(), presetAttributify(), presetUno()],
    }),
    ComponentS({
      dts: path.resolve(pathSrc, 'typings/components.d.ts'),
      resolvers: [
        AntDesignVueResolver({ importStyle: false, resolveIcons: true }),
      ],
    }),
    AutoImport({
      imports: ['vue', 'vue-router'],
      dirs: [path.resolve(pathSrc, 'composables')],
      dts: path.resolve(pathSrc, 'typings/auto-import.d.ts'),
    }),
  ],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
})
