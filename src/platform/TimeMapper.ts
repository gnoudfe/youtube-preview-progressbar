// src/platform/TimeMapper.ts

export function mapTimeToTile(
  time: number,
  level: {
    grid: number
    tile: { width: number; height: number }
    sprites: { count: number }
  },
  interval: number
) {
  const frameIndex = Math.floor(time / interval)
  const tilesPerSprite = level.grid * level.grid

  const spriteIndex = Math.floor(frameIndex / tilesPerSprite)
  const indexInSprite = frameIndex % tilesPerSprite

  const row = Math.floor(indexInSprite / level.grid)
  const col = indexInSprite % level.grid

  return { spriteIndex, row, col }
}
