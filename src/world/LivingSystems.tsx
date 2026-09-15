"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { SceneConfig } from "@/src/scenes/sceneData";

const flowVertex = `uniform float uTime;varying vec2 vUv;varying float vWave;void main(){vUv=uv;vec3 p=position;float w=sin(p.x*1.4+uTime*.8)*.05+sin(p.y*2.8-uTime*1.1)*.035;p.z+=w;vWave=w;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`;
const waterFragment = `uniform float uTime;uniform vec3 uColor;varying vec2 vUv;varying float vWave;void main(){float r=sin(vUv.y*145.-uTime*3.+sin(vUv.x*17.)*3.)*.5+.5;float lines=pow(r,12.);float moon=exp(-pow((vUv.x-.5)*5.,2.));vec3 c=mix(uColor,vec3(.58,.72,.88),lines*.42+max(vWave,0.));c+=vec3(.85,.61,.3)*moon*lines*.25;gl_FragColor=vec4(c,.88);}`;

export function LivingWater({ color, preview = false }: { color: string; preview?: boolean }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uColor: { value: new THREE.Color(color) } }), [color]);
  useFrame((state) => { if (material.current) material.current.uniforms.uTime.value = state.clock.elapsedTime; });
  return (
    <mesh position={[0, -3.05, preview ? -2 : 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[24, preview ? 22 : 34, 1]}>
      <planeGeometry args={[1, 1, 36, 64]} />
      <shaderMaterial ref={material} uniforms={uniforms} vertexShader={flowVertex} fragmentShader={waterFragment} side={THREE.DoubleSide} />
    </mesh>
  );
}

const fallVertex = `uniform float uTime;uniform float uSeed;varying vec2 vUv;void main(){vUv=uv;vec3 p=position;p.x+=sin(uv.y*12.+uTime*1.5+uSeed)*.025*(1.-uv.y);gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`;
const fallFragment = `uniform float uTime;uniform float uSeed;varying vec2 vUv;float h(vec2 p){return fract(sin(dot(p,vec2(17.1,91.7)))*43758.5);}void main(){float edge=smoothstep(0.,.12,vUv.x)*smoothstep(1.,.88,vUv.x);float lane=.35+.65*h(vec2(floor(vUv.x*19.),uSeed));float a=sin(vUv.y*130.-uTime*10.+sin(vUv.x*24.)*2.)*.5+.5;float b=sin(vUv.y*43.-uTime*4.3+uSeed)*.5+.5;float flow=pow(a,.55)*.58+pow(b,5.)*.42;vec3 c=mix(vec3(.32,.53,.76),vec3(.88,.95,1.),flow);gl_FragColor=vec4(c,edge*lane*(.18+flow*.56));}`;

function Waterfall({ x, z, seed }: { x: number; z: number; seed: number }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const mist = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uSeed: { value: seed } }), [seed]);
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (material.current) material.current.uniforms.uTime.value = time;
    if (mist.current) {
      mist.current.scale.x = 1.4 + Math.sin(time * .72 + seed) * .2;
      (mist.current.material as THREE.MeshBasicMaterial).opacity = .1 + Math.sin(time * 1.17 + seed) * .025;
    }
  });
  return (
    <group position={[x, -.35, z]}>
      <mesh scale={[.7, 4.6, 1]}><planeGeometry args={[1, 1, 10, 42]} /><shaderMaterial ref={material} uniforms={uniforms} vertexShader={fallVertex} fragmentShader={fallFragment} transparent depthWrite={false} blending={THREE.AdditiveBlending} /></mesh>
      <mesh ref={mist} position={[0, -2.14, .2]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.4, .55, 1]}><circleGeometry args={[1, 28]} /><meshBasicMaterial color="#dcecff" transparent opacity={.11} depthWrite={false} blending={THREE.AdditiveBlending} /></mesh>
    </group>
  );
}

export function WaterfallSystem({ enabled }: { enabled: boolean }) {
  if (!enabled) return null;
  return <><Waterfall x={-6.2} z={-7.7} seed={.7} /><Waterfall x={5.7} z={-9.4} seed={2.1} /><Waterfall x={-3.8} z={-11.1} seed={4.2} /></>;
}

function hash(index: number) { const value = Math.sin(index * 71.91 + 3.17) * 43758.5453; return value - Math.floor(value); }

export function Atmosphere({ config, preview = false }: { config: SceneConfig; preview?: boolean }) {
  const points = useRef<THREE.Points>(null);
  const cloud = useRef<THREE.Group>(null);
  const count = preview ? 90 : 260;
  const positions = useMemo(() => {
    const values = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      values[i * 3] = (hash(i * 3 + config.id) - .5) * 20;
      values[i * 3 + 1] = (hash(i * 3 + 1 + config.id) - .5) * 10;
      values[i * 3 + 2] = 8 - hash(i * 3 + 2 + config.id) * 26;
    }
    return values;
  }, [config.id, count]);
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (points.current) points.current.position.y = Math.sin(time * .18 + config.id) * .16;
    if (cloud.current) cloud.current.position.x = Math.sin(time * .035 + config.id) * 2.1;
  });
  return (
    <>
      <points ref={points} frustumCulled={false}><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry><pointsMaterial color={config.light} size={.035} transparent opacity={.42} depthWrite={false} blending={THREE.AdditiveBlending} /></points>
      <group ref={cloud} position={[0, 4.2, -10]}>
        {[-5.8, -2.8, .3, 3.4, 6.3].map((x, i) => <mesh key={x} position={[x, Math.sin(i) * .35, -i * .35]} scale={[3.3, .72, .5]}><sphereGeometry args={[1, 18, 10]} /><meshBasicMaterial color={config.horizon} transparent opacity={.12 + config.storm * .12} depthWrite={false} /></mesh>)}
      </group>
    </>
  );
}

function SwayTree({ position, phase }: { position: [number, number, number]; phase: number }) {
  const crown = useRef<THREE.Group>(null);
  useFrame((state) => { if (crown.current) crown.current.rotation.z = Math.sin(state.clock.elapsedTime * .55 + phase) * .035; });
  return (
    <group position={position}>
      <mesh position={[0, .65, 0]}><cylinderGeometry args={[.09, .17, 1.5, 8]} /><meshStandardMaterial color="#342f2b" /></mesh>
      <group ref={crown} position={[0, 1.65, 0]}>
        <mesh scale={[.65, 1.15, .62]}><sphereGeometry args={[1, 12, 8]} /><meshStandardMaterial color="#183b36" roughness={1} /></mesh>
        <mesh position={[.42, -.12, .1]} scale={[.48, .76, .45]}><sphereGeometry args={[1, 12, 8]} /><meshStandardMaterial color="#285146" roughness={1} /></mesh>
      </group>
    </group>
  );
}

export function Foliage() {
  return <>{[-7.2, -5.4, 5.5, 7.4].map((x, i) => <SwayTree key={x} position={[x, -3, -3 - i * 2.2]} phase={i * 1.4} />)}</>;
}
