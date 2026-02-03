export const baseDurations = {
  transition: 300,
  diceRoll: 2000,
  coinFlip: 1500,
  wheelSpin: 4000
}

export const easing = {
  standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
}

export const getSpeedMultiplier = (speed) => {
  if (speed === 'slow') return 1.2
  if (speed === 'fast') return 0.8
  return 1
}
