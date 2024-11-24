// vite.config.ts
import { defineApplicationConfig } from "file:///D:/lastmile/lastMileCode/internal/vite-config/dist/index.mjs";
var vite_config_default = defineApplicationConfig({
  overrides: {
    optimizeDeps: {
      include: [
        "echarts/core",
        "echarts/charts",
        "echarts/components",
        "echarts/renderers",
        "qrcode",
        "@iconify/iconify",
        "ant-design-vue/es/locale/zh_CN",
        "ant-design-vue/es/locale/en_US"
      ]
    },
    server: {
      proxy: {
        "/api": {
          target: "http://lastmile.fun:8080",
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(new RegExp(`^/api`), "/api"),
          bypass(req, res, options) {
            const proxyURL = options.target + options.rewrite(req.url);
            console.log("proxyURL", proxyURL);
          }
        }
      },
      open: true,
      // 项目启动后，自动打开
      warmup: {
        clientFiles: ["./index.html", "./src/{views,components}/*"]
      }
    },
    build: {
      target: "esnext"
    }
    // css: {
    //   postcss: {
    //     plugins: [
    //       postCssPxToRem({
    //         rootValue: 75, // （设计稿/10）1rem的大小
    //         propList: ['*', '!border', '!font-size'], // 除 border/font-size 外所有px 转 rem
    //       }),
    //     ],
    //   },
    // },
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxsYXN0bWlsZVxcXFxsYXN0TWlsZUNvZGVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXGxhc3RtaWxlXFxcXGxhc3RNaWxlQ29kZVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovbGFzdG1pbGUvbGFzdE1pbGVDb2RlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQXBwbGljYXRpb25Db25maWcgfSBmcm9tICdAdmJlbi92aXRlLWNvbmZpZyc7XG4vLyBpbXBvcnQgcG9zdENzc1B4VG9SZW0gZnJvbSAncG9zdGNzcy1weHRvcmVtJztcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQXBwbGljYXRpb25Db25maWcoe1xuICBvdmVycmlkZXM6IHtcbiAgICBvcHRpbWl6ZURlcHM6IHtcbiAgICAgIGluY2x1ZGU6IFtcbiAgICAgICAgJ2VjaGFydHMvY29yZScsXG4gICAgICAgICdlY2hhcnRzL2NoYXJ0cycsXG4gICAgICAgICdlY2hhcnRzL2NvbXBvbmVudHMnLFxuICAgICAgICAnZWNoYXJ0cy9yZW5kZXJlcnMnLFxuICAgICAgICAncXJjb2RlJyxcbiAgICAgICAgJ0BpY29uaWZ5L2ljb25pZnknLFxuICAgICAgICAnYW50LWRlc2lnbi12dWUvZXMvbG9jYWxlL3poX0NOJyxcbiAgICAgICAgJ2FudC1kZXNpZ24tdnVlL2VzL2xvY2FsZS9lbl9VUycsXG4gICAgICBdLFxuICAgIH0sXG4gICAgc2VydmVyOiB7XG4gICAgICBwcm94eToge1xuICAgICAgICAnL2FwaSc6IHtcbiAgICAgICAgICB0YXJnZXQ6ICdodHRwOi8vbGFzdG1pbGUuZnVuOjgwODAnLFxuICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgICB3czogdHJ1ZSxcbiAgICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKG5ldyBSZWdFeHAoYF4vYXBpYCksICcvYXBpJyksXG4gICAgICAgICAgYnlwYXNzKHJlcSwgcmVzLCBvcHRpb25zOiBhbnkpIHtcbiAgICAgICAgICAgIGNvbnN0IHByb3h5VVJMID0gb3B0aW9ucy50YXJnZXQgKyBvcHRpb25zLnJld3JpdGUocmVxLnVybCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygncHJveHlVUkwnLCBwcm94eVVSTCk7XG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBvcGVuOiB0cnVlLCAvLyBcdTk4NzlcdTc2RUVcdTU0MkZcdTUyQThcdTU0MEVcdUZGMENcdTgxRUFcdTUyQThcdTYyNTNcdTVGMDBcbiAgICAgIHdhcm11cDoge1xuICAgICAgICBjbGllbnRGaWxlczogWycuL2luZGV4Lmh0bWwnLCAnLi9zcmMve3ZpZXdzLGNvbXBvbmVudHN9LyonXSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBidWlsZDoge1xuICAgICAgdGFyZ2V0OiAnZXNuZXh0JyxcbiAgICB9LFxuICAgIC8vIGNzczoge1xuICAgIC8vICAgcG9zdGNzczoge1xuICAgIC8vICAgICBwbHVnaW5zOiBbXG4gICAgLy8gICAgICAgcG9zdENzc1B4VG9SZW0oe1xuICAgIC8vICAgICAgICAgcm9vdFZhbHVlOiA3NSwgLy8gXHVGRjA4XHU4QkJFXHU4QkExXHU3QTNGLzEwXHVGRjA5MXJlbVx1NzY4NFx1NTkyN1x1NUMwRlxuICAgIC8vICAgICAgICAgcHJvcExpc3Q6IFsnKicsICchYm9yZGVyJywgJyFmb250LXNpemUnXSwgLy8gXHU5NjY0IGJvcmRlci9mb250LXNpemUgXHU1OTE2XHU2MjQwXHU2NzA5cHggXHU4RjZDIHJlbVxuICAgIC8vICAgICAgIH0pLFxuICAgIC8vICAgICBdLFxuICAgIC8vICAgfSxcbiAgICAvLyB9LFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWdRLFNBQVMsK0JBQStCO0FBR3hTLElBQU8sc0JBQVEsd0JBQXdCO0FBQUEsRUFDckMsV0FBVztBQUFBLElBQ1QsY0FBYztBQUFBLE1BQ1osU0FBUztBQUFBLFFBQ1A7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLFFBQVE7QUFBQSxNQUNOLE9BQU87QUFBQSxRQUNMLFFBQVE7QUFBQSxVQUNOLFFBQVE7QUFBQSxVQUNSLGNBQWM7QUFBQSxVQUNkLElBQUk7QUFBQSxVQUNKLFNBQVMsQ0FBQyxTQUFTLEtBQUssUUFBUSxJQUFJLE9BQU8sT0FBTyxHQUFHLE1BQU07QUFBQSxVQUMzRCxPQUFPLEtBQUssS0FBSyxTQUFjO0FBQzdCLGtCQUFNLFdBQVcsUUFBUSxTQUFTLFFBQVEsUUFBUSxJQUFJLEdBQUc7QUFDekQsb0JBQVEsSUFBSSxZQUFZLFFBQVE7QUFBQSxVQUNsQztBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsTUFDQSxNQUFNO0FBQUE7QUFBQSxNQUNOLFFBQVE7QUFBQSxRQUNOLGFBQWEsQ0FBQyxnQkFBZ0IsNEJBQTRCO0FBQUEsTUFDNUQ7QUFBQSxJQUNGO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsSUFDVjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFXRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
