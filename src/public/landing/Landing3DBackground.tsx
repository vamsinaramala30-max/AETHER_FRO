import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Capability & Preferences Detection
function getDeviceTier() {
  if (typeof window === 'undefined') return 'desktop';
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isReducedMotion) return 'reduced-motion';
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

// ----------------------------------------------------
// 1. Floating Polyhedrons & Geometric Glass Shapes
// ----------------------------------------------------
interface PolyhedronProps {
  position: [number, number, number];
  rotationSpeed: [number, number, number];
  floatSpeed: number;
  floatAmplitude: number;
  scale: number;
  type: 'icosahedron' | 'octahedron' | 'torus' | 'dodecahedron' | 'sphere';
  color: string;
  wireframe?: boolean;
}

const FloatingPolyhedron: React.FC<PolyhedronProps> = ({
  position,
  rotationSpeed,
  floatSpeed,
  floatAmplitude,
  scale,
  type,
  color,
  wireframe = false,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialY = position[1];

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.x += rotationSpeed[0] * delta;
    meshRef.current.rotation.y += rotationSpeed[1] * delta;
    meshRef.current.rotation.z += rotationSpeed[2] * delta;
    meshRef.current.position.y = initialY + Math.sin(time * floatSpeed) * floatAmplitude;
  });

  const geometry = useMemo(() => {
    switch (type) {
      case 'icosahedron':
        return new THREE.IcosahedronGeometry(scale, 0);
      case 'octahedron':
        return new THREE.OctahedronGeometry(scale, 0);
      case 'torus':
        return new THREE.TorusGeometry(scale, scale * 0.35, 16, 32);
      case 'dodecahedron':
        return new THREE.DodecahedronGeometry(scale, 0);
      case 'sphere':
        return new THREE.SphereGeometry(scale, 24, 24);
      default:
        return new THREE.IcosahedronGeometry(scale, 0);
    }
  }, [type, scale]);

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  return (
    <mesh ref={meshRef} position={position} geometry={geometry}>
      <meshPhysicalMaterial
        color={color}
        wireframe={wireframe}
        transparent
        opacity={wireframe ? 0.35 : 0.45}
        roughness={0.1}
        metalness={0.8}
        clearcoat={0.9}
        clearcoatRoughness={0.1}
        transmission={wireframe ? 0 : 0.6}
        ior={1.3}
        thickness={0.5}
      />
    </mesh>
  );
};

// ----------------------------------------------------
// 2. Interactive Particle Field Component
// ----------------------------------------------------
interface ParticleFieldProps {
  count: number;
  isLightMode: boolean;
}

const ParticleField: React.FC<ParticleFieldProps> = ({ count, isLightMode }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const darkPalette = [
      new THREE.Color('#818cf8'), // Indigo
      new THREE.Color('#38bdf8'), // Cyan
      new THREE.Color('#c084fc'), // Purple
      new THREE.Color('#34d399'), // Emerald
    ];

    const lightPalette = [
      new THREE.Color('#4338ca'),
      new THREE.Color('#0284c7'),
      new THREE.Color('#7e22ce'),
      new THREE.Color('#059669'),
    ];

    const palette = isLightMode ? lightPalette : darkPalette;

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 35;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 35;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 25;

      const chosenColor = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = chosenColor.r;
      col[i * 3 + 1] = chosenColor.g;
      col[i * 3 + 2] = chosenColor.b;
    }

    return [pos, col];
  }, [count, isLightMode]);

  useFrame((_state, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.02;
    pointsRef.current.rotation.x += delta * 0.008;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={isLightMode ? 0.08 : 0.06}
        vertexColors
        transparent
        opacity={isLightMode ? 0.6 : 0.7}
        sizeAttenuation
        blending={isLightMode ? THREE.NormalBlending : THREE.AdditiveBlending}
      />
    </points>
  );
};

// ----------------------------------------------------
// 3. Floating Cybernetic Wireframe Grid Floor
// ----------------------------------------------------
const CyberGrid: React.FC<{ isLightMode: boolean }> = ({ isLightMode }) => {
  const gridRef = useRef<THREE.GridHelper>(null);

  useFrame((state) => {
    if (!gridRef.current) return;
    const time = state.clock.getElapsedTime();
    gridRef.current.position.z = (time * 0.5) % 2;
  });

  return (
    <gridHelper
      ref={gridRef}
      args={[40, 40, isLightMode ? 0x6366f1 : 0x818cf8, isLightMode ? 0xd1d5db : 0x1f2937]}
      position={[0, -10, 0]}
      rotation={[0, 0, 0]}
    />
  );
};

// ----------------------------------------------------
// 4. Mouse & Scroll Parallax Controller
// ----------------------------------------------------
const SceneController: React.FC<{
  mouse: React.MutableRefObject<{ x: number; y: number }>;
  scrollPosY: React.MutableRefObject<number>;
}> = ({ mouse, scrollPosY }) => {
  const { camera } = useThree();

  useFrame(() => {
    const scrollFactor = (scrollPosY.current / (document.body.scrollHeight || 1)) * 4;
    const targetX = mouse.current.x * 1.5;
    const targetY = -mouse.current.y * 1.2 - scrollFactor * 0.5;

    camera.position.x += (targetX - camera.position.x) * 0.03;
    camera.position.y += (targetY - camera.position.y) * 0.03;
    camera.lookAt(0, -scrollFactor * 0.3, 0);
  });

  return null;
};

// ----------------------------------------------------
// 5. CSS / 2D Fallback Renderer
// ----------------------------------------------------
const CSSFallbackBackground: React.FC<{ isLightMode: boolean }> = ({ isLightMode }) => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Ambient Gradient Orbs */}
      <div
        className={`absolute -left-20 top-1/6 h-[500px] w-[500px] animate-pulse rounded-full blur-[120px] transition-all duration-1000 ${
          isLightMode ? 'bg-indigo-300/30' : 'bg-indigo-600/15'
        }`}
      />
      <div
        className={`absolute -right-20 top-1/3 h-[600px] w-[600px] animate-pulse rounded-full blur-[140px] [animation-duration:8s] transition-all duration-1000 ${
          isLightMode ? 'bg-cyan-300/30' : 'bg-cyan-500/15'
        }`}
      />
      <div
        className={`absolute left-1/3 top-2/3 h-[550px] w-[550px] animate-pulse rounded-full blur-[130px] [animation-duration:10s] transition-all duration-1000 ${
          isLightMode ? 'bg-purple-300/25' : 'bg-purple-600/12'
        }`}
      />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.05),transparent_70%)]" />
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(${isLightMode ? '#000000' : '#ffffff'} 1px, transparent 1px), linear-gradient(90deg, ${
            isLightMode ? '#000000' : '#ffffff'
          } 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  );
};

// ----------------------------------------------------
// Main 3D Background Component with Auto-Fallback
// ----------------------------------------------------
export const Landing3DBackground: React.FC = () => {
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);
  const [deviceTier, setDeviceTier] = useState<string>('desktop');
  const [isLightMode, setIsLightMode] = useState<boolean>(false);
  const [isTabActive, setIsTabActive] = useState<boolean>(true);
  const mouse = useRef({ x: 0, y: 0 });
  const scrollPosY = useRef(0);

  // 1. WebGL Support Test & Device Capabilities
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
      }
    } catch {
      setHasWebGL(false);
    }

    setDeviceTier(getDeviceTier());

    const handleResize = () => {
      setDeviceTier(getDeviceTier());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 2. Dark / Light Mode Detection Listener
  useEffect(() => {
    const checkTheme = () => {
      const root = document.documentElement;
      const themeAttr = root.getAttribute('data-theme');
      const isLightClass = root.classList.contains('light');
      setIsLightMode(themeAttr === 'light' || isLightClass);
    };

    checkTheme();

    const observer = new MutationObserver(() => {
      checkTheme();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class'],
    });

    return () => observer.disconnect();
  }, []);

  // 3. Tab Visibility API Listener (Pause rendering when tab hidden)
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabActive(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // 4. Mouse & Scroll Listeners
  useEffect(() => {
    if (deviceTier === 'mobile' || deviceTier === 'reduced-motion') return;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    const handleScroll = () => {
      scrollPosY.current = window.scrollY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [deviceTier]);

  // If WebGL is unavailable or reduced motion is preferred, use CSS Fallback
  if (!hasWebGL || deviceTier === 'reduced-motion') {
    return <CSSFallbackBackground isLightMode={isLightMode} />;
  }

  const particleCount = deviceTier === 'mobile' ? 220 : deviceTier === 'tablet' ? 550 : 1200;
  const color1 = isLightMode ? '#6366f1' : '#818cf8';
  const color2 = isLightMode ? '#0284c7' : '#38bdf8';
  const color3 = isLightMode ? '#8b5cf6' : '#c084fc';
  const color4 = isLightMode ? '#059669' : '#34d399';

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Base Atmospheric Gradient */}
      <div
        className={`absolute inset-0 transition-colors duration-700 ${
          isLightMode
            ? 'bg-gradient-to-b from-slate-50 via-indigo-50/20 to-slate-100'
            : 'bg-gradient-to-b from-[#0B0D12] via-[#0D1017] to-[#08090D]'
        }`}
      />

      {/* Cyber Grid Lines Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(${isLightMode ? '#000000' : '#ffffff'} 1px, transparent 1px), linear-gradient(90deg, ${
            isLightMode ? '#000000' : '#ffffff'
          } 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Ambient Glowing Orbs */}
      <div
        className={`absolute -left-20 top-1/4 h-96 w-96 rounded-full blur-[140px] transition-all duration-1000 ${
          isLightMode ? 'bg-indigo-300/25' : 'bg-indigo-600/15'
        }`}
      />
      <div
        className={`absolute -right-20 top-1/2 h-[450px] w-[450px] rounded-full blur-[150px] transition-all duration-1000 ${
          isLightMode ? 'bg-cyan-300/25' : 'bg-cyan-500/15'
        }`}
      />

      {/* Three.js Canvas Container */}
      {isTabActive && (
        <Canvas
          camera={{ position: [0, 0, 15], fov: 60 }}
          gl={{ antialias: deviceTier === 'desktop', alpha: true, powerPreference: 'high-performance' }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
          className="h-full w-full"
        >
          <ambientLight intensity={isLightMode ? 0.9 : 0.5} />
          <pointLight position={[10, 10, 10]} intensity={isLightMode ? 1.5 : 2} color={color1} />
          <pointLight position={[-10, -10, -10]} intensity={isLightMode ? 1.2 : 1.5} color={color2} />
          <directionalLight position={[0, 15, 5]} intensity={1} color={color3} />

          {/* Mouse & Scroll Parallax Controller */}
          <SceneController mouse={mouse} scrollPosY={scrollPosY} />

          {/* Particle Field */}
          <ParticleField count={particleCount} isLightMode={isLightMode} />

          {/* Cyber Grid Floor */}
          {deviceTier === 'desktop' && <CyberGrid isLightMode={isLightMode} />}

          {/* Floating 3D Polyhedrons */}
          <FloatingPolyhedron
            position={[-7, 4, -4]}
            rotationSpeed={[0.2, 0.3, 0.1]}
            floatSpeed={1.2}
            floatAmplitude={0.6}
            scale={1.4}
            type="icosahedron"
            color={color1}
          />

          <FloatingPolyhedron
            position={[8, -3, -5]}
            rotationSpeed={[0.15, 0.25, 0.2]}
            floatSpeed={1}
            floatAmplitude={0.7}
            scale={1.6}
            type="torus"
            color={color2}
          />

          <FloatingPolyhedron
            position={[-5, -6, -3]}
            rotationSpeed={[0.3, 0.1, 0.25]}
            floatSpeed={1.4}
            floatAmplitude={0.5}
            scale={1.2}
            type="octahedron"
            color={color3}
            wireframe
          />

          {deviceTier === 'desktop' && (
            <>
              <FloatingPolyhedron
                position={[6, 5, -6]}
                rotationSpeed={[0.2, 0.2, 0.1]}
                floatSpeed={0.9}
                floatAmplitude={0.8}
                scale={1.1}
                type="dodecahedron"
                color={color4}
              />
              <FloatingPolyhedron
                position={[0, 7, -8]}
                rotationSpeed={[0.1, 0.3, 0.2]}
                floatSpeed={1.1}
                floatAmplitude={0.4}
                scale={1.3}
                type="icosahedron"
                color={color1}
                wireframe
              />
              <FloatingPolyhedron
                position={[-8, -1, -7]}
                rotationSpeed={[0.25, 0.15, 0.1]}
                floatSpeed={1.3}
                floatAmplitude={0.5}
                scale={1.5}
                type="torus"
                color={color3}
              />
              <FloatingPolyhedron
                position={[4, -8, -6]}
                rotationSpeed={[0.18, 0.22, 0.15]}
                floatSpeed={1.0}
                floatAmplitude={0.6}
                scale={1.0}
                type="sphere"
                color={color2}
              />
            </>
          )}
        </Canvas>
      )}
    </div>
  );
};
