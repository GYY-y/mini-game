<script setup>
import { computed, ref } from 'vue'
import { NButton, NSpace, NTag, NSwitch } from 'naive-ui'
import { useGamesStore } from '@/stores/games'
import { useSettingsStore } from '@/stores/settings'
import { baseDurations, getSpeedMultiplier } from '@/utils/animation'
import { generateRandomNumber } from '@/utils/gameLogic'
import { playDiceSound as playDiceEffect } from '@/utils/sound'
import { useText } from '@/utils/i18n'
import Dice from './Dice.vue'
import DiceConfig from './DiceConfig.vue'

const gamesStore = useGamesStore()
const settingsStore = useSettingsStore()
const { t } = useText()

const diceCount = ref(gamesStore.gameSettings.dice.count)
const animationSpeed = ref(gamesStore.gameSettings.dice.animationSpeed)
const soundEnabled = ref(gamesStore.gameSettings.dice.soundEnabled)
const isRolling = ref(false)
const currentValues = ref(Array.from({ length: diceCount.value }, () => 1))

const total = computed(() => currentValues.value.reduce((sum, value) => sum + value, 0))
const history = computed(() => gamesStore.gameHistory.dice)
const stats = computed(() => gamesStore.gameStats.dice)

const playDiceSound = () => {
  const allowSound = settingsStore.soundEnabled && soundEnabled.value
  if (!allowSound) return
  playDiceEffect()
}

const rollDice = () => {
  if (isRolling.value) return
  isRolling.value = true
  const duration = baseDurations.diceRoll * getSpeedMultiplier(animationSpeed.value)
  const newValues = Array.from({ length: diceCount.value }, () => generateRandomNumber(1, 6))

  playDiceSound()
  setTimeout(() => {
    currentValues.value = newValues
    gamesStore.addGameResult('dice', {
      timestamp: Date.now(),
      values: newValues,
      sum: newValues.reduce((sum, value) => sum + value, 0)
    })
    isRolling.value = false
  }, duration)
}

const updateCount = (count) => {
  if (count < 1 || count > 6) return
  diceCount.value = count
  currentValues.value = Array.from({ length: count }, () => 1)
  gamesStore.updateGameSettings('dice', { count })
}

const updateSpeed = (speed) => {
  animationSpeed.value = speed
  gamesStore.updateGameSettings('dice', { animationSpeed: speed })
}

const toggleSound = () => {
  soundEnabled.value = !soundEnabled.value
  gamesStore.updateGameSettings('dice', { soundEnabled: soundEnabled.value })
}
</script>

<template>
  <section class="dice-game fade-in-up">
    <header class="dice-game__header">
      <div>
        <p class="eyebrow">{{ t('春节小游戏 · 摇骰子', 'New Year · Dice') }}</p>
        <h1>{{ t('好运连连摇一摇', 'Roll the dice for luck') }}</h1>
        <p class="subtitle">
          {{
            t(
              '支持 1-6 颗骰子，切换动画速度，记录你的好运时刻。',
              '1-6 dice with speed control and history.'
            )
          }}
        </p>
      </div>
      <DiceConfig :count="diceCount" :animation-speed="animationSpeed" @update:count="updateCount" @update:animation-speed="updateSpeed" />
    </header>

    <div class="dice-layout card-surface">
      <div class="dice-grid">
        <Dice v-for="(value, index) in currentValues" :key="index" :value="value" :is-rolling="isRolling" />
      </div>
      <div class="dice-actions">
        <n-space align="center" justify="space-between" style="width: 100%">
        <div class="dice-total">
            <span class="dice-total__label">{{ t('当前总点数', 'Total') }}</span>
            <div class="dice-total__value">{{ total }}</div>
          </div>
          <n-button type="primary" size="large" :loading="isRolling" class="roll-button" @click="rollDice">
            {{ isRolling ? t('摇动中...', 'Rolling...') : t('摇骰子', 'Roll') }}
          </n-button>
        </n-space>
      </div>
      <div class="dice-meta">
        <div class="meta-item">
          <span>{{ t('音效', 'Sound') }}</span>
          <n-switch :value="soundEnabled" @update:value="toggleSound" />
        </div>
        <div class="meta-item">
          <span>{{ t('总次数', 'Total Rolls') }}</span>
          <strong>{{ stats.totalRolls }}</strong>
        </div>
      </div>
    </div>

    <section class="stats card-surface">
      <div class="stats__header">
        <h3>{{ t('点数统计', 'Number Stats') }}</h3>
        <span class="stats__hint">{{ t('显示各点数出现次数', 'Counts by face value') }}</span>
      </div>
      <div class="stats__grid">
        <div v-for="(count, idx) in stats.counts" :key="idx" class="stat-chip">
          <span class="stat-chip__label">{{ t(`${idx + 1} 点`, `${idx + 1}`) }}</span>
          <span class="stat-chip__value">{{ count }}</span>
        </div>
      </div>
    </section>

    <section class="history card-surface">
      <div class="history__header">
        <h3>{{ t('近期记录', 'Recent history') }}</h3>
        <n-button quaternary type="error" size="small" @click="gamesStore.clearHistory('dice')">
          {{ t('清空', 'Clear') }}
        </n-button>
      </div>
      <div v-if="history.length === 0" class="history__empty">
        {{ t('暂无记录，快去摇一摇吧！', 'No history yet, give it a roll!') }}
      </div>
      <div v-else class="history__list">
        <div v-for="item in history" :key="item.timestamp" class="history__item">
          <span>{{ new Date(item.timestamp).toLocaleTimeString() }}</span>
          <n-space>
            <n-tag v-for="(val, idx) in item.values" :key="idx" bordered>{{ val }}</n-tag>
          </n-space>
          <span class="history__sum">{{ t('合计', 'Sum') }}：{{ item.sum }}</span>
        </div>
      </div>
    </section>
  </section>
</template>

<style scoped>
.dice-game {
  display: grid;
  gap: 16px;
}

.dice-game__header {
  display: grid;
  gap: 12px;
  align-items: start;
  grid-template-columns: 1fr minmax(220px, 260px);
}

.eyebrow {
  margin: 0;
  color: var(--muted-text);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  font-size: 12px;
}

h1 {
  margin: 6px 0 4px;
}

.subtitle {
  margin: 0;
  color: var(--muted-text);
}

.dice-layout {
  padding: 16px;
  display: grid;
  gap: 12px;
}

.dice-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 12px;
  justify-items: center;
}

.dice-actions {
  padding: 10px;
  border-radius: 12px;
  background: var(--surface-contrast);
  border: 1px dashed var(--border-color);
}

.dice-meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 10px;
}

.meta-item {
  padding: 10px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
}

.dice-total__label {
  color: var(--muted-text);
  font-size: 12px;
}

.dice-total__value {
  font-size: 32px;
  font-weight: 800;
  color: var(--primary-color);
}

.roll-button {
  min-width: 120px;
}

.stats {
  padding: 14px;
}

.stats__header {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.stats__hint {
  color: var(--muted-text);
  font-size: 12px;
}

.stats__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
  margin-top: 8px;
}

.stat-chip {
  padding: 10px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stat-chip__label {
  color: var(--muted-text);
}

.history {
  padding: 14px;
}

.history__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.history__empty {
  padding: 12px;
  color: var(--muted-text);
}

.history__list {
  display: grid;
  gap: 10px;
  margin-top: 10px;
  max-height: 220px;
  overflow-y: auto;
  padding-right: 6px;
}

.history__item {
  display: grid;
  grid-template-columns: 120px 1fr 120px;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: #fff;
}

.history__sum {
  text-align: right;
  font-weight: 700;
  color: var(--primary-color);
}

@media (max-width: 768px) {
  .dice-game__header {
    grid-template-columns: 1fr;
  }

  .history__item {
    grid-template-columns: 1fr;
    align-items: flex-start;
  }
}
</style>
