<script setup>
import { computed } from 'vue'

const { value, isRolling } = defineProps({
  value: { type: Number, default: 1 },
  isRolling: { type: Boolean, default: false }
})

const pipMap = {
  1: [5],
  2: [1, 9],
  3: [1, 5, 9],
  4: [1, 3, 7, 9],
  5: [1, 3, 5, 7, 9],
  6: [1, 3, 4, 6, 7, 9]
}

const valueRotation = {
  1: 'rotateX(0deg) rotateY(0deg)',
  2: 'rotateX(-90deg) rotateY(0deg)', // bottom to front
  3: 'rotateY(90deg)',
  4: 'rotateY(-90deg)',
  5: 'rotateX(90deg)',
  6: 'rotateY(180deg)'
}

const faces = [
  { cls: 'face-front', val: 1 },
  { cls: 'face-back', val: 6 },
  { cls: 'face-right', val: 3 },
  { cls: 'face-left', val: 4 },
  { cls: 'face-top', val: 5 },
  { cls: 'face-bottom', val: 2 }
]

const cubeStyle = computed(() => ({
  transform: valueRotation[value] || valueRotation[1]
}))
</script>

<template>
  <div class="dice" role="img" :aria-label="`点数 ${value}`">
    <div class="cube" :class="{ 'cube--rolling': isRolling }" :style="cubeStyle">
      <div
        v-for="face in faces"
        :key="face.cls"
        class="face"
        :class="face.cls"
      >
        <span
          v-for="i in 9"
          :key="i"
          class="pip"
          :data-active="pipMap[face.val].includes(i)"
        />
      </div>
    </div>
  </div>
  <div class="dice-shadow" :class="{ 'dice-shadow--rolling': isRolling }" aria-hidden="true"></div>
</template>

<style scoped>
.dice {
  width: 80px;
  height: 80px;
  perspective: 600px;
  display: grid;
  place-items: center;
  position: relative;
}

.cube {
  position: relative;
  width: 72px;
  height: 72px;
  transform-style: preserve-3d;
  transition: transform 500ms ease;
}

.cube--rolling {
  animation: spin 1.2s ease-in-out infinite;
}

.face {
  position: absolute;
  inset: 0;
  border-radius: 12px;
  background: linear-gradient(145deg, #fff, #f7f7f7);
  box-shadow:
    inset 0 0 0 2px #ffe4e1,
    0 12px 18px rgba(0, 0, 0, 0.08);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  padding: 10px;
  gap: 4px;
  backface-visibility: hidden;
}

.pip {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: transparent;
  margin: auto;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  opacity: 0.12;
}

.pip[data-active='true'] {
  background: #dc143c;
  opacity: 1;
}

.face-front {
  transform: translateZ(36px);
}
.face-back {
  transform: rotateY(180deg) translateZ(36px);
}
.face-right {
  transform: rotateY(90deg) translateZ(36px);
}
.face-left {
  transform: rotateY(-90deg) translateZ(36px);
}
.face-top {
  transform: rotateX(90deg) translateZ(36px);
}
.face-bottom {
  transform: rotateX(-90deg) translateZ(36px);
}

.dice-shadow {
  width: 70px;
  height: 12px;
  background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.2), transparent 70%);
  filter: blur(6px);
  transform: translateY(-10px) scale(1);
  transition: transform 200ms ease, opacity 200ms ease;
  margin: -6px auto 0;
  opacity: 0.7;
}

.dice-shadow--rolling {
  transform: translateY(-2px) scale(0.9);
  opacity: 0.4;
}

@keyframes spin {
  0% {
    transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
  }
  50% {
    transform: rotateX(180deg) rotateY(180deg) rotateZ(10deg);
  }
  100% {
    transform: rotateX(360deg) rotateY(360deg) rotateZ(0deg);
  }
}
</style>
