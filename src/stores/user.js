import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    nickname: '游客',
    lastActiveAt: Date.now()
  }),
  actions: {
    setNickname(name) {
      this.nickname = name
      this.lastActiveAt = Date.now()
    },
    touch() {
      this.lastActiveAt = Date.now()
    }
  }
})
