<script setup>
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useText } from '@/utils/i18n'

const { t } = useText()

const links = computed(() => [
  { name: 'home', label: t('首页', 'Home'), path: '/' },
  { name: 'game-hub', label: t('小游戏', 'Games'), path: '/games' },
  { name: 'settings', label: t('设置', 'Settings'), path: '/settings' }
])

const route = useRoute()
const activePath = computed(() => route.path)

const isActive = (path) => {
  if (path === '/') return activePath.value === '/'
  return activePath.value.startsWith(path)
}
</script>

<template>
  <header class="nav">
    <div class="nav__brand">
      <span class="nav__logo">🧧</span>
      <div>
        <div class="nav__title">春节小游戏集合</div>
        <div class="nav__subtitle">Dice · Coin · Wheel</div>
      </div>
    </div>
    <nav class="nav__links">
      <RouterLink
        v-for="link in links"
        :key="link.name"
        :to="link.path"
        class="nav__link"
        :data-active="isActive(link.path)"
      >
        {{ link.label }}
      </RouterLink>
    </nav>
  </header>
</template>

<style scoped>
.nav {
  width: 100%;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(255, 245, 245, 0.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-color);
}

.nav__brand {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--text-color);
}

.nav__logo {
  font-size: 28px;
}

.nav__title {
  font-weight: 700;
}

.nav__subtitle {
  font-size: 12px;
  color: var(--muted-text);
}

.nav__links {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav__link {
  padding: 10px 14px;
  border-radius: 12px;
  color: var(--text-color);
  border: 1px solid transparent;
  transition: all 200ms ease;
  font-weight: 600;
}

.nav__link:hover {
  background: var(--surface-contrast);
  border-color: var(--border-color);
}

.nav__link[data-active='true'] {
  background: var(--primary-color);
  color: #fff;
  box-shadow: var(--shadow-soft);
}
</style>
