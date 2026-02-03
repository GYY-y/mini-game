<script setup>
import { computed } from 'vue'

const props = defineProps({
  segments: {
    type: Array,
    default: () => []
  },
  spinDuration: {
    type: Number,
    default: 3000
  },
  rotation: {
    type: Number,
    default: 0
  },
  isSpinning: {
    type: Boolean,
    default: false
  }
})

const gradientStyle = computed(() => {
  const totalWeight = props.segments.reduce((sum, seg) => sum + (seg.weight || 1), 0) || 1
  let current = 0
  const stops = props.segments.map((segment) => {
    const start = (current / totalWeight) * 360
    const end = ((current + (segment.weight || 1)) / totalWeight) * 360
    current += segment.weight || 1
    return `${segment.color || '#DC143C'} ${start}deg ${end}deg`
  })
  return `conic-gradient(${stops.join(',')})`
})

const anglePerSegment = computed(() => (props.segments.length ? 360 / props.segments.length : 0))

const labelStyle = (index) => {
  const angle = anglePerSegment.value * index + anglePerSegment.value / 2
  return {
    transform: `rotate(${angle}deg) translateY(-42%)`
  }
}
</script>

<template>
  <div class="wheel-wrapper">
    <div
      class="wheel"
      :style="{
        background: gradientStyle,
        transform: `rotate(${rotation}deg)`,
        transitionDuration: `${spinDuration}ms`
      }"
    >
      <div v-for="(segment, index) in segments" :key="index" class="wheel__label" :style="labelStyle(index)">
        <span :style="`transform: rotate(-${anglePerSegment * index + anglePerSegment / 2}deg);`">
          {{ segment.text }}
        </span>
      </div>
    </div>
    <div class="wheel__pointer" aria-hidden="true"></div>
  </div>
</template>

<style scoped>
.wheel-wrapper {
  position: relative;
  width: 320px;
  height: 320px;
  display: grid;
  place-items: center;
}

.wheel {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 6px solid #fff;
  box-shadow: var(--shadow-strong);
  transition: transform 3s cubic-bezier(0.25, 0.1, 0.25, 1);
  position: relative;
  overflow: hidden;
}

.wheel__pointer {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0;
  height: 0;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-bottom: 16px solid var(--primary-color);
  filter: drop-shadow(0 3px 8px rgba(0, 0, 0, 0.16));
}

.wheel__label {
  display: none;
}
</style>
