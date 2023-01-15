import {createApp} from 'vue'
import {router, setupRouter} from "@/router";
import {store} from '@/store'
import {setupDirective} from "@/directive";
import App from './App.vue'

// element-plus 配置
import 'element-plus/dist/index.css'

// mitt
import mitt from 'mitt'

import 'virtual:svg-icons-register'
import {installIcon} from '@/plugins/icons'


function bootstrap() {

    const app = createApp(App)
    app.use(store)
    installIcon(app)
    // 配置路由
    app.use(router)
    setupRouter(app)
    // 自定义命令
    setupDirective(app)

    app.mount('#app')
}

bootstrap()

