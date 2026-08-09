// "use client";

// import { Suspense, useEffect, useState } from "react";
// import { Canvas } from "@react-three/fiber";
// import { Sparkles } from "@react-three/drei";
// import { ViolinModel } from "./violin-model";

// export function HeroCanvas() {
//   const [fade, setFade] = useState(1);

//   useEffect(() => {
//     const onScroll = () => {
//       const progress = Math.min(1, window.scrollY / (window.innerHeight * 0.9));
//       setFade(1 - progress);
//     };
//     window.addEventListener("scroll", onScroll);
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   return (
//     <div
//       className="absolute inset-0 transition-opacity duration-150"
//       style={{ opacity: Math.max(fade, 0) }}
//     >
//       <Canvas
//         camera={{ position: [0, 0.4, 9], fov: 38 }}
//         gl={{ alpha: true, antialias: true }}
//         dpr={[1, 2]}
//       >
//         <ambientLight intensity={0.6} color="#33504c" />
//         <pointLight position={[-5, -2, 4]} intensity={1.8} color="#7c93ff" distance={30} />
//         <pointLight position={[0, 3, -6]} intensity={1} color="#ffffff" distance={30} />
//         <Suspense fallback={null}>
//           <ViolinModel />
//           <Sparkles
//             count={180}
//             scale={[9, 6, 5]}
//             size={2.2}
//             speed={0.25}
//             opacity={0.55}
//             color="#0d9488"
//             position={[0, 0, -2]}
//           />
//         </Suspense>
//       </Canvas>
//     </div>
//   );
// }
