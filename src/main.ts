import {createApp} from 'vue'
import {router, setupRouter} from "@/router";
import {store} from '@/store'
import '@/styles/index.scss'
import App from './App.vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

function bootstrap() {
    const app = createApp(App)

    app.use(ElementPlus)
    app.use(store)
    // 配置路由
    setupRouter(app);
    app.use(router)


    app.mount('#app')
}

bootstrap()

