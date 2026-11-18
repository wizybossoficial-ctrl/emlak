"use client";

import { Component, Suspense, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

type Point = { name: string; position: [number, number, number]; camera: [number, number, number] };

const points: Point[] = [
  { name: "Living room", position: [-2.2, 1.2, 0.6], camera: [-5, 4, 6] },
  { name: "Kitchen", position: [2, 1.2, 0.6], camera: [5, 4, 6] },
  { name: "Master bedroom", position: [0, 1.3, -2.2], camera: [0, 5, -7] },
];

function Model({ path }: { path: string }) {
  const { scene } = useGLTF(path);
  return <primitive object={scene} />;
}

function DemoHouse() {
  return (
    <group>
      <mesh position={[0, -0.15, 0]} receiveShadow>
        <boxGeometry args={[9, 0.3, 7]} /><meshStandardMaterial color="#d5c9b8" />
      </mesh>
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <boxGeometry args={[8.4, 0.05, 6.4]} /><meshStandardMaterial color="#eae2d4" />
      </mesh>
      {[
        { p: [0, 1, -3.2], s: [8.4, 2, 0.12] },
        { p: [-4.2, 1, 0], s: [0.12, 2, 6.4] },
        { p: [4.2, 1, 0], s: [0.12, 2, 6.4] },
        { p: [0, 0.8, -1.1], s: [5.5, 1.6, 0.1] },
        { p: [0, 0.8, 1], s: [0.1, 1.6, 4.2] },
      ].map((wall, index) => (
        <mesh key={index} position={wall.p as [number, number, number]} castShadow receiveShadow>
          <boxGeometry args={wall.s as [number, number, number]} /><meshStandardMaterial color="#f6f1e8" />
        </mesh>
      ))}
      <mesh position={[-2.2, 0.35, 1.1]} castShadow><boxGeometry args={[2.4, 0.7, 1]} /><meshStandardMaterial color="#c2ad92" /></mesh>
      <mesh position={[-2.2, 0.72, 0.7]} castShadow><boxGeometry args={[2.4, 0.7, 0.25]} /><meshStandardMaterial color="#c2ad92" /></mesh>
      <mesh position={[-2.2, 0.25, 2.3]} castShadow><boxGeometry args={[1.3, 0.5, 0.65]} /><meshStandardMaterial color="#91765c" /></mesh>
      <mesh position={[2.5, 0.5, 0]} castShadow><boxGeometry args={[2.5, 1, 0.8]} /><meshStandardMaterial color="#a59580" /></mesh>
      <mesh position={[2.5, 1.03, 0]} castShadow><boxGeometry args={[2.6, 0.08, 0.9]} /><meshStandardMaterial color="#faf7ef" /></mesh>
      <mesh position={[2.3, 0.4, 2]} castShadow><boxGeometry args={[1.4, 0.8, 0.8]} /><meshStandardMaterial color="#c3b4a1" /></mesh>
      <mesh position={[0, 0.3, -2.1]} castShadow><boxGeometry args={[2.2, 0.6, 1.5]} /><meshStandardMaterial color="#b4a48f" /></mesh>
      <mesh position={[0, 0.65, -2.1]} castShadow><boxGeometry args={[2.1, 0.15, 1.4]} /><meshStandardMaterial color="#f7f3eb" /></mesh>
    </group>
  );
}

function Scene({ modelPath, hasModel, portal }: { modelPath: string; hasModel: boolean; portal: RefObject<HTMLElement> }) {
  const controls = useRef<OrbitControlsImpl>(null);
  const [destination, setDestination] = useState<THREE.Vector3 | null>(null);
  useFrame(({ camera }) => {
    if (destination) {
      camera.position.lerp(destination, 0.045);
      if (camera.position.distanceTo(destination) < 0.03) setDestination(null);
      controls.current?.update();
    }
  });
  return (
    <>
      <color attach="background" args={["#e8e4dc"]} />
      <ambientLight intensity={1.5} />
      <directionalLight position={[6, 10, 5]} intensity={2} castShadow />
      <Suspense fallback={<Html center portal={portal}><span className="canvas-loading">Loading model...</span></Html>}>
        {hasModel ? <Model path={modelPath} /> : <DemoHouse />}
      </Suspense>
      {points.map((point) => (
        <Html key={point.name} position={point.position} center portal={portal}>
          <button className="hotspot" onClick={() => setDestination(new THREE.Vector3(...point.camera))}>
            <span>+</span> {point.name}
          </button>
        </Html>
      ))}
      <OrbitControls ref={controls} makeDefault minDistance={3} maxDistance={20} maxPolarAngle={Math.PI / 2.05} onStart={() => setDestination(null)} />
    </>
  );
}

class TourErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error) {
    console.error("Unable to load the 3D tour:", error);
  }

  render() {
    if (this.state.failed) return <div className="tour-placeholder">Unable to load the 3D tour. Please check the model file or your browser&apos;s WebGL support.</div>;
    return this.props.children;
  }
}

export default function TourCanvas({ modelPath }: { modelPath: string }) {
  const [modelState, setModelState] = useState<"checking" | "available" | "demo">("checking");
  const portal = useRef<HTMLDivElement>(null!);
  useEffect(() => {
    const controller = new AbortController();
    fetch(modelPath, { signal: controller.signal }).then((response) => {
      const type = response.headers.get("content-type") || "";
      setModelState(response.ok && !type.includes("text/html") ? "available" : "demo");
    }).catch((error: unknown) => {
      if (!(error instanceof DOMException && error.name === "AbortError")) setModelState("demo");
    });
    return () => controller.abort();
  }, [modelPath]);

  if (modelState === "checking") return <div className="tour-placeholder">Preparing your tour...</div>;
  return (
    <div className="canvas-wrap">
      <TourErrorBoundary>
        <Canvas shadows camera={{ position: [9, 8, 10], fov: 40 }} dpr={[1, 1.5]}>
          <Scene modelPath={modelPath} hasModel={modelState === "available"} portal={portal} />
        </Canvas>
      </TourErrorBoundary>
      <div className="hotspot-layer" ref={portal} />
      <div className="canvas-note">{modelState === "demo" ? "Interactive concept model · Actual property may differ" : "Interactive property model"}<br />Drag to rotate · Scroll or pinch to zoom</div>
    </div>
  );
}
