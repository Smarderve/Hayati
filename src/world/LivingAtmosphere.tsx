"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { cinematicStore } from "@/src/experience/cinematicStore";

function hash(index: number) {
  const value = Math.sin(index * 44.731 + 7.19) * 17391.193;
  return value - Math.floor(value);
}

function ParticleField() {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const values = new Float32Array(760 * 3);
    for (let index = 0; index < 760; index += 1) {
      values[index * 3] = (hash(index * 3) - 0.5) * 25;
      values[index * 3 + 1] = (hash(index * 3 + 1) - 0.5) * 12;
      values[index * 3 + 2] = 10 - hash(index * 3 + 2) * 58;
    }
    return values;
  }, []);
  useFrame((state) => {
    if (!points.current) return;
    points.current.position.y = Math.sin(state.clock.elapsedTime * 0.17) * 0.12;
    points.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.035) * 0.015;
    const material = points.current.material as THREE.PointsMaterial;
    material.opacity = 0.38 + Math.min(0.22, Math.abs(cinematicStore.velocity) * 8);
  });
  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial color="#f3deb5" size={0.025} transparent opacity={0.4} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function CloudVeil({ position, scale, speed }: { position: [number, number, number]; scale: [number, number, number]; speed: number }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uSpeed: { value: speed } }), [speed]);
  useFrame((state) => { if (material.current) material.current.uniforms.uTime.value = state.clock.elapsedTime; });
  return (
    <mesh position={position} scale={scale}>
      <planeGeometry args={[1, 1, 32, 8]} />
      <shaderMaterial ref={material} uniforms={uniforms} transparent depthWrite={false} vertexShader={`uniform float uTime;uniform float uSpeed;varying vec2 vUv;void main(){vUv=uv;vec3 p=position;p.x+=sin(p.y*5.0+uTime*uSpeed)*.08;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`} fragmentShader={`varying vec2 vUv;uniform float uTime;float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1)),f.x),f.y);}void main(){vec2 uv=vUv;float cloud=n(vec2(uv.x*5.-uTime*.025,uv.y*3.));cloud*=smoothstep(0.,.3,uv.y)*smoothstep(1.,.65,uv.y)*smoothstep(0.,.18,uv.x)*smoothstep(1.,.82,uv.x);gl_FragColor=vec4(.56,.65,.78,cloud*.13);}`} />
    </mesh>
  );
}

function Birds() {
  const flock = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!flock.current) return;
    flock.current.position.x = ((state.clock.elapsedTime * 0.22) % 16) - 8;
    flock.current.position.y = 2.9 + Math.sin(state.clock.elapsedTime * 0.9) * 0.15;
  });
  return (
    <group ref={flock} position={[-7, 3, -4]}>
      {[0, 1, 2, 3, 4].map((index) => (
        <group key={index} position={[index * 0.42, Math.sin(index) * 0.25, -index * 0.2]} rotation={[0, 0, index % 2 ? 0.2 : -0.2]}>
          <mesh position={[-0.07, 0, 0]} rotation={[0, 0, 0.45]} scale={[0.14, 0.018, 0.02]}><boxGeometry /><meshBasicMaterial color="#d8e3ee" /></mesh>
          <mesh position={[0.07, 0, 0]} rotation={[0, 0, -0.45]} scale={[0.14, 0.018, 0.02]}><boxGeometry /><meshBasicMaterial color="#d8e3ee" /></mesh>
        </group>
      ))}
    </group>
  );
}

export function LivingAtmosphere() {
  return (
    <>
      <ParticleField />
      <CloudVeil position={[0, 2.7, 1.2]} scale={[21, 4.8, 1]} speed={0.14} />
      <CloudVeil position={[0, 2.2, -21.5]} scale={[22, 4.5, 1]} speed={0.09} />
      <Birds />
    </>
  );
}
