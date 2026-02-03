import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import GameHub from '@/views/GameHub.vue'
import Settings from '@/views/Settings.vue'
import DiceGame from '@/components/games/DiceGame/DiceGame.vue'
import CoinGame from '@/components/games/CoinGame/CoinGame.vue'
import WheelGame from '@/components/games/WheelGame/WheelGame.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/games',
    name: 'game-hub',
    component: GameHub
  },
  {
    path: '/dice',
    name: 'dice',
    component: DiceGame
  },
  {
    path: '/coin',
    name: 'coin',
    component: CoinGame
  },
  {
    path: '/wheel',
    name: 'wheel',
    component: WheelGame
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
