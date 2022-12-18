// import path from 'path'
import path from 'path'
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import Unocss from 'unocss/vite'
// import { VantResolver } from 'unplugin-vue-components/resolvers'
// import Component from 'unplugin-vue-components/vite'
// import styleImport, { VantResolve } from 'vite-plugin-style-import'
// import AutoImport from 'unplugin-auto-import/vite'
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
    // styleImport({
    //   resolves: [VantResolve()],
    //   libs: [
    //     {
    //       libraryName: 'vant',
    //       esModule: true,
    //       resolveStyle: name => `../es/${name}/style`,
    //     },
    //   ],
    // }),
    // Component({ resolvers: [VantResolver()] }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
