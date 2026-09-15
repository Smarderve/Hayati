"use client";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { cinematicStore } from "@/src/experience/store";
export function WaterSurface() {
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uScroll: { value: 0 } }), []);
  useFrame((state) => { if (material.current) { material.current.uniforms.uTime.value = state.clock.elapsedTime; material.current.uniforms.uScroll.value = cinematicStore.progress; } });
  return <mesh position={[0, -2.34, 1.4]} rotation={[-Math.PI / 2.55, 0, 0]} scale={[15, 8, 1]}><planeGeometry args={[1, 1, 64, 32]} /><shaderMaterial ref={material} uniforms={uniforms} transparent depthWrite={false} vertexShader={`varying vec2 vUv; uniform float uTime; void main(){vUv=uv;vec3 p=position;p.z+=sin(p.x*32.+uTime*.8)*.006+sin(p.y*45.-uTime*.6)*.008;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`} fragmentShader={`varying vec2 vUv;uniform float uTime;uniform float uScroll;void main(){float r=sin(vUv.y*110.+uTime*1.3+sin(vUv.x*18.))*0.5+0.5;float moon=pow(max(0.,1.-abs(vUv.x-.53)*7.),3.);float edge=smoothstep(0.,.3,vUv.y);vec3 c=mix(vec3(.025,.06,.12),vec3(.3,.38,.53),moon*(.24+r*.28));gl_FragColor=vec4(c,(.24+r*.09)*edge);}`} /> </mesh>;
}
