"use client"

import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react"

export function GradientBg() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <ShaderGradientCanvas>
        <ShaderGradient
          type="plane"
          color1="#F5E6D3"
          color2="#FFECD2"
          color3="#FFC89A"
          cAzimuthAngle={180}
          cPolarAngle={70}
          cDistance={2.5}
          uSpeed={0.4}
          uTime={0}
          uDensity={1.2}
          uFrequency={1.6}
          uAmplitude={1.8}
        />
      </ShaderGradientCanvas>
    </div>
  )
}
