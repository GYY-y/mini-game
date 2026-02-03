<script setup>
import { useText } from '@/utils/i18n'

const { t } = useText()

defineProps({
  stats: {
    type: Object,
    required: true
  },
  history: {
    type: Array,
    default: () => []
  }
})
</script>

<template>
  <div class="coin-history card-surface">
    <div class="coin-history__stats">
      <div class="stat">
        <span class="stat__label">{{ t('总次数', 'Total') }}</span>
        <span class="stat__value">{{ stats.totalFlips }}</span>
      </div>
      <div class="stat">
        <span class="stat__label">{{ t('正面', 'Heads') }}</span>
        <span class="stat__value">{{ stats.headsCount }}</span>
      </div>
      <div class="stat">
        <span class="stat__label">{{ t('反面', 'Tails') }}</span>
        <span class="stat__value">{{ stats.tailsCount }}</span>
      </div>
      <div class="stat">
        <span class="stat__label">{{ t('当前连胜', 'Current streak') }}</span>
        <span class="stat__value">{{ stats.currentStreak }}</span>
      </div>
      <div class="stat">
        <span class="stat__label">{{ t('最大连胜', 'Max streak') }}</span>
        <span class="stat__value">{{ stats.maxStreak }}</span>
      </div>
    </div>
    <div class="coin-history__list">
      <h4>{{ t('最近记录', 'Recent') }}</h4>
      <div v-if="history.length === 0" class="empty">{{ t('暂无记录', 'No history yet') }}</div>
      <ul v-else>
        <li v-for="item in history" :key="item.timestamp">
          <span>{{ new Date(item.timestamp).toLocaleTimeString() }}</span>
          <span>{{ item.result === 'heads' ? t('正面', 'Heads') : t('反面', 'Tails') }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.coin-history {
  padding: 14px;
  display: grid;
  gap: 16px;
}

.coin-history__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.stat {
  padding: 12px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: #fff;
}

.stat__label {
  display: block;
  color: var(--muted-text);
  font-size: 12px;
}

.stat__value {
  font-size: 20px;
  font-weight: 800;
}

.coin-history__list ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 8px;
}

.coin-history__list {
  max-height: 220px;
  overflow-y: auto;
  padding-right: 6px;
}

.coin-history__list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid var(--border-color);
}

.empty {
  color: var(--muted-text);
}
</style>
