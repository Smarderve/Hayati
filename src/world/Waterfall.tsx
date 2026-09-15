"use client";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
const falls = [[-4.7,.15,.72,2.9],[-3.15,.45,.48,2.2],[3.25,.34,.54,2.6],[4.82,.04,.66,3.1]] as const;
export function Waterfalls() {
  const materials = useRef<THREE.ShaderMaterial[]>([]);
  const uniforms = useMemo(() => falls.map((_, index) => ({ uTime:{value:0},uSeed:{value:(index * 2.173 + 0.71) % 8} })), []);
  useFrame((state) => materials.current.forEach((m,i) => { if(m) m.uniforms.uTime.value=state.clock.elapsedTime+i*.8; }));
  return <group position={[0,.15,-1.7]}>{falls.map(([x,y,w,h],i)=><mesh key={i} position={[x,y,0]} scale={[w,h,1]}><planeGeometry args={[1,1]} /><shaderMaterial ref={(n)=>{if(n)materials.current[i]=n;}} uniforms={uniforms[i]} transparent depthWrite={false} blending={THREE.AdditiveBlending} vertexShader={`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`} fragmentShader={`varying vec2 vUv;uniform float uTime;uniform float uSeed;float h(vec2 p){return fract(sin(dot(p,vec2(17.1,91.7)))*43758.5);}void main(){float lane=smoothstep(.18,.45,h(vec2(floor(vUv.x*14.),uSeed)));float flow=sin(vUv.y*85.-uTime*5.+vUv.x*11.)*.5+.5;float edge=smoothstep(0.,.18,vUv.x)*smoothstep(1.,.82,vUv.x);float foam=smoothstep(.72,1.,flow);gl_FragColor=vec4(vec3(.55,.72,.96),(lane*.16+foam*.16)*edge);}`} /></mesh>)}</group>;
}
