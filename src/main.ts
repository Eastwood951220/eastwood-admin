import {createApp} from 'vue'
import {router, setupRouter} from "@/router";
import {store} from '@/store'
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


    app.mount('#app')
}

bootstrap()

