// src/platform/LODDecisionEngine.ts

export function decideLOD(params: {
  isMobile: boolean
  hoverDuration: number
  scrubSpeed: number
}): "L1" | "L2" | "L3" {
  const { isMobile, hoverDuration, scrubSpeed } = params

  if (isMobile) return "L1"
  if (scrubSpeed > 1) return "L1"
  if (hoverDuration > 800) return "L3"
  if (hoverDuration > 300) return "L2"

  return "L1"
}
