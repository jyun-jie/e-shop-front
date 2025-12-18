
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import { createPersistedState } from 'pinia-persistedstate-plugin'
import '@/style/aside.css'
import '@/style/header.css'
import '@/style/main.css'
import '@/style/footer.css'

const app = createApp(App)
const pinia = createPinia()

const persist = createPersistedState()
pinia.use(persist)
app.use(pinia)
app.use(ElementPlus)
app.use(router)

app.mount('#app')
