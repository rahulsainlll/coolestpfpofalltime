// "use client";

// import { useState, useRef, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
// import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";


// interface Image {
//   url: string;
//   width: number;
//   height: number;
// }

// interface PositionedImage extends Image {
//   x: number;
//   y: number;
// }

// export default function FullPageCanvas() {
//   const [images, setImages] = useState<Image[]>([]);
//   const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
//   const canvasRef = useRef<HTMLDivElement>(null);
//   const { isAuthenticated, user } = useKindeAuth();

//   useEffect(() => {
//     const updateCanvasSize = () => {
//       if (canvasRef.current) {
//         setCanvasSize({
//           width: canvasRef.current.offsetWidth,
//           height: canvasRef.current.offsetHeight,
//         });
//       }
//     };

//     updateCanvasSize();
//     window.addEventListener("resize", updateCanvasSize);
//     return () => window.removeEventListener("resize", updateCanvasSize);
//   }, []);



//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         setNewImage({
//           url: event.target?.result as string,
//           width: 100,
//           height: 100,
//         });
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleImageSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     if (newImage) {
//       setNewImage((prev) => ({
//         ...prev!,
//         [name]: Math.max(10, Math.min(500, parseInt(value) || 0)),
//       }));
//     }
//   };

//   const addImage = () => {
//     if (newImage) {
//       const updatedImages = [...images, newImage];
//       setImages(updatedImages);
//       setNewImage(null);
//       setIsDialogOpen(false);
//     }
//   };

//   const calculateImagePositions = (): PositionedImage[] => {
//     const positionedImages: PositionedImage[] = [];
//     const gaps: { x: number; y: number; width: number; height: number }[] = [
//       { x: 0, y: 0, width: canvasSize.width, height: Infinity },
//     ];

//     images.forEach((image) => {
//       let placed = false;
//       for (let i = 0; i < gaps.length; i++) {
//         const gap = gaps[i];
//         if (image.width <= gap.width && image.height <= gap.height) {
//           // Place the image in this gap
//           positionedImages.push({ ...image, x: gap.x, y: gap.y });
//           placed = true;

//           // Update gaps
//           if (image.width < gap.width) {
//             gaps.push({
//               x: gap.x + image.width,
//               y: gap.y,
//               width: gap.width - image.width,
//               height: image.height,
//             });
//           }
//           if (image.height < gap.height) {
//             gaps.push({
//               x: gap.x,
//               y: gap.y + image.height,
//               width: image.width,
//               height: gap.height - image.height,
//             });
//           }
//           gaps.splice(i, 1);
//           break;
//         }
//       }

//       if (!placed) {
//         // If no suitable gap was found, place at the bottom
//         const maxY = Math.max(
//           ...positionedImages.map((img) => img.y + img.height),
//           0
//         );
//         positionedImages.push({ ...image, x: 0, y: maxY });
//         gaps.push({
//           x: image.width,
//           y: maxY,
//           width: canvasSize.width - image.width,
//           height: Infinity,
//         });
//       }

//       // Sort gaps by y-coordinate, then x-coordinate
//       gaps.sort((a, b) => a.y - b.y || a.x - b.x);
//     });

//     return positionedImages;
//   }

//   const positionedImages = calculateImagePositions();

//   return (
//     <div ref={canvasRef} className="fixed inset-0 bg-gray-100 overflow-auto">
//       {positionedImages.map((image, index) => (
//         <div
//           key={index}
//           className="absolute"
//           style={{
//             left: `${image.x}px`,
//             top: `${image.y}px`,
//             width: `${image.width}px`,
//             height: `${image.height}px`,
//           }}
//         >
//           <img
//             src={image.url}
//             alt={`Image ${index}`}
//             className="w-full h-full object-cover"
//           />
//         </div>
//       ))}

//       <div className="fixed bottom-4 right-4">
//         {isAuthenticated ? (
//           <LogoutLink>
//             <Button>Log out</Button>
//           </LogoutLink>
//         ) : (
//           <LoginLink>
//             <Button>Sign in with X</Button>
//           </LoginLink>
//         )}
//       </div>
//     </div>
//   );
// }

import { RegisterLink, LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

const AuthLinks: React.FC = () => {
  return (
    <div>
      <LoginLink>Sign in</LoginLink>
      <RegisterLink>Sign up</RegisterLink>
      <LogoutLink>Log out</LogoutLink>
    </div>
  );
};

export default AuthLinks;
