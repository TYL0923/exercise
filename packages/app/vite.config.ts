// import path from 'path'
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import Unocss from 'unocss/vite'
// import AutoImport from 'unplugin-auto-import/vite'
// import Component from 'unplugin-vue-components/vite'
// const pathSrc = path.resolve(__dirname, 'src')
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
    Unocss(),
    // AutoImport({
    //   imports: ['vue'],
    //   dts: path.resolve(pathSrc, 'typings/auto-import.d.ts'),
    // }),
    // Component({
    // }),
  ],

})
