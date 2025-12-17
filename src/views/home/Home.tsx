"use client";
import { useRef, useState } from "react";
import { decideLOD } from "@/platform/LODDecisionEngine";

type LoDConfig = {
  grid: number;
  frameWidth: number;
  frameHeight: number;
};

const LOD_CONFIG: Record<"L1" | "L2" | "L3", LoDConfig> = {
  L1: { grid: 10, frameWidth: 80, frameHeight: 45 },
  L2: { grid: 5, frameWidth: 160, frameHeight: 90 },
  L3: { grid: 3, frameWidth: 320, frameHeight: 180 },
};

const VIDEO_DURATION = 300; // seconds
const FRAME_INTERVAL = 5;

export default function VideoPreview() {
  const progressRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [preview, setPreview] = useState<any>(null);
  const [lod, setLod] = useState<"L1" | "L2" | "L3">("L2");
  const [dragging, setDragging] = useState(false);

  const hoverStart = useRef(0);
  const lastX = useRef<number | null>(null);
  const lastMoveTime = useRef(0);

  const seekAtPointer = (clientX: number) => {
    if (!progressRef.current || !videoRef.current || !videoRef.current.duration)
      return;
    const rect = progressRef.current.getBoundingClientRect();
    let percent = (clientX - rect.left) / rect.width;
    percent = Math.max(0, Math.min(1, percent));
    const newTime = percent * videoRef.current.duration;
    videoRef.current.currentTime = newTime;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!progressRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const time = Math.max(
      0,
      Math.min(VIDEO_DURATION, percent * VIDEO_DURATION)
    );

    // decide LOD based on hoverDuration + scrubSpeed
    const now = performance.now();
    let scrubSpeed = 0;
    if (lastX.current !== null) {
      scrubSpeed = Math.abs(e.clientX - lastX.current) / (now - lastMoveTime.current);
    }
    lastX.current = e.clientX;
    lastMoveTime.current = now;

    const decided = decideLOD({
      isMobile: /Mobi/i.test(navigator.userAgent),
      hoverDuration: now - hoverStart.current,
      scrubSpeed,
    });
    if (lod !== decided) setLod(decided);

    const { grid, frameWidth, frameHeight } = LOD_CONFIG[decided];

    const frameIndex = Math.floor(time / FRAME_INTERVAL);
    const framesPerSheet = grid * grid;
    const sheetIndex = Math.floor(frameIndex / framesPerSheet);
    const indexInSheet = frameIndex % framesPerSheet;
    const row = Math.floor(indexInSheet / grid);
    const col = indexInSheet % grid;

    setPreview({
      sheetIndex,
      x: -col * frameWidth,
      y: -row * frameHeight,
      width: frameWidth,
      height: frameHeight,
      time: Math.floor(time),
    });

    // If user is dragging, also seek video in real-time
    if (dragging) {
      seekAtPointer(e.clientX);
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <video ref={videoRef} src="/video.mp4" controls width={640} />

      {/* Progress bar */}
      <div
        ref={progressRef}
        onMouseEnter={() => {
          hoverStart.current = performance.now();
        }}
        onMouseDown={(e) => {
          setDragging(true);
          seekAtPointer(e.clientX);
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={() => setDragging(false)}
        onMouseLeave={() => {
          setPreview(null);
          lastX.current = null;
          setDragging(false);
        }}
        style={{
          position: "relative",
          height: 12,
          width: 640,
          background: "#444",
          marginTop: 20,
          cursor: "pointer",
        }}
      />

      {/* Preview */}
      {preview && (
        <div
          style={{
            position: "absolute",
            marginTop: 10,
            width: preview.width,
            height: preview.height,
            backgroundImage: `url(/sprites/${lod}/${lod}_M00${
              preview.sheetIndex + 1
            }.jpg)`,
            backgroundPosition: `${preview.x}px ${preview.y}px`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "auto",
            border: "1px solid #ccc",
          }}
        >
          <div
            style={{
              position: "absolute",
              bottom: -20,
              width: "100%",
              textAlign: "center",
              fontSize: 12,
              color: "#fff",
            }}
          >
            {preview.time}s
          </div>
        </div>
      )}
    </div>
  );
}
