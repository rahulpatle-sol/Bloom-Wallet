import { useEffect, useRef } from 'react'

export default function HeroCanvas() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
    if (!gl) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    const vert = `
      attribute vec2 aPos;
      void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
    `
    // Premium Cream Light Mode Shader
    const frag = `
      precision highp float;
      uniform float uTime;
      uniform vec2 uRes;

      void main() {
        vec2 uv = gl_FragCoord.xy / uRes;
        vec2 suv = uv * 2.0 - 1.0;
        suv.x *= uRes.x / uRes.y;

        // Base cream color (Premium light mode)
        vec3 baseColor = vec3(0.97, 0.96, 0.94); // #F7F5F0

        // Soft animated orbs for light mode
        vec2 o1 = vec2(sin(uTime * 0.3) * 0.8, cos(uTime * 0.2) * 0.6);
        vec2 o2 = vec2(cos(uTime * 0.25) * 0.9, sin(uTime * 0.15) * 0.7);
        vec2 o3 = vec2(sin(uTime * 0.4 + 1.0) * 0.5, cos(uTime * 0.35) * 0.5);

        float d1 = 1.0 - smoothstep(0.0, 1.2, length(suv - o1));
        float d2 = 1.0 - smoothstep(0.0, 1.1, length(suv - o2));
        float d3 = 1.0 - smoothstep(0.0, 1.0, length(suv - o3));

        // Subtle tinting for the cream background
        vec3 c1 = vec3(0.0, 0.8, 0.5) * d1 * 0.04;  // Very faint Solana Green
        vec3 c2 = vec3(0.9, 0.8, 0.6) * d2 * 0.05;  // Warm gold/sand
        vec3 c3 = vec3(0.8, 0.85, 0.9) * d3 * 0.06; // Soft ice blue

        vec3 col = baseColor - c1 - c2 - c3; // Subtract to create depth on light bg

        // Subtle noise for a matte paper texture
        float noise = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
        col -= noise * 0.015;

        gl_FragColor = vec4(col, 1.0);
      }
    `

    function compile(type, src) {
      const s = gl.createShader(type)
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return s
    }

    const prog = gl.createProgram()
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vert))
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, frag))
    gl.linkProgram(prog)
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW)

    const aPos = gl.getAttribLocation(prog, 'aPos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const uTime = gl.getUniformLocation(prog, 'uTime')
    const uRes = gl.getUniformLocation(prog, 'uRes')

    let start = Date.now(), raf
    const render = () => {
      const t = (Date.now() - start) / 1000
      gl.uniform1f(uTime, t)
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      raf = requestAnimationFrame(render)
    }
    render()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
    }
  }, [])

  return <canvas id="hero-canvas" ref={ref} style={{ position: 'absolute', zIndex: -1, inset: 0 }} />
}