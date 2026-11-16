import { useRef } from 'react'

const canHover = typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches

/** Card that tilts in 3D toward the pointer, with a moving glare highlight. */
export default function TiltCard({ children, className = '', max = 12, style, ...rest }) {
  const ref = useRef(null)
  const frame = useRef(0)

  const onMove = (e) => {
    if (!canHover) return
    const el = ref.current
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      el.style.transform = `perspective(1000px) rotateX(${(0.5 - py) * max}deg) rotateY(${(px - 0.5) * max}deg) translateZ(0)`
      el.style.setProperty('--gx', `${px * 100}%`)
      el.style.setProperty('--gy', `${py * 100}%`)
    })
  }

  const onLeave = () => {
    cancelAnimationFrame(frame.current)
    if (ref.current) ref.current.style.transform = ''
  }

  return (
    <div
      ref={ref}
      className={`tilt ${className}`}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={style}
      {...rest}
    >
      {children}
      <span className="tilt-glare" aria-hidden="true" />
    </div>
  )
}
