export const Direction = {
  LONG: 'buy',
  SHORT: 'sell'
}

export type Direction = typeof Direction[keyof typeof Direction]