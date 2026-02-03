<script setup>
import { computed } from 'vue'
import { NSelect, NSwitch, NButton } from 'naive-ui'
import SoundToggle from '@/components/common/SoundToggle.vue'
import { useSettingsStore } from '@/stores/settings'
import { useText } from '@/utils/i18n'

const settingsStore = useSettingsStore()
const { t } = useText()

const themeOptions = computed(() => [
  { label: t('春节主题', 'Spring Festival'), value: 'spring-festival' },
  { label: t('浅色', 'Light'), value: 'light' }
])

const languageOptions = computed(() => [
  { label: '中文', value: 'zh-CN' },
  { label: 'English', value: 'en-US' }
])

const theme = computed({
  get: () => settingsStore.theme,
  set: (value) => settingsStore.setTheme(value)
})

const language = computed({
  get: () => settingsStore.language,
  set: (value) => settingsStore.setLanguage(value)
})
</script>

<template>
  <section class="settings fade-in-up">
    <header class="card-surface settings__header">
      <div>
        <p class="eyebrow">{{ t('全局设置', 'Settings') }}</p>
        <h1>{{ t('个性化体验', 'Personalize experience') }}</h1>
        <p class="subtitle">
          {{ t('调整主题、语言、音效和动画，满足不同设备场景。', 'Tune theme, language, sound and animations.') }}
        </p>
        <div class="settings__tags">
          <span class="tag">{{ t('多种主题', '3 themes') }}</span>
          <span class="tag">{{ t('双语界面', 'Dual language') }}</span>
          <span class="tag">{{ t('本地存储', 'Local storage') }}</span>
        </div>
      </div>
      <div class="settings__summary card-surface">
        <div class="summary-row">
          <span>{{ t('当前主题', 'Theme') }}</span>
          <strong>{{ theme }}</strong>
        </div>
        <div class="summary-row">
          <span>{{ t('语言', 'Language') }}</span>
          <strong>{{ language }}</strong>
        </div>
        <div class="summary-row">
          <span>{{ t('动画', 'Animations') }}</span>
          <strong>{{ settingsStore.animations ? t('开启', 'On') : t('关闭', 'Off') }}</strong>
        </div>
      </div>
    </header>

    <div class="settings__grid">
      <div class="settings__stack">
        <div class="settings__card card-surface">
          <h3>{{ t('主题与语言', 'Theme & Language') }}</h3>
          <div class="form-row">
            <span>{{ t('主题风格', 'Theme') }}</span>
            <n-select v-model:value="theme" class="compact-select" size="small" :options="themeOptions" />
          </div>
          <div class="form-row">
            <span>{{ t('界面语言', 'Language') }}</span>
            <n-select v-model:value="language" class="compact-select" size="small" :options="languageOptions" />
          </div>
        </div>

        <div class="settings__block">
          <h3>{{ t('音效与动画', 'Sound & Animations') }}</h3>
          <div class="form-row form-row--inline sound-row">
            <SoundToggle plain />
          </div>
          <div class="form-row form-row--inline">
            <span>{{ t('动画效果', 'Animations') }}</span>
            <n-switch :value="settingsStore.animations" @update:value="settingsStore.toggleAnimations()" />
          </div>
        </div>
      </div>

      <div class="settings__card card-surface">
        <h3>{{ t('数据管理', 'Data') }}</h3>
        <p class="subtitle">{{ t('清除设置将恢复默认。', 'Reset to default settings.') }}</p>
        <n-button tertiary type="error" @click="settingsStore.reset()">
          {{ t('恢复默认', 'Reset') }}
        </n-button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.settings {
  display: grid;
  gap: 16px;
}

.settings__header {
  padding: 18px;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 14px;
}

.settings__grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 16px;
}

.settings__card {
  padding: 16px;
  display: grid;
  gap: 12px;
}

.settings__stack {
  display: grid;
  gap: 12px;
}

.form-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.settings__tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 10px;
}

.tag {
  padding: 6px 10px;
  border-radius: 10px;
  background: #fff;
  border: 1px solid var(--border-color);
  font-size: 12px;
  color: var(--muted-text);
}

.settings__summary {
  padding: 12px;
  background: linear-gradient(135deg, #fff7f7, #fff);
  border: 1px solid var(--border-color);
  display: grid;
  gap: 8px;
}

.summary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  color: var(--muted-text);
}

.summary-row strong {
  color: var(--text-color);
}

.settings__block {
  padding: 12px;
  display: grid;
  gap: 10px;
  background: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 14px;
}

.form-row--inline {
  justify-content: flex-start;
  gap: 10px;
}

.sound-row {
  justify-content: flex-start;
}

.compact-select {
  width: 140px;
  min-width: 120px;
  max-width: 160px;
  flex-shrink: 0;
}

@media (max-width: 960px) {
  .compact-select {
    width: 130px;
  }
}

@media (max-width: 960px) {
  .settings__header {
    grid-template-columns: 1fr;
  }
  .settings__grid {
    grid-template-columns: 1fr;
  }
}
</style>
