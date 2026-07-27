"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function useViolinBodyShape() {
  return useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 4.6);
    shape.bezierCurveTo(1.5, 4.6, 2.1, 3.7, 1.9, 2.9);
    shape.bezierCurveTo(1.7, 2.1, 0.7, 1.9, 0.55, 1.15);
    shape.bezierCurveTo(0.42, 0.5, 1.9, 0.15, 2.0, -0.85);
    shape.bezierCurveTo(2.08, -1.7, 1.35, -2.3, 1.5, -3.15);
    shape.bezierCurveTo(1.6, -3.75, 1.15, -4.3, 0, -4.5);
    shape.bezierCurveTo(-1.15, -4.3, -1.6, -3.75, -1.5, -3.15);
    shape.bezierCurveTo(-1.35, -2.3, -2.08, -1.7, -2.0, -0.85);
    shape.bezierCurveTo(-1.9, 0.15, -0.42, 0.5, -0.55, 1.15);
    shape.bezierCurveTo(-0.7, 1.9, -1.7, 2.1, -1.9, 2.9);
    shape.bezierCurveTo(-2.1, 3.7, -1.5, 4.6, 0, 4.6);
    return shape;
  }, []);
}

const extrudeSettings: THREE.ExtrudeGeometryOptions = {
  depth: 0.5,
  bevelEnabled: true,
  bevelThickness: 0.08,
  bevelSize: 0.08,
  bevelSegments: 4,
  curveSegments: 24,
};

export function ViolinModel() {
  const group = useRef<THREE.Group>(null);
  const bodyLight = useRef<THREE.PointLight>(null);
  const shape = useViolinBodyShape();
  const { viewport } = useThree();

  const bodyGeo = useMemo(() => {
    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geo.scale(0.55, 0.55, 0.55);
    geo.center();
    return geo;
  }, [shape]);

  const stringXs = [-0.09, -0.03, 0.03, 0.09];

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const mx = (state.pointer.x || 0) * 0.35;
    const my = (state.pointer.y || 0) * 0.12;

    if (group.current) {
      group.current.rotation.y = -0.35 + Math.sin(t * 0.25) * 0.15 + mx;
      group.current.rotation.x = 0.15 + my;
      group.current.position.y = Math.sin(t * 0.6) * 0.18;
      group.current.position.x = mx * 0.6;
    }
    if (bodyLight.current) {
      bodyLight.current.intensity = 3.0 + Math.sin(t * 1.3) * 0.4;
    }
  });

  const scale = Math.min(1, viewport.width / 8);

  return (
    <group ref={group} scale={0.85 * scale} rotation={[0.15, -0.35, 0.08]}>
      <pointLight ref={bodyLight} position={[4, 5, 6]} intensity={3.2} color="#0d9488" distance={30} />

      {/* Body */}
      <mesh geometry={bodyGeo} position={[0, -0.3, 0]}>
        <meshPhysicalMaterial
          color="#0d9488"
          metalness={0.85}
          roughness={0.28}
          clearcoat={0.5}
          clearcoatRoughness={0.3}
          emissive="#0a3a35"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 2.5, 0.05]}>
        <boxGeometry args={[0.28, 2.3, 0.22]} />
        <meshPhysicalMaterial color="#241914" metalness={0.1} roughness={0.55} />
      </mesh>

      {/* Fingerboard */}
      <mesh position={[0, 2.5, 0.2]}>
        <boxGeometry args={[0.34, 2.0, 0.06]} />
        <meshPhysicalMaterial color="#100b08" metalness={0.2} roughness={0.4} />
      </mesh>

      {/* Scroll */}
      <mesh position={[0, 3.75, 0.05]} rotation={[0, 0, Math.PI / 2.4]}>
        <torusGeometry args={[0.26, 0.09, 12, 24, Math.PI * 1.5]} />
        <meshPhysicalMaterial color="#241914" metalness={0.1} roughness={0.55} />
      </mesh>

      {/* Tailpiece */}
      <mesh position={[0, -1.85, 0.28]}>
        <boxGeometry args={[0.22, 0.65, 0.1]} />
        <meshPhysicalMaterial color="#100b08" metalness={0.2} roughness={0.4} />
      </mesh>

      {/* Strings */}
      {stringXs.map((x) => (
        <mesh key={x} position={[x, 0.7, 0.28]}>
          <cylinderGeometry args={[0.006, 0.006, 6.1, 6]} />
          <meshBasicMaterial color="#2b2b2b" />
        </mesh>
      ))}

      {/* f-holes */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.75, -0.4, 0.31]} rotation={[0, 0, side * 0.28]}>
          <boxGeometry args={[0.08, 1.1, 0.05]} />
          <meshBasicMaterial color="#050403" />
        </mesh>
      ))}
    </group>
  );
}
