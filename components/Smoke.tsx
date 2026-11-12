"use client";

import { useEffect, useRef, useState } from "react";

const VERT = "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}";
// Domain-warped noise: slow, curling wisps that rise and fold like smoke.
const FRAG = `precision mediump float;
uniform vec2 r;uniform float t;uniform vec3 c1,c2,c3;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
 return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float a=.5,s=0.;for(int i=0;i<5;i++){s+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return s;}
void main(){
 vec2 uv=gl_FragCoord.xy/r;
 vec2 p=vec2(uv.x*r.x/r.y,uv.y)*1.9;
 float tt=t*.055;
 vec2 q=vec2(fbm(p+vec2(0.,-tt*2.2)),fbm(p+vec2(5.2,1.3)+vec2(tt,-tt*1.6)));
 vec2 w=vec2(fbm(p+3.2*q+vec2(1.7,9.2)+tt*.7),fbm(p+3.2*q+vec2(8.3,2.8)-tt));
 float f=fbm(p+3.6*w+vec2(0.,-tt*3.));
 vec3 col=mix(c3,c1,clamp(f*f*2.6,0.,1.));
 col=mix(col,c2,clamp(length(q)*.9,0.,1.)*.55);
 float a=smoothstep(.3,.9,f)*(.25+.75*uv.y)*.6;
 gl_FragColor=vec4(col*a,a);
}`;

/** Reads a CSS colour (any syntax the browser understands) as 0..1 RGB. */
function rgb(el: HTMLElement, value: string): [number, number, number] {
  el.style.color = value;
  const c = getComputedStyle(el).color;
  const nums = (c.match(/-?[\d.]+(e-?\d+)?/g) ?? []).map(Number);
  if (nums.length < 3) return [0.55, 0.77, 1];
  const scale = c.startsWith("color(") ? 1 : 255;
  return [nums[0] / scale, nums[1] / scale, nums[2] / scale];
}

/** Aurora that moves like smoke, in the theme's colours. Falls back to the CSS aurora when WebGL is unavailable. */
export default function Smoke() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [ok, setOk] = useState(true);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const gl = cv.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false });
    if (!gl) return setOk(false);
    const shader = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return setOk(false);
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = (name: string) => gl.getUniformLocation(prog, name);

    // Theme colour and its neighbouring hues (same recipe as the CSS aurora).
    const probe = document.createElement("span");
    probe.style.display = "none";
    cv.parentElement?.appendChild(probe);
    const relative = CSS.supports("color", "hsl(from red h s l)");
    gl.uniform3fv(u("c1"), rgb(probe, "var(--color-sky)"));
    gl.uniform3fv(u("c2"), rgb(probe, relative ? "hsl(from var(--color-royal-light) calc(h - 55) s l)" : "var(--color-royal-light)"));
    gl.uniform3fv(u("c3"), rgb(probe, relative ? "hsl(from var(--color-royal-light) calc(h + 50) s l)" : "var(--color-royal)"));
    probe.remove();

    const size = () => {
      // Rendered small and stretched: smoke is soft, so this costs little and looks the same.
      const w = Math.max(160, Math.round(cv.clientWidth / 4));
      const h = Math.max(120, Math.round(cv.clientHeight / 4));
      if (cv.width !== w || cv.height !== h) {
        cv.width = w;
        cv.height = h;
      }
      gl.viewport(0, 0, w, h);
      gl.uniform2f(u("r"), w, h);
    };
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = Math.random() * 600;
    let raf = 0;
    let visible = true;
    let last = 0;
    const draw = (now: number) => {
      raf = 0;
      if (now - last > 30) {
        last = now;
        size();
        gl.uniform1f(u("t"), start + (still ? 0 : now / 1000));
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
      if (visible && !still && document.visibilityState === "visible") raf = requestAnimationFrame(draw);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(draw); };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) kick(); });
    io.observe(cv);
    document.addEventListener("visibilitychange", kick);
    window.addEventListener("resize", kick);
    kick();
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", kick);
      window.removeEventListener("resize", kick);
    };
  }, []);

  if (!ok) return <div className="aurora"><span /><span /><span /><span /></div>;
  return <canvas ref={ref} className="smoke absolute inset-0 h-full w-full" />;
}
