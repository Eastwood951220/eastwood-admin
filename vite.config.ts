import {defineConfig, loadEnv} from 'vite'
import type {UserConfig, ConfigEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import {resolve} from 'path'
import {createPlugin} from 'vite-plugin-autogeneration-import-file';
// API 自动引入
import AutoImport from 'unplugin-auto-import/vite'
// 组建自动引入
import Components from 'unplugin-vue-components/vite';
import {createStyleImportPlugin, ElementPlusResolve as ElementPlusStyleResolve} from "vite-plugin-style-import";
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers';
// setup 插件
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
// index.html 控制
import {createHtmlPlugin} from 'vite-plugin-html'
// 自定义SVG
import {createSvgIconsPlugin} from 'vite-plugin-svg-icons'

import autoprefixer from 'autoprefixer';

// https://vitejs.dev/config/

function pathResolve(dir: string) {
    return resolve(__dirname, '.', dir);
}

const {autoImport, resolver} = createPlugin();
export default defineConfig(({command, mode}: ConfigEnv): UserConfig => {
    console.log(command, mode)
    const root = process.cwd()
    const env = loadEnv(mode, root) // 环境变量对象
    const isDebugger = env.VITE_APP_IS_DEBUGGER === 'true'
    console.log('环境变量------', env)
    console.log('文件路径（ process.cwd()）------', root)
    console.log('文件路径（dirname）------', __dirname + '/src')
    // @ts-ignore
    return {
        root,
        base: '/',
        publicDir: pathResolve('dist'),
        assetsInclude: pathResolve('src/assets'),
        // ******插件配置******
        plugins: [
            vue(),
            vueSetupExtend(),
            AutoImport({
                imports: [
                    'vue',
                    'vue-router'
                ],
                dts: "types/auto-import.d.ts",
            }),
            Components({
                dts: "types/components.d.ts",
                resolvers: [ElementPlusResolver({importStyle: false})],
            }),
            /*     createStyleImportPlugin({
                     resolves: [ElementPlusStyleResolve()],
                     libs: [
                         {
                             libraryName: 'element-plus',
                             esModule: true,
                             resolveStyle: (name: string) => {
                                 return `element-plus/theme-chalk/${name}.css`
                             },
                         },
                     ]
                 }),*/
            createHtmlPlugin({
                minify: false,
                entry: '/src/main.ts',
                template: '/public/index.html',
                inject: {
                    data: {
                        title: env.VITE_APP_TITLE,
                        icon: '/public/vite.svg'
                    },
                },
            }),
            createSvgIconsPlugin({
                // 指定需要缓存的图标文件夹
                iconDirs: [resolve(root, 'src/assets/icons/svg')],
                // 指定symbolId格式
                symbolId: 'icon-[dir]-[name]',
            })
        ],
        // ******开发服务器配置******
        server: {
            https: false,
            host: true,
            port: 3000,
            open: true,
            cors: false,
            proxy: {
                [env.VITE_APP_BASE_URL]: {
                    target: env.VITE_APP_REQUEST_URL,
                    changeOrigin: true, //是否跨域
                    rewrite: path => path.replace(new RegExp(`^${env.VITE_APP_BASE_URL}`), '')
                },
            }
        },
        // ******项目构建配置******
        build: {
            target: 'modules',
            outDir: 'dist',
            assetsDir: 'assets', // 静态资源得存放路径文件名  assets
            sourcemap: false, //构建后是否生成 source map 文件
            minify: 'esbuild', // 项目压缩 :boolean | 'terser' | 'esbuild'
            chunkSizeWarningLimit: 102400, //chunk 大小警告的限制（以 kbs 为单位）默认：500
            cssTarget: 'chrome61'
        },
        resolve: {
            alias: {
                // 别名配置
                '@': resolve(__dirname, 'src'),
                '#': resolve(__dirname, 'types')
            }
        },
        // 测试环境保留打印
        esbuild: {
            pure: isDebugger ? ['console.log', 'debugger'] : []
        },
        // 全局样式
        css: {
            postcss: {
                plugins: [
                    autoprefixer({
                        overrideBrowserslist: [
                            "defaults",
                            "not ie <= 8",
                            "last 2 versions",
                            "> 1%",
                            "iOS >= 7",
                            "Android >= 4.0"
                        ],
                        grid: true
                    }),
                ]
            },
            preprocessorOptions: {
                scss: {
                    javascriptEnabled: true,
                    additionalData: '@import "@/assets/styles/index.scss";'
                }
            }
        }
    }
})
