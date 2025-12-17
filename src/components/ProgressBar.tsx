import { RefObject } from "react"

type Props = {
  videoRef: RefObject<HTMLVideoElement>
  onHover: (time: number | null, x: number) => void
}

export default function ProgressBar({ videoRef, onHover }: Props) {
  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current
    if (!video || !video.duration) return

    const rect = e.currentTarget.getBoundingClientRect()

    let percent = (e.clientX - rect.left) / rect.width
    percent = Math.max(0, Math.min(1, percent))

    const time = percent * video.duration
    onHover(time, e.clientX - rect.left)
  }

  return (
    <div
      onMouseMove={handleMove}
      onMouseLeave={() => onHover(null, 0)}
      style={{
        height: 8,
        width: "100%",
        background: "#444",
        marginTop: 8,
        cursor: "pointer"
      }}
    />
  )
}
