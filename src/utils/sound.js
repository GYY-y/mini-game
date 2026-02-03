let audioCtx
const getAudioCtx = () => {
  if (typeof window === 'undefined') return null
  if (audioCtx) return audioCtx
  audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  return audioCtx
}

const playTone = (freq = 440, duration = 0.15, type = 'sine') => {
  const ctx = getAudioCtx()
  if (!ctx) return
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.value = freq
  gain.gain.value = 0.15
  osc.connect(gain).connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + duration)
}

export const playDiceSound = () => {
  playTone(420, 0.08, 'triangle')
  setTimeout(() => playTone(520, 0.1, 'triangle'), 60)
}

export const playCoinSound = () => {
  playTone(660, 0.08, 'sine')
  setTimeout(() => playTone(880, 0.08, 'sine'), 70)
}

export const playWheelSound = () => {
  playTone(500, 0.1, 'square')
  setTimeout(() => playTone(600, 0.1, 'square'), 80)
}
