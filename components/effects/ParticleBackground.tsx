"use client"

import { useEffect, useRef } from "react"

interface Particle {
    x: number
    y: number
    vx: number
    vy: number
    radius: number
}

export function ParticleBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const mouseRef = useRef({ x: 0, y: 0 })
    const particlesRef = useRef<Particle[]>([])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resizeCanvas()
        window.addEventListener("resize", resizeCanvas)

        // Initialize particles
        const particleCount = 80
        particlesRef.current = Array.from({ length: particleCount }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 2 + 1
        }))

        // Mouse tracking
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY }
        }
        window.addEventListener("mousemove", handleMouseMove)

        // Animation loop
        let animationId: number
        const animate = () => {
            ctx.fillStyle = "rgba(2, 2, 5, 0.1)"
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            particlesRef.current.forEach((particle, i) => {
                // Mouse interaction
                const dx = mouseRef.current.x - particle.x
                const dy = mouseRef.current.y - particle.y
                const distance = Math.sqrt(dx * dx + dy * dy)

                if (distance < 150) {
                    const force = (150 - distance) / 150
                    particle.vx += (dx / distance) * force * 0.05
                    particle.vy += (dy / distance) * force * 0.05
                }

                // Update position
                particle.x += particle.vx
                particle.y += particle.vy

                // Friction
                particle.vx *= 0.99
                particle.vy *= 0.99

                // Boundary check
                if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
                if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

                // Draw particle
                ctx.beginPath()
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
                ctx.fillStyle = "#00F0FF"
                ctx.fill()

                // Draw connections
                particlesRef.current.slice(i + 1).forEach(otherParticle => {
                    const dx = particle.x - otherParticle.x
                    const dy = particle.y - otherParticle.y
                    const distance = Math.sqrt(dx * dx + dy * dy)

                    if (distance < 120) {
                        ctx.beginPath()
                        ctx.moveTo(particle.x, particle.y)
                        ctx.lineTo(otherParticle.x, otherParticle.y)
                        ctx.strokeStyle = `rgba(0, 240, 255, ${1 - distance / 120})`
                        ctx.lineWidth = 0.5
                        ctx.stroke()
                    }
                })
            })

            animationId = requestAnimationFrame(animate)
        }
        animate()

        return () => {
            window.removeEventListener("resize", resizeCanvas)
            window.removeEventListener("mousemove", handleMouseMove)
            cancelAnimationFrame(animationId)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0"
            style={{ pointerEvents: "none" }}
        />
    )
}
