"use client";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { cinematicStore } from "@/src/experience/store";
function Figure({x,hijab=false}:{x:number;hijab?:boolean}){const group=useRef<THREE.Group>(null);useFrame((s)=>{if(group.current)group.current.rotation.z=Math.sin(s.clock.elapsedTime*.55+x)*.015});return <group ref={group} position={[x,-2.18,2.2]} scale={.42}><mesh position={[0,.58,0]}><coneGeometry args={[.34,.95,12]}/><meshStandardMaterial color="#ddd6ca" roughness={.9}/></mesh><mesh position={[0,1.1,0]}><sphereGeometry args={[.15,16,12]}/><meshStandardMaterial color={hijab?"#e8e1d6":"#221c22"}/></mesh>{hijab&&<mesh position={[0,1.01,-.01]}><coneGeometry args={[.22,.48,16]}/><meshStandardMaterial color="#eee7dc" roughness={.92}/></mesh>}</group>}
export function DistantCharacters(){const thread=useRef<THREE.Mesh>(null);useFrame(()=>{if(thread.current){const m=thread.current.material as THREE.MeshBasicMaterial;m.opacity=.2+Math.sin(cinematicStore.progress*Math.PI*8)**2*.5;thread.current.scale.x=.78+cinematicStore.progress*.18;}});return <group><Figure x={-2.25}/><Figure x={2.25} hijab/><mesh ref={thread} position={[0,-1.72,2.1]} scale={[4.4,1,1]}><planeGeometry args={[1,.012]}/><meshBasicMaterial color="#e8b75f" transparent opacity={.42}/></mesh></group>}
