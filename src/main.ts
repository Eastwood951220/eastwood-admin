import {createApp} from 'vue'
import {router, setupRouter} from "@/router";
import {store} from '@/store'
import '@/styles/index.scss'
import App from './App.vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

function bootstrap() {

    const app = createApp(App)
    app.use(store)

    // 配置路由
    app.use(router)
    setupRouter(app)

    app.use(ElementPlus)
    app.mount('#app')
}

bootstrap()

