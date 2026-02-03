export const generateRandomNumber = (min, max) => {
  const lower = Math.ceil(min)
  const upper = Math.floor(max)
  const result = Math.floor(Math.random() * (upper - lower + 1)) + lower
  return Math.max(lower, Math.min(result, upper))
}

export const calculateProbability = (stats, key) => {
  const total = Object.values(stats).reduce((sum, value) => sum + value, 0)
  if (total === 0) return 0
  return (stats[key] || 0) / total
}

export const validateDiceConfig = (config) => {
  const { count } = config
  return Number.isInteger(count) && count >= 1 && count <= 6
}

export const selectWheelPrize = (segments) => {
  const totalWeight = segments.reduce((sum, seg) => sum + (seg.weight || 0), 0)
  if (totalWeight === 0) return segments[0]

  const random = Math.random() * totalWeight
  let currentWeight = 0

  for (const segment of segments) {
    currentWeight += segment.weight || 0
    if (random <= currentWeight) {
      return segment
    }
  }

  return segments[segments.length - 1]
}
