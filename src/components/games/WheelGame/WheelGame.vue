<script setup>
import { computed, ref } from 'vue'
import { NButton, NTag, NSwitch, NSelect, NDrawer, NDrawerContent } from 'naive-ui'
import { useGamesStore } from '@/stores/games'
import { useSettingsStore } from '@/stores/settings'
import { useText } from '@/utils/i18n'
import { selectWheelPrize } from '@/utils/gameLogic'
import { getSpeedMultiplier } from '@/utils/animation'
import { playWheelSound } from '@/utils/sound'
import Wheel from './Wheel.vue'
import WheelConfig from './WheelConfig.vue'

const gamesStore = useGamesStore()
const settingsStore = useSettingsStore()
const { t } = useText()

const segments = ref([
  { text: '一等奖', color: '#FF6B6B', weight: 5 },
  { text: '二等奖', color: '#4ECDC4', weight: 10 },
  { text: '三等奖', color: '#45B7D1', weight: 15 },
  { text: '谢谢参与', color: '#FFD166', weight: 20 },
  { text: '再抽一次', color: '#F76C6C', weight: 10 },
  { text: '小红包', color: '#6C5B7B', weight: 12 }
])

const spinDuration = ref(gamesStore.gameSettings.wheel.spinDuration)
const animationSpeed = ref(gamesStore.gameSettings.wheel.animationSpeed)
const soundEnabled = ref(gamesStore.gameSettings.wheel.soundEnabled)
const isSpinning = ref(false)
const rotation = ref(0)
const selectedSegment = ref(null)
const history = computed(() => gamesStore.gameHistory.wheel)
const stats = computed(() => gamesStore.gameStats.wheel)
const fileInputRef = ref(null)
const spinDurationMs = computed(() => spinDuration.value * getSpeedMultiplier(animationSpeed.value))
const showConfig = ref(false)
const drawerHeight = computed(() => {
  if (typeof window === 'undefined') return 420
  return window.innerWidth <= 768 ? '80vh' : 420
})

const playSpinSound = () => {
  const allowSound = settingsStore.soundEnabled && soundEnabled.value
  if (!allowSound) return
  playWheelSound()
}

const spinWheel = () => {
  if (isSpinning.value) return
  isSpinning.value = true

  const winner = selectWheelPrize(segments.value)
  const extraRotations = Math.floor(Math.random() * 3) + 5
  const segmentIndex = segments.value.findIndex((seg) => seg.text === winner.text)
  const anglePerSegment = 360 / segments.value.length
  const targetAngle = 360 - segmentIndex * anglePerSegment - anglePerSegment / 2
  const duration = spinDurationMs.value

  rotation.value += extraRotations * 360 + targetAngle
  playSpinSound()

  setTimeout(() => {
    selectedSegment.value = winner
    gamesStore.addGameResult('wheel', { timestamp: Date.now(), result: winner.text })
    isSpinning.value = false
  }, duration)
}

const updateSpinDuration = (value) => {
  spinDuration.value = value
  gamesStore.updateGameSettings('wheel', { spinDuration: value })
}

const updateSegments = (value) => {
  segments.value = value
}

const updateSpeed = (value) => {
  animationSpeed.value = value
  gamesStore.updateGameSettings('wheel', { animationSpeed: value })
}

const toggleSound = () => {
  soundEnabled.value = !soundEnabled.value
  gamesStore.updateGameSettings('wheel', { soundEnabled: soundEnabled.value })
}

const exportConfig = () => {
  const payload = {
    spinDuration: spinDuration.value,
    segments: segments.value
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'wheel-config.json'
  link.click()
  URL.revokeObjectURL(link.href)
}

const triggerImport = () => {
  fileInputRef.value?.click()
}

const handleImport = (event) => {
  const [file] = event.target.files || []
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result)
      if (Array.isArray(data.segments)) {
        segments.value = data.segments
      }
      if (data.spinDuration) {
        spinDuration.value = Number(data.spinDuration)
      }
    } catch {
      // 忽略导入失败
    }
  }
  reader.readAsText(file)
}
</script>

<template>
  <section class="wheel-game fade-in-up">
    <header class="wheel-game__header">
      <div>
        <p class="eyebrow">{{ t('春节小游戏 · 大转盘', 'New Year · Lucky Wheel') }}</p>
        <h1>{{ t('好运转不停', 'Keep spinning for luck') }}</h1>
        <p class="subtitle">
          {{ t('自定义奖品、颜色和权重，旋转赢取惊喜。', 'Customize prizes, colors, and weights.') }}
        </p>
      </div>
      <n-button class="config-btn" size="small" tertiary type="primary" @click="showConfig = true">
        {{ t('打开配置', 'Open config') }}
      </n-button>
    </header>

    <div class="wheel-stage card-surface">
      <Wheel
        class="wheel-canvas"
        :segments="segments"
        :spin-duration="spinDurationMs"
        :rotation="rotation"
        :is-spinning="isSpinning"
      />
      <div class="wheel-actions">
        <div class="wheel-result card-surface">
          <span class="wheel-result__label">中奖结果</span>
          <div class="wheel-result__value">{{ selectedSegment?.text || t('等待旋转', 'Ready to spin') }}</div>
        </div>
        <n-button type="primary" size="large" :loading="isSpinning" @click="spinWheel">
          {{ isSpinning ? t('旋转中...', 'Spinning...') : t('开始旋转', 'Spin') }}
        </n-button>
        <div class="wheel-controls">
          <div class="control">
            <span class="control__label">{{ t('动画速度', 'Speed') }}</span>
            <n-select
              class="compact-select"
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
        <div class="config-actions">
          <n-button size="small" secondary @click="exportConfig">{{ t('导出配置', 'Export config') }}</n-button>
          <n-button size="small" tertiary @click="triggerImport">{{ t('导入配置', 'Import config') }}</n-button>
          <input ref="fileInputRef" type="file" accept="application/json" class="visually-hidden" @change="handleImport" />
        </div>
      </div>
    </div>

    <section class="history card-surface">
      <div class="history__header">
        <h3>{{ t('转盘历史', 'Wheel history') }}</h3>
        <n-button quaternary type="error" size="small" @click="gamesStore.clearHistory('wheel')">
          {{ t('清空', 'Clear') }}
        </n-button>
      </div>
      <div v-if="history.length === 0" class="history__empty">{{ t('暂无记录', 'No history yet') }}</div>
      <div v-else class="history__list">
        <div v-for="item in history" :key="item.timestamp" class="history__item">
          <span>{{ new Date(item.timestamp).toLocaleTimeString() }}</span>
          <n-tag type="success" bordered>{{ item.result }}</n-tag>
        </div>
      </div>
      <div v-if="stats.totalSpins" class="stats">
        <h4>{{ t('中奖统计', 'Prize stats') }}</h4>
        <div class="stats__grid">
          <div v-for="(count, name) in stats.resultCounts" :key="name" class="stat-chip">
            <span>{{ name }}</span>
            <strong>{{ count }}</strong>
          </div>
        </div>
      </div>
    </section>

    <section class="segments card-surface">
      <div class="segments__header">
        <h3>{{ t('奖项与颜色', 'Prizes & colors') }}</h3>
      </div>
      <div class="segments__grid">
        <div v-for="(segment, index) in segments" :key="index" class="segment-pill">
          <span class="color-dot" :style="`background:${segment.color}`"></span>
          <div class="segment-pill__text">
            <strong>{{ segment.text || t('未命名奖项', 'Untitled') }}</strong>
            <small>{{ t('权重', 'Weight') }}: {{ segment.weight }}</small>
          </div>
        </div>
      </div>
    </section>

    <n-drawer v-model:show="showConfig" placement="bottom" :height="drawerHeight">
      <n-drawer-content :title="t('转盘配置', 'Wheel config')" closable>
        <div class="drawer-body">
          <WheelConfig
            :spin-duration="spinDuration"
            :segments="segments"
            @update:spin-duration="updateSpinDuration"
            @update:segments="updateSegments"
          />
        </div>
      </n-drawer-content>
    </n-drawer>
  </section>
</template>

<style scoped>
.wheel-game {
  display: grid;
  gap: 16px;
}

.wheel-game__header {
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr auto;
  align-items: center;
}

.config-btn {
  border-radius: 999px;
  padding: 8px 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.wheel-stage {
  padding: 14px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 16px;
  align-items: center;
}

.wheel-canvas {
  width: clamp(220px, 55vw, 320px);
  height: clamp(220px, 55vw, 320px);
  justify-self: center;
}

.wheel-actions {
  display: grid;
  gap: 12px;
}

.wheel-result {
  padding: 12px;
}

.wheel-result__label {
  color: var(--muted-text);
  font-size: 12px;
}

.wheel-result__value {
  font-size: 24px;
  font-weight: 800;
  color: var(--primary-color);
}

.wheel-controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 10px;
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

.compact-select {
  width: 140px;
}

.config-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
}

.history {
  padding: 14px;
}

.history__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.stats {
  margin-top: 12px;
}

.stats__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
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

.segments {
  padding: 12px;
}

.segments__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 10px;
  margin-top: 8px;
}

.segment-pill {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px;
  align-items: center;
  padding: 10px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: #fff;
}

.color-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  box-shadow: var(--shadow-soft);
  border: 2px solid #fff;
}

.segment-pill__text small {
  color: var(--muted-text);
}

@media (max-width: 900px) {
  .wheel-game__header,
  .wheel-stage {
    grid-template-columns: 1fr;
  }

  .wheel-stage {
    justify-items: center;
  }
}

@media (max-width: 768px) {
  .wheel-actions {
    width: 100%;
  }
  .wheel-actions .n-button {
    width: 100%;
  }
  .config-btn {
    width: fit-content;
    justify-self: end;
  }
  .wheel-controls {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    align-items: center;
  }
  .compact-select {
    width: 130px;
  }
  .config-actions {
    justify-content: center;
  }
  .history__list {
    max-height: 180px;
  }
}

.drawer-body {
  max-height: calc(80vh - 80px);
  overflow-y: auto;
  padding-right: 6px;
}
</style>
