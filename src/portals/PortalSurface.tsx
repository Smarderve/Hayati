"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { cinematicStore } from "@/src/experience/cinematicStore";

const vertexShader = `
  uniform float uTime;
  uniform float uNear;
  varying vec2 vUv;
  void main(){
    vUv=uv;
    vec3 p=position;
    p.z += sin(uv.y*18.0+uTime*2.0)*0.012*uNear;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uMap;
  uniform vec4 uRect;
  uniform float uTime;
  uniform float uNear;
  uniform float uKind;
  varying vec2 vUv;
  float archMask(vec2 uv){
    float x=abs(uv.x-.5)*2.0;
    float width=uv.y<.47?.76:.76*max(0.0,1.0-(uv.y-.47)/.53);
    return 1.0-smoothstep(width-.025,width+.012,x);
  }
  float pageMask(vec2 uv){
    vec2 p=abs(uv-.5)-vec2(.47,.45);
    float d=length(max(p,0.0))+min(max(p.x,p.y),0.0)-.035;
    return 1.0-smoothstep(-.018,.018,d);
  }
  void main(){
    float mask=mix(archMask(vUv),pageMask(vUv),uKind);
    vec2 ripple=vec2(
      sin(vUv.y*31.0+uTime*2.1),
      cos(vUv.x*27.0-uTime*1.7)
    )*(.0015+.009*uNear);
    vec2 sampleUv=uRect.xy+(vUv+ripple)*uRect.zw;
    vec3 color=texture2D(uMap,sampleUv).rgb;
    float sheen=pow(max(0.0,sin((vUv.x+vUv.y)*20.0-uTime*2.4)),12.0)*uNear;
    color+=vec3(.72,.82,1.0)*sheen*.28;
    if(mask<.01) discard;
    gl_FragColor=vec4(color,mask);
  }
`;

type PortalSurfaceProps = {
  texture: THREE.Texture;
  rect: [number, number, number, number];
  position: [number, number, number];
  scale: [number, number, number];
  kind: "arch" | "page";
};

export function PortalSurface({ texture, rect, position, scale, kind }: PortalSurfaceProps) {
  const surface = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const worldPosition = useMemo(() => new THREE.Vector3(), []);
  const uniforms = useMemo(() => ({
    uMap: { value: texture },
    uRect: { value: new THREE.Vector4(...rect) },
    uTime: { value: 0 },
    uNear: { value: 0 },
    uKind: { value: kind === "page" ? 1 : 0 },
  }), [texture, rect, kind]);

  useFrame((state, delta) => {
    if (!material.current) return;
    surface.current?.getWorldPosition(worldPosition);
    const distance = Math.abs(state.camera.position.z - worldPosition.z);
    const desired = THREE.MathUtils.clamp(1 - distance / 6, 0, 1);
    material.current.uniforms.uNear.value = THREE.MathUtils.damp(material.current.uniforms.uNear.value, desired + Math.min(0.35, Math.abs(cinematicStore.velocity) * 12), 5, delta);
    material.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh ref={surface} position={position} scale={scale}>
      <planeGeometry args={[1, 1, 24, 36]} />
      <shaderMaterial ref={material} uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} transparent depthWrite />
    </mesh>
  );
}
