import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import { createPinia } from 'pinia'

import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-message-box.css'

import 'xterm/dist/xterm.css'

import echarts from './utils/echarts'

import JsonViewer from 'vue3-json-viewer'
import 'vue3-json-viewer/dist/index.css'

import SvgIcon from './components/SvgIcon.vue'
import './assets/iconfont/iconfont.js'
import '@/assets/iconfont/iconfont_drawer.js'

// createApp(App).mount('#app')
const pinia = createPinia()
const app = createApp(App)

import copys from './directives/v-copy.js'
app.directive('copy', copys)

app.config.globalProperties.$echarts = echarts

app.component('SvgIcon', SvgIcon)

app.use(router)
app.use(pinia)
app.use(JsonViewer)
import './permission'

app.mount('#app')
