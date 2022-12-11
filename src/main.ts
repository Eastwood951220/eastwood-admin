import {createApp} from 'vue'
import {router, setupRouter} from "@/router";
import {store} from '@/store'
import App from './App.vue'

// element-plus 配置


// mitt
import mitt from 'mitt'

import 'virtual:svg-icons-register'

function bootstrap() {

    const app = createApp(App)
    app.use(store)

    // 配置路由
    app.use(router)
    setupRouter(app)


    app.mount('#app')
}

bootstrap()

