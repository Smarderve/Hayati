"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { experienceStore } from "@/lib/experience-store";
import { bell, smooth } from "@/lib/math";
import { STORY } from "@/lib/narrative";

function seeded(seed: number) {
  const x = Math.sin(seed * 73.17) * 9137.31;
  return x - Math.floor(x);
}

export function GardenEnvironment() {
  const group = useRef<THREE.Group>(null);
  const stems = useRef<THREE.InstancedMesh>(null);
  const leaves = useRef<THREE.InstancedMesh>(null);
  const petals = useRef<THREE.InstancedMesh>(null);
  const dust = useRef<THREE.Points>(null);
  const stemMaterial = useRef<THREE.MeshStandardMaterial>(null);
  const leafMaterial = useRef<THREE.MeshStandardMaterial>(null);
  const petalMaterial = useRef<THREE.MeshStandardMaterial>(null);
  const groundMaterial = useRef<THREE.MeshBasicMaterial>(null);
  const waterMaterial = useRef<THREE.ShaderMaterial>(null);
  const bloom = useRef<THREE.Group>(null);
  const seenBloom = useRef(0);
  const bloomLife = useRef(0);
  const count = 64;
  const flowerCount = 18;
  const petalCount = flowerCount * 5;
  const dustPositions = useMemo(() => {
    const values = new Float32Array(120 * 3);
    for (let i = 0; i < 120; i += 1) {
      values[i * 3] = (seeded(i + 300) - 0.5) * 11;
      values[i * 3 + 1] = -2 + seeded(i + 512) * 4;
      values[i * 3 + 2] = 1.2 - seeded(i + 773) * 5;
    }
    return values;
  }, []);
  const waterUniforms = useMemo(() => ({ uTime: { value: 0 }, uOpacity: { value: 0 } }), []);

  useEffect(() => {
    if (!stems.current || !leaves.current || !petals.current) return;
    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    for (let i = 0; i < count; i += 1) {
      const x = (seeded(i + 4) - 0.5) * 11;
      const z = 2 - seeded(i + 72) * 5;
      const height = 0.42 + seeded(i + 130) * 1.42;
      const lean = (seeded(i + 99) - 0.5) * 0.2;
      position.set(x, -2.45 + height * 0.5, z);
      quaternion.setFromEuler(new THREE.Euler(0, 0, lean));
      scale.set(0.66 + seeded(i + 8) * 0.72, height, 0.66 + seeded(i + 9) * 0.72);
      matrix.compose(position, quaternion, scale);
      stems.current.setMatrixAt(i, matrix);
      position.set(x + lean * height * 0.25, -2.3 + height * 0.58, z + 0.02);
      quaternion.setFromEuler(new THREE.Euler(0.35, seeded(i + 21) * Math.PI, lean + (i % 2 ? 0.55 : -0.55)));
      scale.set(0.13 + seeded(i + 7) * 0.1, 0.28 + seeded(i + 16) * 0.16, 0.06);
      matrix.compose(position, quaternion, scale);
      leaves.current.setMatrixAt(i, matrix);
      if (i < flowerCount) {
        for (let petal = 0; petal < 5; petal += 1) {
          const index = i * 5 + petal;
          const angle = (petal / 5) * Math.PI * 2 + seeded(i) * 0.5;
          const bloomSize = 0.06 + seeded(i + 160) * 0.048;
          position.set(x + Math.cos(angle) * bloomSize * 0.55, -2.42 + height + Math.sin(angle) * bloomSize * 0.38, z);
          quaternion.setFromEuler(new THREE.Euler(0.2, 0, angle - Math.PI / 2));
          scale.set(bloomSize * 0.72, bloomSize * 1.25, 0.025);
          matrix.compose(position, quaternion, scale);
          petals.current.setMatrixAt(index, matrix);
        }
      }
    }
    stems.current.instanceMatrix.needsUpdate = true;
    leaves.current.instanceMatrix.needsUpdate = true;
    petals.current.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame((state, delta) => {
    const p = experienceStore.progress;
    const visible = bell(p, STORY.everything.focus, STORY.garden.in + 0.05, STORY.future.in + 0.15, STORY.letter.in);
    const awakening = smooth(p, STORY.everything.focus - 0.025, STORY.garden.focus);
    if (group.current) {
      group.current.position.y = THREE.MathUtils.lerp(-0.82, 0, visible);
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.035) * 0.018 + experienceStore.pointer.x * 0.012;
    }
    if (stemMaterial.current) stemMaterial.current.opacity = visible * 0.86;
    if (leafMaterial.current) leafMaterial.current.opacity = visible * 0.58;
    if (petalMaterial.current) {
      petalMaterial.current.opacity = visible * awakening * 0.82;
      petalMaterial.current.emissiveIntensity = 0.22 + awakening * 0.45;
    }
    if (groundMaterial.current) groundMaterial.current.opacity = visible * 0.58;
    if (waterMaterial.current) {
      waterMaterial.current.uniforms.uTime.value = state.clock.elapsedTime;
      waterMaterial.current.uniforms.uOpacity.value = visible * 0.34;
    }
    if (dust.current) {
      (dust.current.material as THREE.PointsMaterial).opacity = visible * (0.28 + experienceStore.stillness * 0.26);
      dust.current.rotation.y = state.clock.elapsedTime * 0.012;
      dust.current.position.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.07;
    }
    if (seenBloom.current !== experienceStore.bloomPulse) {
      seenBloom.current = experienceStore.bloomPulse;
      bloomLife.current = 1;
      bloom.current?.position.set(experienceStore.pointer.x * 2.55, -1.38 + experienceStore.pointer.y * 0.28, 1.3);
    }
    bloomLife.current = Math.max(0, bloomLife.current - delta * 0.12);
    if (bloom.current) {
      const opening = Math.min(1, (1 - bloomLife.current) * 7);
      bloom.current.scale.setScalar(visible * opening * (0.9 + Math.sin(state.clock.elapsedTime * 0.6) * 0.025));
      bloom.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.025;
    }
  });

  return (
    <group ref={group}>
      <instancedMesh ref={stems} args={[undefined, undefined, count]}><cylinderGeometry args={[0.016, 0.027, 1, 6]} /><meshStandardMaterial ref={stemMaterial} color="#17131a" transparent opacity={0} roughness={1} /></instancedMesh>
      <instancedMesh ref={leaves} args={[undefined, undefined, count]}><sphereGeometry args={[1, 8, 5]} /><meshStandardMaterial ref={leafMaterial} color="#211824" transparent opacity={0} roughness={1} /></instancedMesh>
      <instancedMesh ref={petals} args={[undefined, undefined, petalCount]}><sphereGeometry args={[1, 10, 6]} /><meshStandardMaterial ref={petalMaterial} color="#503748" emissive="#321d2d" emissiveIntensity={0.18} transparent opacity={0} roughness={0.86} /></instancedMesh>
      <mesh position={[0, -2.52, -1.5]} rotation={[-Math.PI / 2, 0, 0]} scale={[10, 9, 1]}><planeGeometry args={[1, 1]} /><meshBasicMaterial ref={groundMaterial} color="#08070a" transparent opacity={0} /></mesh>
      <mesh position={[0.7, -2.48, 0.15]} rotation={[-Math.PI / 2, 0, -0.08]} scale={[5.2, 2.25, 1]}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial ref={waterMaterial} uniforms={waterUniforms} transparent depthWrite={false} vertexShader={`varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`} fragmentShader={`varying vec2 vUv; uniform float uTime; uniform float uOpacity; void main(){float ripple=sin(vUv.y*82.+uTime*.34)*.5+.5; float beam=smoothstep(.18,.52,vUv.x)*smoothstep(.88,.54,vUv.x); float edge=smoothstep(0.,.18,vUv.y)*smoothstep(1.,.8,vUv.y); gl_FragColor=vec4(vec3(.42,.38,.48), uOpacity*beam*edge*(.12+ripple*.09));}`} />
      </mesh>
      <points ref={dust}><bufferGeometry><bufferAttribute attach="attributes-position" args={[dustPositions, 3]} /></bufferGeometry><pointsMaterial color="#c0a3ad" size={0.024} transparent opacity={0} depthWrite={false} /></points>
      <SecretBloom ref={bloom} />
    </group>
  );
}

const SecretBloom = function SecretBloom({ ref }: { ref: React.Ref<THREE.Group> }) {
  return (
    <group ref={ref} scale={0}>
      <mesh position={[0, -0.43, 0]}><cylinderGeometry args={[0.012, 0.018, 0.86, 7]} /><meshStandardMaterial color="#26202a" roughness={1} /></mesh>
      {Array.from({ length: 8 }, (_, index) => {
        const angle = (index / 8) * Math.PI * 2;
        return <mesh key={index} position={[Math.cos(angle) * 0.11, 0.02 + Math.sin(angle) * 0.08, 0]} rotation={[0.15, 0, angle - Math.PI / 2]} scale={[0.085, 0.17, 0.028]}><sphereGeometry args={[1, 12, 8]} /><meshStandardMaterial color="#a16d8a" emissive="#6a3559" emissiveIntensity={0.8} roughness={0.72} /></mesh>;
      })}
      <mesh position={[0, 0.02, 0.035]}><sphereGeometry args={[0.045, 12, 12]} /><meshBasicMaterial color="#ddbdad" /></mesh>
    </group>
  );
};
