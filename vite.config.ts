import {defineConfig, loadEnv} from 'vite'
import type {UserConfig, ConfigEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import {resolve} from 'path'
import {createPlugin} from 'vite-plugin-autogeneration-import-file';
// API 自动引入
import AutoImport from 'unplugin-auto-import/vite'
// 组建自动引入
import Components from 'unplugin-vue-components/vite';
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers';
// setup 插件
import vueSetupExtend from 'vite-plugin-vue-setup-extend'

// https://vitejs.dev/config/

function pathResolve(dir: string) {
    return resolve(__dirname, '.', dir);
}

const {autoImport, resolver} = createPlugin();
export default defineConfig(({command, mode}: ConfigEnv): UserConfig => {
    console.log(command, mode, '===')
    const root = process.cwd()
    const env = loadEnv(mode, root) // 环境变量对象
    const isDebugger = env.VITE_APP_IS_DEBUGGER === 'true'
    console.log('环境变量------', env)
    console.log('文件路径（ process.cwd()）------', root)
    console.log('文件路径（dirname）------', __dirname + '/src')
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
                dts: "types/auto-import.d.ts"
            }),
            Components({
                include: [],
                dts: false,
                resolvers: [
                    ElementPlusResolver({importStyle: false})
                ],
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
                    rewrite: path => path.replace(/^\/api/, '')
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
                '#t': resolve(__dirname, 'types')
            }
        },
        // 测试环境保留打印
        esbuild: {
            pure: isDebugger ? ['console.log', 'debugger'] : []
        },
    }
})
