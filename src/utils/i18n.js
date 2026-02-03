import { useSettingsStore } from '@/stores/settings'

export const useText = () => {
  const settingsStore = useSettingsStore()
  const t = (zh, en) => (settingsStore.language === 'en-US' ? en : zh)
  return { t, language: settingsStore.language }
}
