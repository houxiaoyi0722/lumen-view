import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import path from "path";
import viteSvgIcons from "vite-plugin-svg-icons";
import {
  createStyleImportPlugin,
  VxeTableResolve,
} from "vite-plugin-style-import";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    viteSvgIcons({
      // 指定需要缓存的图标文件夹
      iconDirs: [path.resolve(__dirname, "src/assets/svg")],
      // 指定symbolId格式
      symbolId: "icon-[dir]-[name]",
    }),
    createStyleImportPlugin({
      resolves: [VxeTableResolve()],
    }),
  ],
  server: {
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:8080", // 后端接口的域名
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 全局变量
        additionalData: '@import "./src/assets/style/global-variables.scss";',
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
