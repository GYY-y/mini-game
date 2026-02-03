<script setup>
const { side, isFlipping } = defineProps({
  side: { type: String, default: 'heads' },
  isFlipping: { type: Boolean, default: false }
})
</script>

<template>
  <div class="coin" :class="{ 'coin--flip': isFlipping, 'coin--tails': side === 'tails' }">
    <div class="coin__ring"></div>
    <div class="coin__face coin__face--front">
      <span>福</span>
    </div>
    <div class="coin__face coin__face--back">
      <span>春</span>
    </div>
    <div class="coin__shadow"></div>
  </div>
</template>

<style scoped>
.coin {
  width: 140px;
  height: 140px;
  position: relative;
  transform-style: preserve-3d;
  perspective: 1000px;
  transition: transform 0.4s ease;
}

.coin__ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #ffdaba, #f7b66b 40%, #d18d3f 70%, #b9772f);
  box-shadow:
    inset 0 0 0 4px rgba(255, 255, 255, 0.3),
    inset 0 0 12px rgba(0, 0, 0, 0.2);
  transform: translateZ(5px);
}

.coin__face {
  position: absolute;
  inset: 8px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 52px;
  font-weight: 800;
  color: #b51228;
  backface-visibility: hidden;
  background: radial-gradient(circle at 30% 30%, #fff3e5, #f7d9aa 60%, #e7b86d);
  box-shadow:
    inset 0 0 10px rgba(0, 0, 0, 0.08),
    0 12px 20px rgba(0, 0, 0, 0.14);
  border: 2px solid rgba(255, 215, 0, 0.6);
  transform-style: preserve-3d;
}

.coin__face span {
  transform: translateZ(2px);
}

.coin__face--back {
  transform: rotateY(180deg);
}

.coin__shadow {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 0, 0, 0.2), transparent 65%);
  filter: blur(8px);
  transform: translateZ(-2px) scale(0.92);
}

.coin--tails {
  transform: rotateY(180deg);
}

.coin--flip {
  animation: flip 1s ease-in-out;
}

@keyframes flip {
  0% {
    transform: rotateY(0deg) translateY(0);
  }
  50% {
    transform: rotateY(540deg) translateY(-10px);
  }
  100% {
    transform: rotateY(1080deg) translateY(0);
  }
}
</style>
