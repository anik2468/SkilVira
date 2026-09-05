import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import { useRef } from "react";



const FloatingShape = () => {


const mesh = useRef();



useFrame((state)=>{


mesh.current.rotation.x =
state.clock.elapsedTime * 0.2;


mesh.current.rotation.y =
state.clock.elapsedTime * 0.3;



});



return (

<mesh ref={mesh}>


<icosahedronGeometry args={[1.5,1]} />


<meshStandardMaterial
color="#D4AF37"
metalness={0.8}
roughness={0.2}
/>


</mesh>

);


};





const Hero3D = ()=>{


return (

<div className="absolute inset-0 -z-10">


<Canvas
camera={{
position:[0,0,5]
}}
>


<ambientLight intensity={1}/>


<pointLight
position={[5,5,5]}
intensity={2}
/>



<Float
speed={2}
rotationIntensity={1}
floatIntensity={2}
>


<FloatingShape />


</Float>




<Stars
radius={50}
depth={30}
count={2000}
factor={3}
/>



</Canvas>



</div>

);


};



export default Hero3D;