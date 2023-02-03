import path from 'path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Unocss from 'unocss/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import Component from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { presetAttributify, presetIcons, presetUno } from 'unocss'
const pathSrc = path.resolve(__dirname, 'src')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Vue(),
    Pages(),
    Unocss({
      presets: [presetIcons(), presetAttributify(), presetUno()],
    }),
    AutoImport({
      imports: ['vue', 'vue-router'],
      dirs: [path.resolve(pathSrc, 'composables/**')],
      dts: path.resolve(pathSrc, 'typings/auto-import.d.ts'),
    }),
    Component({
      resolvers: [VantResolver({ importStyle: false })],
      dts: path.resolve(pathSrc, 'typings/components.d.ts'),
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
