
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-persistedstate-plugin'

const pinia = createPinia()
const app = createApp(App)
const persist = createPersistedState()
pinia.use(persist)
app.use(pinia)
app.use(ElementPlus)
app.use(router)

app.mount('#app')
