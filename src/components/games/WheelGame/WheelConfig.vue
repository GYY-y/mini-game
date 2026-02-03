<script setup>
import { computed, ref } from 'vue'
import { useText } from '@/utils/i18n'

const props = defineProps({
  spinDuration: { type: Number, default: 4000 },
  segments: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:spinDuration', 'update:segments'])
const { t } = useText()
const presetColors = ref(['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFD166', '#F76C6C', '#6C5B7B', '#DC143C', '#FFD700'])
const expandedColor = ref(null)
const isMobile = computed(() => (typeof window !== 'undefined' ? window.innerWidth <= 768 : false))

const updateSpinDuration = (event) => {
  const value = Number(event.target.value)
  emit('update:spinDuration', value)
}

const updateSegment = (index, key, value) => {
  const next = props.segments.map((segment, idx) => (idx === index ? { ...segment, [key]: value } : segment))
  emit('update:segments', next)
}

const setColor = (index, color) => {
  updateSegment(index, 'color', color)
  if (isMobile.value) expandedColor.value = null
}
</script>

<template>
  <div class="wheel-config card-surface">
    <div class="config-row">
      <label for="spin-duration">{{ t('旋转时长 (ms)', 'Spin duration (ms)') }}</label>
      <input id="spin-duration" type="number" min="1000" max="8000" :value="spinDuration" @input="updateSpinDuration" />
    </div>
    <div class="config-segments">
      <p class="config-segments__title">{{ t('奖品配置', 'Prizes') }}</p>
      <div v-for="(segment, index) in segments" :key="index" class="segment-row">
        <input
          :value="segment.text"
          :placeholder="t('奖品名称', 'Prize name')"
          @input="updateSegment(index, 'text', $event.target.value)"
        />
        <div v-if="!isMobile" class="color-picker">
          <div
            v-for="color in presetColors"
            :key="color"
            class="swatch"
            :style="`background:${color}`"
            :aria-label="color"
            role="button"
            tabindex="0"
            :data-active="segment.color === color"
            @click="setColor(index, color)"
            @keydown.enter.space.prevent="setColor(index, color)"
          />
          <input
            class="color-input"
            type="color"
            :value="segment.color"
            :aria-label="t('自定义颜色', 'Custom color')"
            @input="setColor(index, $event.target.value)"
          />
        </div>
        <div v-else class="color-picker color-picker--mobile">
          <div class="swatch swatch--current" :style="`background:${segment.color}`" />
          <button class="palette-toggle" type="button" @click="expandedColor = expandedColor === index ? null : index">
            {{ expandedColor === index ? t('收起', 'Hide') : t('更改颜色', 'Change color') }}
          </button>
          <div v-if="expandedColor === index" class="palette-panel">
            <div
              v-for="color in presetColors"
              :key="color"
              class="swatch"
              :style="`background:${color}`"
              :aria-label="color"
              role="button"
              tabindex="0"
              :data-active="segment.color === color"
              @click="setColor(index, color)"
              @keydown.enter.space.prevent="setColor(index, color)"
            />
            <input
              class="color-input"
              type="color"
              :value="segment.color"
              :aria-label="t('自定义颜色', 'Custom color')"
              @input="setColor(index, $event.target.value)"
            />
          </div>
        </div>
        <input
          type="number"
          min="1"
          max="100"
          :value="segment.weight"
          @input="updateSegment(index, 'weight', Number($event.target.value))"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.wheel-config {
  padding: 12px;
  display: grid;
  gap: 12px;
}

.config-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.config-row input {
  width: 140px;
}

.config-segments {
  display: grid;
  gap: 10px;
}

.config-segments__title {
  margin: 0;
  font-weight: 600;
}

.segment-row {
  display: grid;
  grid-template-columns: minmax(140px, 1.3fr) minmax(120px, 1fr) 80px;
  gap: 8px;
  align-items: center;
}

input {
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid var(--border-color);
}

.color-picker {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(28px, 1fr));
  gap: 6px;
  align-items: center;
}

.swatch {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 2px solid transparent;
  cursor: pointer;
  box-shadow: var(--shadow-soft);
}

.swatch[data-active='true'] {
  border-color: var(--primary-color);
}

.color-input {
  width: 100%;
  padding: 6px;
  cursor: pointer;
}

.color-picker--mobile {
  grid-template-columns: auto auto;
  align-items: center;
}

.swatch--current {
  width: 32px;
  height: 32px;
}

.palette-toggle {
  border: 1px solid var(--border-color);
  background: #fff;
  border-radius: 10px;
  padding: 6px 10px;
  cursor: pointer;
}

.palette-panel {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(28px, 1fr));
  gap: 6px;
}

@media (max-width: 768px) {
  .segment-row {
    grid-template-columns: 1fr;
  }
}
</style>
