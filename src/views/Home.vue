<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import GameCard from '@/components/common/GameCard.vue'
import SoundToggle from '@/components/common/SoundToggle.vue'
import { useGamesStore } from '@/stores/games'
import { useText } from '@/utils/i18n'

const router = useRouter()
const gamesStore = useGamesStore()
const { t } = useText()

const heroStats = computed(() => {
  const dice = gamesStore.gameStats?.dice?.totalRolls || 0
  const coin = gamesStore.gameStats?.coin?.totalFlips || 0
  const wheel = gamesStore.gameStats?.wheel?.totalSpins || 0
  return [
    { label: t('掷骰次数', 'Dice rolls'), value: dice },
    { label: t('抛硬币次数', 'Coin flips'), value: coin },
    { label: t('转盘次数', 'Wheel spins'), value: wheel }
  ]
})

const cards = computed(() => [
  {
    title: t('摇骰子', 'Dice'),
    description: t('1-6 颗骰子任选，动画与记录俱全', '1-6 dice with animation, records, and stats'),
    icon: '🎲',
    color: '#DC143C',
    route: '/dice',
    type: 'dice'
  },
  {
    title: t('抛硬币', 'Coin Toss'),
    description: t('50/50 公平概率，统计与导出支持', 'Fair 50/50 with stats and export'),
    icon: '🪙',
    color: '#F6C90E',
    route: '/coin',
    type: 'coin'
  },
  {
    title: t('大转盘', 'Lucky Wheel'),
    description: t('自定义奖品与权重，旋转赢好运', 'Custom prizes & weights, spin to win'),
    icon: '🎡',
    color: '#FF6B6B',
    route: '/wheel',
    type: 'wheel'
  }
])

const handleSelect = (route, type) => {
  gamesStore.setCurrentGame(type)
  router.push(route)
}
</script>

<template>
  <div class="home fade-in-up">
    <section class="hero card-surface">
      <div class="hero__text">
        <div class="hero__pill">{{ t('春节派对 · 即开即玩', 'Spring party · Ready to play') }}</div>
        <h1>
          {{ t('好运开启，三款小游戏助兴', 'Kick off luck with three mini games') }}
        </h1>
        <p class="subtitle">
          {{
            t(
              '骰子、硬币、大转盘，一键切换，音效与动画齐全，让聚会更热闹。',
              'Dice, coin, and wheel with sound and animations—switch in one tap.'
            )
          }}
        </p>
        <div class="hero__actions">
          <button class="cta primary" @click="handleSelect('/dice', 'dice')">
            🎲 {{ t('立刻摇骰子', 'Roll now') }}
          </button>
          <button class="cta ghost" @click="handleSelect('/games', 'dice')">
            {{ t('查看所有小游戏', 'See all games') }}
          </button>
          <SoundToggle />
        </div>
        <div class="hero__tags">
          <span class="tag">{{ t('支持多设备', 'Responsive') }}</span>
          <span class="tag">{{ t('中英双语', 'EN/中文') }}</span>
          <span class="tag">{{ t('无数据外依赖', 'Offline friendly') }}</span>
        </div>
      </div>
      <div class="hero__panel card-surface">
        <p class="panel-title">{{ t('当前游玩数据', 'Your play stats') }}</p>
        <div class="hero__stats">
          <div v-for="item in heroStats" :key="item.label" class="stat-tile">
            <span class="stat-tile__value">{{ item.value }}</span>
            <span class="stat-tile__label">{{ item.label }}</span>
          </div>
        </div>
        <p class="panel-note">
          {{ t('数据保存在本地，可在设置中清除。', 'Data stays on device; clear anytime in settings.') }}
        </p>
      </div>
    </section>

    <section class="section">
      <div class="section__header">
        <div>
          <p class="eyebrow">{{ t('精选小游戏', 'Featured games') }}</p>
          <h2>{{ t('一键进入，立刻开玩', 'Jump in and play instantly') }}</h2>
        </div>
        <button class="cta ghost" @click="handleSelect('/settings', 'dice')">
          {{ t('前往设置', 'Go to settings') }}
        </button>
      </div>
      <div class="game-grid">
        <GameCard
          v-for="card in cards"
          :key="card.title"
          v-bind="card"
          @select="handleSelect(card.route, card.type)"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  display: grid;
  gap: 20px;
}

.hero {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 16px;
  padding: 22px;
  background: radial-gradient(circle at 15% 20%, rgba(255, 215, 0, 0.12), transparent 32%),
    radial-gradient(circle at 90% 10%, rgba(220, 20, 60, 0.12), transparent 30%),
    linear-gradient(135deg, #fff7f7, #fff);
}

.hero__actions {
  margin-top: 16px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.hero__pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(220, 20, 60, 0.1);
  color: var(--primary-color);
  font-weight: 600;
  margin-bottom: 10px;
}

.hero__text h1 {
  margin: 6px 0 8px;
  line-height: 1.25;
}

.hero__panel {
  padding: 16px;
  background: linear-gradient(145deg, rgba(220, 20, 60, 0.06), #fff);
  border: 1px solid var(--border-color);
}

.panel-title {
  margin: 0 0 10px;
  font-weight: 700;
}

.panel-note {
  margin: 10px 0 0;
  color: var(--muted-text);
  font-size: 13px;
}

.hero__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;
}

.stat-tile {
  padding: 12px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: #fff;
  box-shadow: var(--shadow-soft);
}

.stat-tile__value {
  display: block;
  font-size: 24px;
  font-weight: 800;
}

.stat-tile__label {
  color: var(--muted-text);
  font-size: 13px;
}

.hero__tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.tag {
  padding: 6px 10px;
  border-radius: 10px;
  background: #fff;
  border: 1px solid var(--border-color);
  font-size: 12px;
  color: var(--muted-text);
}

.cta {
  border: none;
  border-radius: 12px;
  padding: 10px 14px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 150ms ease, box-shadow 150ms ease;
}

.cta.primary {
  background: linear-gradient(135deg, #dc143c, #ff6b6b);
  color: #fff;
  box-shadow: var(--shadow-soft);
}

.cta.ghost {
  background: #fff;
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.cta:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-strong);
}

.section {
  padding: 12px 0;
  display: grid;
  gap: 12px;
}

.section__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.section__header h2 {
  margin: 4px 0 0;
}

.game-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 14px;
}

@media (max-width: 768px) {
  .hero {
    grid-template-columns: 1fr;
  }

  .section__header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
