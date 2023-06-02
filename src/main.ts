import '@fontsource/inter'
import '@fontsource/inter/600.css'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/src/message-box.scss'
import 'element-plus/theme-chalk/src/message.scss'
import './assets/styles/index.scss'
import './assets/styles/styles.css'
import './shared/plugins/axios'
import './shared/plugins/dayjs'

import { createApp } from 'vue'
import App from './App.vue'
import { pinia } from './shared/plugins/pinia'
import { router } from './shared/plugins/router'
import { i18n } from './shared/plugins/vue-i18n'

const app = createApp(App)

app.use(pinia).use(router).use(i18n)

app.mount('#app')
