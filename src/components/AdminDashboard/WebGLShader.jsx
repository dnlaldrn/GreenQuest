import React, { useEffect, useRef } from "react";

export default function WebGLShader() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl;
    try {
      gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    } catch (e) {
      return;
    }
    if (!gl) return;

    const vs = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fs = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      varying vec2 v_texCoord;
      #define LINE_COUNT 25
      #define PI 3.14159265359

      float hash(float n) { return fract(sin(n) * 43758.5453123); }

      void main() {
        vec2 uv = v_texCoord;
        vec2 mouse = u_mouse / u_resolution;
        vec3 color = vec3(0.043, 0.067, 0.125); // #0B1120
        vec3 c1 = vec3(0.0, 1.0, 0.533);     // #00ff88
        vec3 c2 = vec3(0.133, 0.773, 0.369); // #22c55e
        vec3 c3 = vec3(0.086, 0.639, 0.290); // #16a34a
        vec3 c4 = vec3(0.518, 0.8, 0.086);   // #84cc16
        vec3 c5 = vec3(0.745, 0.949, 0.392); // #bef264

        float time = u_time * 0.4;

        for (int i = 0; i < LINE_COUNT; i++) {
          float i_f = float(i);
          float h = hash(i_f);
          float speed = 0.2 + h * 0.5;
          float y_pos = fract(h + time * 0.1 * speed);
          float wave = sin(uv.x * 2.0 * PI + time + h * 10.0) * 0.05;
          float distToMouse = length(uv - mouse);
          float bend = exp(-distToMouse * 5.0) * 0.12;
          float line_y = y_pos + wave - (mouse.y - 0.5) * 0.1;
          float thickness = 0.001 + h * 0.0015;
          float edge = 0.01;
          float intensity = smoothstep(thickness + edge, thickness, abs(uv.y - line_y + bend));
          
          vec3 lineColor;
          float colorSelect = fract(h * 3.0);
          if (colorSelect < 0.2) lineColor = c1;
          else if (colorSelect < 0.4) lineColor = c2;
          else if (colorSelect < 0.6) lineColor = c3;
          else if (colorSelect < 0.8) lineColor = c4;
          else lineColor = c5;

          intensity *= smoothstep(0.0, 0.2, uv.x) * smoothstep(1.0, 0.8, uv.x);
          color += lineColor * intensity * 0.35;
        }
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    function compileShader(src, type) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        return null;
      }
      return shader;
    }

    const vertexShader = compileShader(vs, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fs, gl.FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
        -1,  1,
         1, -1,
         1,  1,
      ]),
      gl.STATIC_DRAW
    );

    const positionLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "u_time");
    const uRes = gl.getUniformLocation(program, "u_resolution");
    const uMouse = gl.getUniformLocation(program, "u_mouse");

    let mouse = { x: canvas.width / 2, y: canvas.height / 2 };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        const nx = (e.clientX - rect.left) / rect.width;
        const ny = 1.0 - (e.clientY - rect.top) / rect.height;
        mouse.x = nx * canvas.width;
        mouse.y = ny * canvas.height;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    let animationFrameId;
    const resizeObserver = new ResizeObserver(() => {
      if (canvas) {
        canvas.width = canvas.clientWidth || 300;
        canvas.height = canvas.clientHeight || 200;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    });
    resizeObserver.observe(canvas);

    function render(time) {
      gl.uniform1f(uTime, time * 0.001);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    }
    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full block rounded-lg absolute inset-0 opacity-20 pointer-events-none" />;
}
