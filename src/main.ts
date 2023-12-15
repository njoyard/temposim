import '@fortawesome/fontawesome-free/css/all.css'

import { createApp } from 'vue'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, fa } from 'vuetify/iconsets/fa'

import './style.scss'
import App from './App.vue'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'fa',
    aliases,
    sets: {
      fa
    }
  },
  theme: {
    defaultTheme: 'light'
  }
})

const app = createApp(App)

app.use(vuetify)

app.mount('#app')
