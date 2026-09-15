"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const falls = [
  [-6.25, -0.35, 0.7, 3.8, 0.4],
  [-4.35, 0.22, 0.48, 2.9, 1.7],
  [4.45, 0.12, 0.55, 3.2, 2.9],
  [6.12, -0.42, 0.76, 4.05, 4.1],
] as const;

const vertexShader = `
  uniform float uTime;
  uniform float uSeed;
  varying vec2 vUv;
  void main(){
    vUv=uv;
    vec3 p=position;
    p.x += sin(uv.y*10.0 + uTime*1.4 + uSeed) * 0.025 * (1.0-uv.y);
    gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform float uSeed;
  varying vec2 vUv;
  float h(vec2 p){return fract(sin(dot(p,vec2(17.1,91.7)))*43758.5);}
  void main(){
    float edge=smoothstep(0.0,.13,vUv.x)*smoothstep(1.0,.87,vUv.x);
    float lanes=.4+.6*h(vec2(floor(vUv.x*22.0),uSeed));
    float fast=sin(vUv.y*120.0-uTime*9.0+sin(vUv.x*31.0)*2.0)*.5+.5;
    float slow=sin(vUv.y*39.0-uTime*4.0+uSeed)*.5+.5;
    float streak=pow(fast,.45)*.6+pow(slow,4.0)*.4;
    float foam=smoothstep(.72,1.0-vUv.y)*(.55+.45*sin(vUv.x*44.0+uTime*3.0));
    vec3 color=mix(vec3(.31,.53,.78),vec3(.82,.91,1.0),streak);
    float alpha=edge*(.2+streak*.42)*lanes + max(0.0,foam)*.22;
    gl_FragColor=vec4(color,alpha);
  }
`;

function Waterfall({ config, index }: { config: typeof falls[number]; index: number }) {
  const [x, y, width, height, seed] = config;
  const material = useRef<THREE.ShaderMaterial>(null);
  const mist = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uSeed: { value: seed } }), [seed]);
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (material.current) material.current.uniforms.uTime.value = time;
    if (mist.current) {
      mist.current.scale.x = 1 + Math.sin(time * 0.7 + index) * 0.16;
      (mist.current.material as THREE.MeshBasicMaterial).opacity = 0.12 + Math.sin(time * 1.1 + index) * 0.035;
    }
  });
  return (
    <group position={[x, y, 0.38]}>
      <mesh scale={[width, height, 1]}>
        <planeGeometry args={[1, 1, 12, 40]} />
        <shaderMaterial ref={material} uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={mist} position={[0, -height * 0.47, 0.08]} scale={[width * 2.3, 0.38, 1]}>
        <circleGeometry args={[1, 32]} />
        <meshBasicMaterial color="#d9edff" transparent opacity={0.13} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

export function LiveWaterfalls() {
  return <group>{falls.map((config, index) => <Waterfall key={index} config={config} index={index} />)}</group>;
}
