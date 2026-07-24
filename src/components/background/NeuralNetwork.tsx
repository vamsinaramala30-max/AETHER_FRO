import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const NeuralNetwork: React.FC<{ color?: string }> = ({ color = "#3B82F6" }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const count = 40;

  const [nodes, lines] = useMemo(() => {
    const nodeCoords: THREE.Vector3[] = [];
    for (let i = 0; i < count; i++) {
      nodeCoords.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 12
        )
      );
    }

    const linePositions: number[] = [];
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        if (nodeCoords[i].distanceTo(nodeCoords[j]) < 3.5) {
          linePositions.push(
            nodeCoords[i].x, nodeCoords[i].y, nodeCoords[i].z,
            nodeCoords[j].x, nodeCoords[j].y, nodeCoords[j].z
          );
        }
      }
    }
    return [nodeCoords, new Float32Array(linePositions)];
  }, [count]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
      groupRef.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[lines, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color={color} transparent opacity={0.3} depthWrite={false} />
      </lineSegments>
      {nodes.map((pos, idx) => (
        <mesh key={idx} position={pos}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial color="#00E5FF" transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
};