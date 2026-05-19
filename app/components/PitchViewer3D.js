"use client";
import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Text, Environment } from "@react-three/drei";
import * as THREE from "three";

function PitchTerrain({ imageUrl }) {
  const meshRef = useRef();
  const texture = useMemo(() => {
    if (!imageUrl) return null;
    const tex = new THREE.TextureLoader().load(imageUrl);
    tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }, [imageUrl]);

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(6, 10, 64, 64);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // Simulate pitch terrain with subtle variation
      const centerDist = Math.sqrt(x * x + y * y);
      const noise = Math.sin(x * 2.5) * Math.cos(y * 1.8) * 0.08
        + Math.sin(x * 5 + y * 3) * 0.03
        + Math.cos(x * 8) * Math.sin(y * 6) * 0.015;
      // Slight bowl shape
      const bowl = centerDist * 0.01;
      pos.setZ(i, noise + bowl);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.01;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry} rotation={[-Math.PI / 2.5, 0, 0]} position={[0, -0.5, 0]}>
      {texture ? (
        <meshStandardMaterial map={texture} roughness={0.8} metalness={0.0} emissive="#555555" emissiveIntensity={0.3} side={THREE.DoubleSide} />
      ) : (
        <meshStandardMaterial color="#8B7355" roughness={0.8} metalness={0.0} emissive="#443322" emissiveIntensity={0.2} side={THREE.DoubleSide} />
      )}
    </mesh>
  );
}

function Stumps({ position }) {
  return (
    <group position={position}>
      {[-0.12, 0, 0.12].map((x, i) => (
        <mesh key={i} position={[x, 0.35, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.7, 8]} />
          <meshStandardMaterial color="#e8d5b7" roughness={0.6} />
        </mesh>
      ))}
      {/* Bails */}
      {[-0.06, 0.06].map((x, i) => (
        <mesh key={`bail-${i}`} position={[x, 0.72, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.01, 0.01, 0.12, 6]} />
          <meshStandardMaterial color="#d4c4a5" roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function CreaseLine({ position, width }) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2.5, 0, 0]}>
      <planeGeometry args={[width, 0.04]} />
      <meshStandardMaterial color="#ffffff" transparent opacity={0.5} side={THREE.DoubleSide} />
    </mesh>
  );
}

function CrackMarkers() {
  const cracks = [
    { pos: [0.3, 0.02, 0.5], rot: 0.3, len: 0.6 },
    { pos: [-0.5, 0.02, -0.3], rot: -0.2, len: 0.4 },
    { pos: [0.1, 0.02, -1.2], rot: 0.1, len: 0.5 },
    { pos: [-0.2, 0.02, 1.5], rot: -0.4, len: 0.3 },
  ];
  return cracks.map((c, i) => (
    <mesh key={i} position={c.pos} rotation={[-Math.PI / 2.5, c.rot, 0]}>
      <planeGeometry args={[0.03, c.len]} />
      <meshStandardMaterial color="#5a3d1a" transparent opacity={0.6} side={THREE.DoubleSide} />
    </mesh>
  ));
}

function AnnotationDot({ position, label, color = "#22c55e" }) {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = position[1] + 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });
  return (
    <group ref={ref} position={position}>
      <mesh>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
      <Text
        position={[0, 0.2, 0]}
        fontSize={0.12}
        color={color}
        anchorX="center"
        anchorY="bottom"
        font={undefined}
      >
        {label}
      </Text>
    </group>
  );
}

function Scene({ imageUrl }) {
  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 10, 5]} intensity={2} castShadow />
      <directionalLight position={[-5, 8, -3]} intensity={1} />
      <pointLight position={[0, 5, 0]} intensity={1.5} color="#ffeedd" />
      <pointLight position={[3, 4, 3]} intensity={0.8} color="#ffffff" />
      <hemisphereLight skyColor="#b1e1ff" groundColor="#886633" intensity={0.8} />

      <PitchTerrain imageUrl={imageUrl} />
      <Stumps position={[0, -0.15, -3.2]} />
      <Stumps position={[0, -0.15, 3.2]} />
      <CrackMarkers />

      <AnnotationDot position={[0.3, 0, 0.5]} label="Crack Zone" color="#ef4444" />
      <AnnotationDot position={[-0.8, 0, -1]} label="Dry Patch" color="#f59e0b" />
      <AnnotationDot position={[0.6, 0, -2]} label="Grass Cover" color="#22c55e" />

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        maxPolarAngle={Math.PI / 2.2}
        minDistance={3}
        maxDistance={15}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

export default function PitchViewer3D({ imageUrl, analyzing }) {
  return (
    <Canvas
      camera={{ position: [4, 5, 8], fov: 45 }}
      style={{ width: "100%", height: "100%", background: "#080c14" }}
      shadows
    >
      <Suspense fallback={null}>
        <Scene imageUrl={imageUrl} />
        <fog attach="fog" args={["#080c14", 18, 35]} />
      </Suspense>
    </Canvas>
  );
}
