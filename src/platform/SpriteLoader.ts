// src/platform/SpriteLoader.ts

class SpriteLoader {
  private cache = new Set<string>()

  async load(url: string) {
    if (this.cache.has(url)) return

    await new Promise<void>((resolve, reject) => {
      const img = new Image()
      img.src = url
      img.onload = () => resolve()
      img.onerror = () => reject()
    })

    this.cache.add(url)
  }

  preload(url: string) {
    if (this.cache.has(url)) return
    const img = new Image()
    img.src = url
  }

  isCached(url: string) {
    return this.cache.has(url)
  }
}

export const spriteLoader = new SpriteLoader()
