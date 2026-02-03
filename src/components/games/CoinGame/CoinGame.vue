<script setup>
import { computed, ref } from 'vue'
import { NButton, NSwitch, NSelect } from 'naive-ui'
import { useGamesStore } from '@/stores/games'
import { useSettingsStore } from '@/stores/settings'
import { useText } from '@/utils/i18n'
import Coin from './Coin.vue'
import CoinHistory from './CoinHistory.vue'
import { baseDurations, getSpeedMultiplier } from '@/utils/animation'
import { calculateProbability } from '@/utils/gameLogic'
import { playCoinSound } from '@/utils/sound'

const gamesStore = useGamesStore()
const settingsStore = useSettingsStore()
const { t } = useText()

const isFlipping = ref(false)
const currentResult = ref('heads')
const animationSpeed = ref(gamesStore.gameSettings.coin.animationSpeed)
const soundEnabled = ref(gamesStore.gameSettings.coin.soundEnabled)

const history = computed(() => gamesStore.gameHistory.coin)
const stats = computed(() => gamesStore.gameStats.coin)

const playFlipSound = () => {
  const allowSound = settingsStore.soundEnabled && soundEnabled.value
  if (!allowSound) return
  playCoinSound()
}

const flipCoin = () => {
  if (isFlipping.value) return
  isFlipping.value = true

  const duration = baseDurations.coinFlip * getSpeedMultiplier(animationSpeed.value)
  const result = Math.random() < 0.5 ? 'heads' : 'tails'

  playFlipSound()
  setTimeout(() => {
    currentResult.value = result
    gamesStore.addGameResult('coin', { timestamp: Date.now(), result })
    isFlipping.value = false
  }, duration)
}

const headsProbability = computed(() =>
  calculateProbability({ heads: stats.value.headsCount, tails: stats.value.tailsCount }, 'heads')
)

const updateSpeed = (value) => {
  animationSpeed.value = value
  gamesStore.updateGameSettings('coin', { animationSpeed: value })
}

const toggleSound = () => {
  soundEnabled.value = !soundEnabled.value
  gamesStore.updateGameSettings('coin', { soundEnabled: soundEnabled.value })
}

const exportHistory = () => {
  if (!history.value.length) return
  const header = ['时间', '结果']
  const rows = history.value.map((item) => [
    new Date(item.timestamp).toLocaleString(),
    item.result === 'heads' ? '正面' : '反面'
  ])
  const csv = [header, ...rows].map((row) => row.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'coin-history.csv'
  link.click()
  URL.revokeObjectURL(link.href)
}
</script>

<template>
  <section class="coin-game fade-in-up">
    <header class="coin-game__header">
      <div>
        <p class="eyebrow">{{ t('春节小游戏 · 抛硬币', 'New Year · Coin Toss') }}</p>
        <h1>{{ t('好运翻倍抛一抛', 'Flip for good luck') }}</h1>
        <p class="subtitle">
          {{ t('正反面 50/50，记录连续结果与概率。', 'Fair 50/50 with streaks and probability.') }}
        </p>
      </div>
      <div class="stat-card card-surface">
        <span class="stat-card__label">{{ t('正面概率', 'Heads probability') }}</span>
        <div class="stat-card__value">{{ (headsProbability * 100).toFixed(0) }}%</div>
      </div>
    </header>

    <div class="coin-stage card-surface">
      <Coin :side="currentResult" :is-flipping="isFlipping" />
      <div class="coin-actions">
        <div class="coin-result">
          <span class="coin-result__label">{{ t('当前结果', 'Current') }}</span>
          <div class="coin-result__value">
            {{ currentResult === 'heads' ? t('正面', 'Heads') : t('反面', 'Tails') }}
          </div>
        </div>
        <n-button type="primary" size="large" :loading="isFlipping" @click="flipCoin">
          {{ isFlipping ? t('翻转中...', 'Flipping...') : t('抛硬币', 'Flip') }}
        </n-button>
      </div>
      <div class="coin-controls">
        <div class="control">
          <span class="control__label">{{ t('动画速度', 'Speed') }}</span>
          <n-select
            size="small"
            :value="animationSpeed"
            :options="[
              { label: t('慢速', 'Slow'), value: 'slow' },
              { label: t('正常', 'Normal'), value: 'normal' },
              { label: t('快速', 'Fast'), value: 'fast' }
            ]"
            @update:value="updateSpeed"
          />
        </div>
        <div class="control">
          <span class="control__label">{{ t('音效', 'Sound') }}</span>
          <n-switch :value="soundEnabled" @update:value="toggleSound" />
        </div>
      </div>
    </div>

    <CoinHistory :stats="stats" :history="history" />
    <div class="history-actions card-surface">
      <div>
        <strong>{{ t('历史记录', 'History') }}</strong>
        <p class="subtitle">{{ t('支持导出 CSV，便于分享或统计。', 'Export CSV for sharing or analytics.') }}</p>
      </div>
      <div class="history-actions__buttons">
        <n-button quaternary type="error" size="small" @click="gamesStore.clearHistory('coin')">
          {{ t('清空', 'Clear') }}
        </n-button>
        <n-button secondary size="small" :disabled="!history.length" @click="exportHistory">
          {{ t('导出 CSV', 'Export CSV') }}
        </n-button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.coin-game {
  display: grid;
  gap: 16px;
}

.coin-game__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.stat-card {
  padding: 12px;
  min-width: 160px;
  text-align: right;
}

.stat-card__label {
  color: var(--muted-text);
  font-size: 12px;
}

.stat-card__value {
  font-size: 28px;
  font-weight: 800;
  color: var(--primary-color);
}

.coin-stage {
  padding: 14px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 16px;
  align-items: center;
}

.coin-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
}

.coin-controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
  width: 100%;
}

.control {
  padding: 10px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.control__label {
  font-size: 14px;
  white-space: nowrap;
}

.coin-result__label {
  color: var(--muted-text);
  font-size: 12px;
}

.coin-result__value {
  font-size: 32px;
  font-weight: 800;
  color: var(--primary-color);
}

@media (max-width: 768px) {
  .coin-game__header {
    flex-direction: column;
    align-items: flex-start;
  }

  .coin-stage {
    grid-template-columns: 1fr;
    justify-items: center;
  }

  .coin-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .coin-controls {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
}

.history-actions {
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.history-actions__buttons {
  display: flex;
  gap: 8px;
}

@media (max-width: 640px) {
  .history-actions {
    flex-direction: column;
    align-items: flex-start;
  }
}

.history-actions + .coin-history {
  max-height: 240px;
  overflow-y: auto;
  padding-right: 6px;
}
</style>
