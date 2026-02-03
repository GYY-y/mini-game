<script setup>
import { computed, onMounted, watch } from 'vue'
import {
  NConfigProvider,
  NMessageProvider,
  NNotificationProvider,
  darkTheme,
  zhCN,
  dateZhCN,
  enUS,
  dateEnUS
} from 'naive-ui'
import Navigation from '@/components/common/Navigation.vue'
import { useSettingsStore } from '@/stores/settings'

const settingsStore = useSettingsStore()

const theme = computed(() => (settingsStore.theme === 'dark' ? darkTheme : null))

const locale = computed(() => (settingsStore.language === 'en-US' ? enUS : zhCN))
const dateLocale = computed(() => (settingsStore.language === 'en-US' ? dateEnUS : dateZhCN))

const themeOverrides = computed(() => ({
  common: {
    primaryColor: '#DC143C',
    primaryColorHover: '#ff4d4f',
    primaryColorPressed: '#b51228',
    primaryColorSuppl: '#FFD700'
  }
}))

const shellClass = computed(() => ({
  'app-shell': true,
  'app-shell--dark': settingsStore.theme === 'dark',
  'app-shell--light': settingsStore.theme === 'light',
  'app-shell--spring': settingsStore.theme === 'spring-festival'
}))

const applyThemeClass = (themeName) => {
  const body = document.body
  body.classList.remove('theme-dark', 'theme-light', 'theme-spring')
  if (themeName === 'dark') body.classList.add('theme-dark')
  if (themeName === 'light') body.classList.add('theme-light')
  if (themeName === 'spring-festival') body.classList.add('theme-spring')
}

onMounted(() => {
  applyThemeClass(settingsStore.theme)
})

watch(
  () => settingsStore.theme,
  (val) => applyThemeClass(val)
)
</script>

<template>
  <n-config-provider
    :theme="theme"
    :locale="locale"
    :date-locale="dateLocale"
    :theme-overrides="themeOverrides"
  >
    <n-notification-provider>
      <n-message-provider>
        <div :class="shellClass">
          <Navigation />
          <main class="app-main">
            <router-view />
          </main>
        </div>
      </n-message-provider>
    </n-notification-provider>
  </n-config-provider>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  background: radial-gradient(circle at 20% 20%, rgba(255, 215, 0, 0.08), transparent 35%),
    radial-gradient(circle at 80% 0%, rgba(220, 20, 60, 0.1), transparent 30%),
    linear-gradient(145deg, #fff5f5 0%, #fffaf0 40%, #fff5f5 100%);
  color: var(--text-color);
  display: grid;
  grid-template-rows: auto 1fr;
}

.app-main {
  padding: 16px;
  width: min(1200px, 100%);
  margin: 0 auto;
  box-sizing: border-box;
}

.app-shell--dark {
  background: linear-gradient(135deg, #1f1f1f, #141414);
  color: #f5f5f5;
}

.app-shell--light {
  background: #f8f8f8;
}
</style>
