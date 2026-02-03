<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import GameCard from '@/components/common/GameCard.vue'
import { useGamesStore } from '@/stores/games'
import { useText } from '@/utils/i18n'

const router = useRouter()
const gamesStore = useGamesStore()
const { t } = useText()

const games = computed(() => [
  {
    title: t('摇骰子', 'Dice'),
    description: t('多颗骰子、动画速度、历史记录与统计全都有。', 'Dice with speed control, history, stats.'),
    icon: '🎲',
    color: '#DC143C',
    route: '/dice',
    type: 'dice'
  },
  {
    title: t('抛硬币', 'Coin Toss'),
    description: t('正反面 50/50，支持连胜统计、导出与可视化。', 'Fair 50/50 with streaks, export, and stats.'),
    icon: '🪙',
    color: '#F6C90E',
    route: '/coin',
    type: 'coin'
  },
  {
    title: t('大转盘', 'Lucky Wheel'),
    description: t('自定义奖品、颜色、权重，导入导出配置皆可。', 'Custom prizes/colors/weights with import/export.'),
    icon: '🎡',
    color: '#FF6B6B',
    route: '/wheel',
    type: 'wheel'
  }
])

const goToGame = (route, type) => {
  gamesStore.setCurrentGame(type)
  router.push(route)
}
</script>

<template>
  <section class="game-hub fade-in-up">
    <header class="game-hub__hero card-surface">
      <div class="hero__left">
        <p class="eyebrow">{{ t('小游戏中心', 'Game Hub') }}</p>
        <h1>{{ t('切换游戏，一键即玩', 'Switch games, play instantly') }}</h1>
        <p class="subtitle">
          {{
            t(
              '骰子、硬币、大转盘三款游戏随时切换，动画与音效一应俱全。',
              'Dice, coin, and wheel with smooth animations and sound.'
            )
          }}
        </p>
        <div class="hero__actions">
          <button class="cta primary" @click="goToGame('/dice', 'dice')">{{ t('立即开玩', 'Play now') }}</button>
          <button class="cta ghost" @click="router.push('/')">{{ t('返回首页', 'Back home') }}</button>
        </div>
        <div class="hub-tags">
          <span class="tag">{{ t('春节氛围', 'Festive feel') }}</span>
          <span class="tag">{{ t('动画与音效', 'FX & sound') }}</span>
          <span class="tag">{{ t('本地存储', 'Local data') }}</span>
        </div>
      </div>
      <div class="hero__panel card-surface">
        <p class="panel-title">{{ t('快速指南', 'Quick steps') }}</p>
        <div class="hub-steps">
          <div class="step">
            <span class="step__label">①</span>
            <span class="step__text">{{ t('选择游戏卡片', 'Pick a card') }}</span>
          </div>
          <div class="step">
            <span class="step__label">②</span>
            <span class="step__text">{{ t('一键开始', 'Start instantly') }}</span>
          </div>
          <div class="step">
            <span class="step__label">③</span>
            <span class="step__text">{{ t('随时切换/返回', 'Switch anytime') }}</span>
          </div>
        </div>
      </div>
    </header>
    <div class="game-hub__grid">
      <GameCard v-for="game in games" :key="game.title" v-bind="game" @select="goToGame(game.route, game.type)" />
    </div>
  </section>
</template>

<style scoped>
.game-hub {
  display: grid;
  gap: 16px;
  padding-top: 4px;
}

.game-hub__hero {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 16px;
  padding: 18px;
  background: radial-gradient(circle at 20% 20%, rgba(255, 215, 0, 0.12), transparent 35%),
    radial-gradient(circle at 80% 0%, rgba(220, 20, 60, 0.1), transparent 30%),
    linear-gradient(135deg, #fff7f7, #fff);
}

.hero__actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin: 12px 0;
}

.hub-tags {
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

.hero__panel {
  padding: 14px;
  background: linear-gradient(145deg, rgba(220, 20, 60, 0.06), #fff);
  border: 1px solid var(--border-color);
}

.panel-title {
  margin: 0 0 10px;
  font-weight: 700;
}

.hub-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;
  align-items: center;
}

.step {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: #fff;
}

.step__label {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: rgba(220, 20, 60, 0.12);
  color: var(--primary-color);
  display: grid;
  place-items: center;
  font-weight: 700;
}

.step__text {
  font-weight: 600;
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

.game-hub__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 14px;
}

@media (max-width: 900px) {
  .game-hub__hero {
    grid-template-columns: 1fr;
  }
}
</style>
