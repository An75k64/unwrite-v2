"use client"

import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"

interface RotatingEarthProps {
  width?: number
  height?: number
  className?: string
}

export default function RotatingEarth({
  width = 800,
  height = 600,
  className = "",
}: RotatingEarthProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const context = canvas.getContext("2d")
    if (!context) return

    const containerWidth = Math.min(width, window.innerWidth - 40)
    const containerHeight = Math.min(height, window.innerHeight - 100)
    const radius = Math.min(containerWidth, containerHeight) / 2.5

    const dpr = window.devicePixelRatio || 1
    canvas.width = containerWidth * dpr
    canvas.height = containerHeight * dpr
    canvas.style.width = `${containerWidth}px`
    canvas.style.height = `${containerHeight}px`
    context.scale(dpr, dpr)

    const projection = d3
      .geoOrthographic()
      .scale(radius)
      .translate([containerWidth / 2, containerHeight / 2])
      .clipAngle(90)

    const path = d3.geoPath().projection(projection).context(context)

    const render = (land: any) => {
      context.clearRect(0, 0, containerWidth, containerHeight)

      context.beginPath()
      context.arc(
        containerWidth / 2,
        containerHeight / 2,
        projection.scale(),
        0,
        2 * Math.PI
      )
      context.fillStyle = "#000"
      context.fill()
      context.strokeStyle = "#fff"
      context.lineWidth = 1
      context.stroke()

      if (!land) return

      context.beginPath()
      land.features.forEach((feature: any) => path(feature))
      context.strokeStyle = "#fff"
      context.lineWidth = 0.6
      context.stroke()
    }

    const loadWorldData = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/martynafford/natural-earth-geojson/master/110m/physical/ne_110m_land.json"
        )
        if (!response.ok) throw new Error("Map load failed")

        const land = await response.json()

        let rotation: [number, number] = [0, 0]

        d3.timer(() => {
          rotation[0] += 0.3
          projection.rotate(rotation)
          render(land)
        })
      } catch {
        setError("World map load nahi ho raha")
      }
    }

    loadWorldData()
  }, [width, height])

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>
  }

  return (
    <div className={`relative flex justify-center ${className}`}>
      <canvas ref={canvasRef} className="rounded-xl bg-black" />
    </div>
  )
}
