import { useRef, useState } from "react";

type Props = {
  spriteUrl: string;
  frameWidth: number;
  frameHeight: number;
  columns: number;
  totalFrames: number;
};

export default function VideoThumbnailPreview({
  spriteUrl,
  frameWidth,
  frameHeight,
  columns,
  totalFrames,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState(0);
  const raf = useRef<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;

    if (raf.current) cancelAnimationFrame(raf.current);

    raf.current = requestAnimationFrame(() => {
      const rect = containerRef.current!.getBoundingClientRect();
      const percent = Math.min(
        Math.max((e.clientX - rect.left) / rect.width, 0),
        1
      );

      const nextFrame = Math.floor(percent * totalFrames);
      setFrame(nextFrame);
    });
  };

  const x = (frame % columns) * frameWidth;
  const y = Math.floor(frame / columns) * frameHeight;

  return (
    <div
      ref={containerRef}
      className="yt-thumbnail-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setFrame(0)}
    >
      <div
        className="yt-thumbnail-preview"
        style={{
          backgroundImage: `url(${spriteUrl})`,
          backgroundPosition: `-${x}px -${y}px`,
          backgroundSize: `${columns * frameWidth}px auto`,
        }}
      />

      {/* overlay giống YouTube */}
      <div className="yt-duration">12:34</div>
    </div>
  );
}
