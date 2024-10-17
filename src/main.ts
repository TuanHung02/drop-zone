import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './static/fontawesome-free-6.6.0-web/css/all.min.css'
const app = createApp(App)

app.use(createPinia())

app.mount('#app')
