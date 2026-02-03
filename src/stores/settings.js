import { defineStore } from 'pinia'
import { loadFromStorage, saveToStorage } from '@/utils/storage'

const STORAGE_KEY = 'nyg-settings'

const defaultState = {
  soundEnabled: true,
  theme: 'spring-festival', // spring-festival | light | dark
  animations: true,
  language: 'zh-CN',
  autoSave: true
}

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    ...defaultState,
    ...loadFromStorage(STORAGE_KEY, {})
  }),
  actions: {
    toggleSound() {
      this.soundEnabled = !this.soundEnabled
      this.persist()
    },
    setTheme(theme) {
      this.theme = theme
      this.persist()
    },
    toggleAnimations() {
      this.animations = !this.animations
      this.persist()
    },
    setLanguage(language) {
      this.language = language
      this.persist()
    },
    reset() {
      Object.assign(this, defaultState)
      this.persist()
    },
    persist() {
      if (this.autoSave) {
        saveToStorage(STORAGE_KEY, {
          soundEnabled: this.soundEnabled,
          theme: this.theme,
          animations: this.animations,
          language: this.language,
          autoSave: this.autoSave
        })
      }
    }
  }
})
