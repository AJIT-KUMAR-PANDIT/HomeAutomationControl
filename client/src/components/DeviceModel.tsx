import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useState, useFrame } from "react";
import { type Device } from "@shared/schema";

interface DeviceModelProps {
  device: Device;
}

function Light({ isOn }: { isOn: boolean }) {
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    state.camera.position.y = Math.sin(state.clock.elapsedTime / 2) * 0.2;
  });

  return (
    <mesh
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color={isOn ? "#ffdd00" : "#333333"}
        emissive={isOn ? "#ffdd00" : "#000000"}
        emissiveIntensity={hovered ? 2 : 1}
        roughness={0.1}
        metalness={0.8}
      />
    </mesh>
  );
}

function Thermostat({ isOn }: { isOn: boolean }) {
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    state.camera.position.y = Math.sin(state.clock.elapsedTime / 2) * 0.2;
  });

  return (
    <mesh
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <cylinderGeometry args={[0.8, 0.8, 0.3, 32]} />
      <meshStandardMaterial
        color={isOn ? "#4488ff" : "#333333"}
        emissive={isOn ? "#4488ff" : "#000000"}
        emissiveIntensity={hovered ? 2 : 1}
        roughness={0.1}
        metalness={0.8}
      />
    </mesh>
  );
}

export default function DeviceModel({ device }: DeviceModelProps) {
  return (
    <div className="h-48 w-full rounded-lg overflow-hidden bg-black/20 backdrop-blur-sm">
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        {device.type === "light" ? (
          <Light isOn={device.state} />
        ) : (
          <Thermostat isOn={device.state} />
        )}

        <OrbitControls
          enableZoom={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
}