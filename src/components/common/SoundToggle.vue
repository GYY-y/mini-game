<script setup>
import { computed } from 'vue'
import { NSwitch } from 'naive-ui'
import { useSettingsStore } from '@/stores/settings'
import { useText } from '@/utils/i18n'

const settingsStore = useSettingsStore()
const { t } = useText()

const { plain } = defineProps({
  plain: { type: Boolean, default: false }
})

const soundEnabled = computed({
  get: () => settingsStore.soundEnabled,
  set: () => settingsStore.toggleSound()
})
</script>

<template>
  <div class="sound-toggle" :class="{ 'sound-toggle--plain': plain }">
    <div class="sound-toggle__label">
      <span class="sound-toggle__title">{{ t('音效', 'Sound') }}&nbsp;</span>
    </div>
    <n-switch v-model:value="soundEnabled" size="medium" />
  </div>
</template>

<style scoped>
.sound-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-radius: 12px;
  background: var(--surface-color);
  border: 1px solid var(--border-color);
}

.sound-toggle__title {
  font-weight: 400;
}

.sound-toggle--plain {
  padding: 0;
  border: none;
  background: transparent;
}
</style>
