<script setup>
const props = defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, default: '🎮' },
  color: { type: String, default: '#DC143C' },
  route: { type: String, default: '/' },
  testId: { type: String, default: '' }
})

const emit = defineEmits(['select'])

const handleSelect = () => emit('select', props.route)
</script>

<template>
  <article
    class="game-card"
    :style="`--theme-color: ${color}`"
    :data-testid="testId || `${route.replace('/', '')}-game-card`"
    @click="handleSelect"
  >
    <div class="game-card__icon">{{ icon }}</div>
    <div class="game-card__body">
      <h3 class="game-card__title">{{ title }}</h3>
      <p class="game-card__desc">{{ description }}</p>
    </div>
    <span class="game-card__chevron">→</span>
  </article>
</template>

<style scoped>
.game-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 12px;
  padding: 18px;
  border-radius: 18px;
  border: 1px solid var(--border-color);
  background: radial-gradient(circle at 20% 20%, rgba(255, 215, 0, 0.08), transparent 40%),
    linear-gradient(135deg, rgba(220, 20, 60, 0.09), #fff);
  cursor: pointer;
  transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease, background 220ms ease;
  box-shadow: var(--shadow-soft);
}

.game-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-strong);
  border-color: var(--theme-color);
  background: linear-gradient(135deg, rgba(220, 20, 60, 0.12), #fff);
}

.game-card__icon {
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  font-size: 24px;
  border-radius: 14px;
  background: rgba(220, 20, 60, 0.14);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.game-card__title {
  margin: 0;
  font-size: 18px;
  line-height: 1.2;
}

.game-card__desc {
  margin: 6px 0 0;
  color: var(--muted-text);
  font-size: 14px;
  line-height: 1.4;
}

.game-card__chevron {
  font-weight: 800;
  color: var(--theme-color);
}
</style>
