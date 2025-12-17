// src/hooks/useThumbnailPreview.ts

import { useEffect, useRef, useState } from "react"
import { metadataStore } from "../platform/MetadataStore"
import { decideLOD } from "../platform/LODDecisionEngine"
import { mapTimeToTile } from "../platform/TimeMapper"
import { spriteLoader } from "../platform/SpriteLoader"

export function useThumbnailPreview(videoId: string) {
  const [state, setState] = useState({
    visible: false,
    imageUrl: null as string | null,
    backgroundPosition: "0px 0px",
    backgroundSize: "0px 0px",
    width: 0,
    height: 0
  })

  const hoverStart = useRef(0)
  const lastX = useRef<number | null>(null)
  const lastMoveTime = useRef(0)

  useEffect(() => {
    metadataStore.load(videoId)
  }, [videoId])

  function show() {
    hoverStart.current = performance.now()
    setState(s => ({ ...s, visible: true }))
  }

  function hide() {
    setState(s => ({ ...s, visible: false }))
    lastX.current = null
  }

  async function updateTime(time: number, clientX: number) {
    const metadata = metadataStore.get()
    console.log('metadata',metadata)
    const now = performance.now()

    let scrubSpeed = 0
    if (lastX.current !== null) {
      scrubSpeed = Math.abs(clientX - lastX.current) / (now - lastMoveTime.current)
    }

    lastX.current = clientX
    lastMoveTime.current = now

    const lod = decideLOD({
      isMobile: /Mobi/i.test(navigator.userAgent),
      hoverDuration: now - hoverStart.current,
      scrubSpeed
    })

    const level = metadata.levels.find(l => l.id === lod)!
    const tile = mapTimeToTile(time, level, metadata.thumbnailInterval)

    const imageUrl = level.sprites.urlTemplate.replace(
      "{index}",
      String(tile.spriteIndex + 1)
    )
    console.log('imageUrl',imageUrl)

    try {
      await spriteLoader.load(imageUrl)
    } catch {
      return
    }

    setState({
      visible: true,
      imageUrl,
      backgroundPosition: `-${tile.col * level.tile.width}px -${tile.row * level.tile.height}px`,
      backgroundSize: `${level.grid * level.tile.width}px ${level.grid * level.tile.height}px`,
      width: level.tile.width,
      height: level.tile.height
    })
  }

  return { show, hide, updateTime, state }
}
