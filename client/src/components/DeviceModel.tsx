import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense } from "react";
import { type Device } from "@shared/schema";

interface DeviceModelProps {
  device: Device;
}

function Model({ device }: DeviceModelProps) {
  const { scene } = useGLTF("https://models.readyplayer.me/smart-home.glb");
  
  return <primitive object={scene} />;
}

export default function DeviceModel({ device }: DeviceModelProps) {
  return (
    <div className="h-48 w-full">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <Model device={device} />
          <OrbitControls enableZoom={false} />
        </Suspense>
      </Canvas>
    </div>
  );
}
