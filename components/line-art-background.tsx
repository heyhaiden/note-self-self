"use client"

import { useEffect, useRef } from "react"

export default function LineArtBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions to match window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      drawLines()
    }

    // Draw abstract line art
    const drawLines = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.strokeStyle = "#f0f0f0"
      ctx.lineWidth = 1

      // Draw horizontal lines
      const horizontalLines = Math.floor(canvas.height / 100)
      for (let i = 0; i < horizontalLines; i++) {
        const y = (i * canvas.height) / horizontalLines
        ctx.beginPath()
        ctx.moveTo(0, y)

        // Create wavy lines
        for (let x = 0; x < canvas.width; x += 20) {
          const amplitude = Math.sin(x / 200) * 5
          ctx.lineTo(x, y + amplitude)
        }

        ctx.stroke()
      }

      // Draw vertical lines
      const verticalLines = Math.floor(canvas.width / 150)
      for (let i = 0; i < verticalLines; i++) {
        const x = (i * canvas.width) / verticalLines
        ctx.beginPath()
        ctx.moveTo(x, 0)

        // Create wavy lines
        for (let y = 0; y < canvas.height; y += 20) {
          const amplitude = Math.sin(y / 200) * 5
          ctx.lineTo(x + amplitude, y)
        }

        ctx.stroke()
      }

      // Draw some circles
      for (let i = 0; i < 5; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const radius = Math.random() * 100 + 50

        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.stroke()
      }
    }

    // Initial setup
    resizeCanvas()

    // Handle window resize
    window.addEventListener("resize", resizeCanvas)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none -z-1" aria-hidden="true" />

  )
}
