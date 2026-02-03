<script setup>
import { computed } from 'vue'
import { NSelect, NInputNumber } from 'naive-ui'
import { useText } from '@/utils/i18n'

const { count, animationSpeed } = defineProps({
  count: { type: Number, default: 2 },
  animationSpeed: { type: String, default: 'normal' }
})

const emit = defineEmits(['update:count', 'update:animationSpeed'])
const { t } = useText()

const speedOptions = computed(() => [
  { label: t('慢速', 'Slow'), value: 'slow' },
  { label: t('正常', 'Normal'), value: 'normal' },
  { label: t('快速', 'Fast'), value: 'fast' }
])
</script>

<template>
  <div class="dice-config card-surface">
    <div class="config-row">
      <label for="dice-count">{{ t('骰子数量', 'Dice count') }}</label>
      <n-input-number
        id="dice-count"
        class="count-input"
        size="small"
        :value="count"
        :min="1"
        :max="6"
        @update:value="emit('update:count', $event || 1)"
      />
    </div>
    <div class="config-row">
      <label for="dice-speed">{{ t('动画速度', 'Animation speed') }}</label>
      <n-select
        id="dice-speed"
        class="speed-select"
        size="small"
        :value="animationSpeed"
        :options="speedOptions"
        @update:value="emit('update:animationSpeed', $event)"
      />
    </div>
  </div>
</template>

<style scoped>
.dice-config {
  padding: 12px;
  display: grid;
  gap: 10px;
}

.config-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 14px;
}

input,
select {
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid var(--border-color);
}

.speed-select {
  width: 140px;
}

.count-input {
  width: 140px;
}
</style>
