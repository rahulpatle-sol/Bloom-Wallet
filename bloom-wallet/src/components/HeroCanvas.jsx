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

    const frag = `
      precision highp float;
      uniform float uTime;
      uniform vec2 uRes;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / uRes;
        vec2 suv = uv * 2.0 - 1.0;
        suv.x *= uRes.x / uRes.y;

        // Warm cream base
        vec3 baseColor = vec3(0.98, 0.968, 0.945);

        // Soft organic floating shapes (like petals/light)
        vec2 p1 = vec2(sin(uTime * 0.2) * 0.7, cos(uTime * 0.15) * 0.5);
        vec2 p2 = vec2(cos(uTime * 0.18 + 2.0) * 0.8, sin(uTime * 0.12 + 1.0) * 0.6);
        vec2 p3 = vec2(sin(uTime * 0.25 + 4.0) * 0.5, cos(uTime * 0.22 + 3.0) * 0.45);
        vec2 p4 = vec2(cos(uTime * 0.15 + 1.5) * 0.9, sin(uTime * 0.2 + 2.5) * 0.7);

        float d1 = 1.0 - smoothstep(0.0, 1.4, length(suv - p1));
        float d2 = 1.0 - smoothstep(0.0, 1.2, length(suv - p2));
        float d3 = 1.0 - smoothstep(0.0, 1.1, length(suv - p3));
        float d4 = 1.0 - smoothstep(0.0, 0.9, length(suv - p4));

        // Bloom peachy-coral tones
        vec3 c1 = vec3(0.91, 0.66, 0.49) * d1 * 0.035;  // bloom coral
        vec3 c2 = vec3(0.48, 0.62, 0.47) * d2 * 0.03;   // sage green
        vec3 c3 = vec3(0.95, 0.77, 0.66) * d3 * 0.04;   // warm petal
        vec3 c4 = vec3(0.71, 0.58, 0.79) * d4 * 0.025;  // soft lavender

        vec3 col = baseColor + c1 + c2 + c3 + c4;

        // Subtle linen texture noise
        float noise = hash(uv * 500.0) * 0.008;
        col -= noise;

        // Soft vignette
        float vignette = 1.0 - smoothstep(0.5, 1.5, length(suv * 0.8));
        col = mix(col * vignette, col, 0.3);

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
