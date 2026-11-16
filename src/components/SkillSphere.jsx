import { useEffect, useRef } from 'react'

/** A 3D rotating tag-sphere built with CSS transforms. Drag / hover to steer it. */
export default function SkillSphere({ words }) {
  const wrap = useRef(null)
  const itemsRef = useRef([])

  useEffect(() => {
    const el = wrap.current
    const n = words.length
    // Evenly distribute points on a sphere (Fibonacci sphere)
    const pts = words.map((_, i) => {
      const phi = Math.acos(-1 + (2 * i + 1) / n)
      const theta = Math.sqrt(n * Math.PI) * phi
      return [Math.cos(theta) * Math.sin(phi), Math.sin(theta) * Math.sin(phi), Math.cos(phi)]
    })

    let vx = 0.004
    let vy = 0.006
    let tx = vx
    let ty = vy
    let visible = true
    let raf = 0
    let radius = el.offsetWidth * 0.4

    const onResize = () => (radius = el.offsetWidth * 0.4)
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width
      const dy = (e.clientY - (r.top + r.height / 2)) / r.height
      ty = dx * 0.03
      tx = -dy * 0.03
    }
    const onLeave = () => {
      tx = 0.004
      ty = 0.006
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !raf) raf = requestAnimationFrame(tick)
    })
    io.observe(el)

    function tick() {
      if (!visible) {
        raf = 0
        return
      }
      vx += (tx - vx) * 0.05
      vy += (ty - vy) * 0.05
      const cx = Math.cos(vx)
      const sx = Math.sin(vx)
      const cy = Math.cos(vy)
      const sy = Math.sin(vy)
      for (let i = 0; i < n; i++) {
        let [x, y, z] = pts[i]
        // rotate around X
        const y1 = y * cx - z * sx
        const z1 = y * sx + z * cx
        // rotate around Y
        const x2 = x * cy + z1 * sy
        const z2 = -x * sy + z1 * cy
        pts[i] = [x2, y1, z2]
        const node = itemsRef.current[i]
        if (node) {
          const scale = 0.6 + (z2 + 1) * 0.35
          node.style.transform = `translate(-50%, -50%) translate3d(${x2 * radius}px, ${y1 * radius}px, ${z2 * radius}px) scale(${scale})`
          node.style.opacity = String(0.25 + (z2 + 1) * 0.375)
          node.style.zIndex = String(Math.round((z2 + 1) * 100))
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    window.addEventListener('resize', onResize)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', onResize)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [words])

  return (
    <div className="sphere" ref={wrap}>
      <div className="sphere-glow" />
      {words.map((w, i) => (
        <span key={w} ref={(node) => (itemsRef.current[i] = node)} className="sphere-tag">
          {w}
        </span>
      ))}
    </div>
  )
}
