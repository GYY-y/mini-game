import { defineStore } from 'pinia'
import { loadFromStorage, saveToStorage } from '@/utils/storage'

const STORAGE_KEY = 'nyg-games'

const defaultState = {
  currentGame: null,
  gameHistory: {
    dice: [],
    coin: [],
    wheel: []
  },
  gameStats: {
    dice: {
      totalRolls: 0,
      counts: [0, 0, 0, 0, 0, 0],
      lastSum: 0
    },
    coin: {
      totalFlips: 0,
      headsCount: 0,
      tailsCount: 0,
      currentStreak: 0,
      maxStreak: 0,
      lastResult: null
    },
    wheel: {
      totalSpins: 0,
      resultCounts: {}
    }
  },
  gameSettings: {
    dice: {
      count: 2,
      animationSpeed: 'normal',
      soundEnabled: true
    },
    coin: {
      animationSpeed: 'normal',
      showStatistics: true,
      soundEnabled: true
    },
    wheel: {
      spinDuration: 4000,
      animationSpeed: 'normal',
      showWeight: true,
      soundEnabled: true
    }
  }
}

export const useGamesStore = defineStore('games', {
  state: () => {
    const saved = loadFromStorage(STORAGE_KEY, {})
    return {
      ...defaultState,
      ...saved,
      gameHistory: { ...defaultState.gameHistory, ...(saved.gameHistory || {}) },
      gameSettings: { ...defaultState.gameSettings, ...(saved.gameSettings || {}) },
      gameStats: { ...defaultState.gameStats, ...(saved.gameStats || {}) }
    }
  },
  actions: {
    setCurrentGame(gameType) {
      this.currentGame = gameType
      this.persist()
    },
    addGameResult(gameType, result) {
      if (this.gameHistory[gameType]) {
        this.gameHistory[gameType].unshift(result)
        this.gameHistory[gameType] = this.gameHistory[gameType].slice(0, 20)

        if (gameType === 'dice' && Array.isArray(result.values)) {
          this.gameStats.dice.totalRolls += 1
          result.values.forEach((val) => {
            if (val >= 1 && val <= 6) {
              this.gameStats.dice.counts[val - 1] += 1
            }
          })
          this.gameStats.dice.lastSum = result.sum || 0
        }

        if (gameType === 'coin' && result.result) {
          this.gameStats.coin.totalFlips += 1
          if (result.result === 'heads') {
            this.gameStats.coin.headsCount += 1
          } else {
            this.gameStats.coin.tailsCount += 1
          }
          if (this.gameStats.coin.lastResult === result.result) {
            this.gameStats.coin.currentStreak += 1
          } else {
            this.gameStats.coin.currentStreak = 1
          }
          this.gameStats.coin.lastResult = result.result
          this.gameStats.coin.maxStreak = Math.max(
            this.gameStats.coin.maxStreak,
            this.gameStats.coin.currentStreak
          )
        }

        if (gameType === 'wheel' && result.result) {
          this.gameStats.wheel.totalSpins += 1
          this.gameStats.wheel.resultCounts[result.result] =
            (this.gameStats.wheel.resultCounts[result.result] || 0) + 1
        }

        this.persist()
      }
    },
    clearHistory(gameType) {
      if (this.gameHistory[gameType]) {
        this.gameHistory[gameType] = []
        if (gameType === 'dice') {
          this.gameStats.dice = { totalRolls: 0, counts: [0, 0, 0, 0, 0, 0], lastSum: 0 }
        }
        if (gameType === 'coin') {
          this.gameStats.coin = {
            totalFlips: 0,
            headsCount: 0,
            tailsCount: 0,
            currentStreak: 0,
            maxStreak: 0,
            lastResult: null
          }
        }
        if (gameType === 'wheel') {
          this.gameStats.wheel = { totalSpins: 0, resultCounts: {} }
        }
        this.persist()
      }
    },
    updateGameSettings(gameType, settings) {
      if (this.gameSettings[gameType]) {
        this.gameSettings[gameType] = {
          ...this.gameSettings[gameType],
          ...settings
        }
        this.persist()
      }
    },
    persist() {
      saveToStorage(STORAGE_KEY, {
        gameHistory: this.gameHistory,
        gameSettings: this.gameSettings,
        gameStats: this.gameStats
      })
    },
    reset() {
      Object.assign(this, defaultState)
      this.persist()
    }
  }
})
