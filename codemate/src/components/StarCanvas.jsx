"use client";

import React, { useState, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
// @ts-ignore
import * as random from "maath/random/dist/maath-random.esm";

const StarBackground = (props) => {
  const ref = useRef();

  // Generate sphere positions and ensure no NaN values
  const [sphere] = useState(() => {
    // Generate random positions within a sphere
    const positions = random.inSphere(new Float32Array(5000), { radius: 1.2 });

    // Ensure no NaN values exist in the array, replace with 0 if NaN is found
    for (let i = 0; i < positions.length; i++) {
      if (isNaN(positions[i])) {
        console.warn("NaN detected in sphere positions, replacing with 0");
        positions[i] = 0; // Replace NaN with a default value (0)
      }
    }

    return positions;
  });

  // Rotate the stars for animation
  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#fff"
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const StarsCanvas = () => (
  <div className="w-full h-auto fixed inset-0 z-[0]">
    <Canvas camera={{ position: [0, 0, 1] }}>
      <Suspense fallback={null}>
        <StarBackground />
      </Suspense>
    </Canvas>
  </div>
);

export default StarsCanvas;
