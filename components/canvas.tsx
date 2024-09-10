"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

export default function FullPageCanvas() {
  const [images, setImages] = useState<
    Array<{ url: string; x: number; y: number; width: number; height: number }>
  >([]);
  const [newImage, setNewImage] = useState<{
    url: string;
    width: number;
    height: number;
  } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewImage({
          url: event.target?.result as string,
          width: 100,
          height: 100,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (newImage) {
      setNewImage((prev) => ({
        ...prev!,
        [name]: Math.max(10, Math.min(500, parseInt(value) || 0)),
      }));
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (newImage && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Check if the new image overlaps with any existing images
      const overlap = images.some(
        (img) =>
          x < img.x + img.width &&
          x + newImage.width > img.x &&
          y < img.y + img.height &&
          y + newImage.height > img.y
      );

      if (!overlap) {
        setImages((prev) => [...prev, { ...newImage, x, y }]);
        setNewImage(null);
      }
    }
  };

  return (
    <div
      ref={canvasRef}
      className="fixed inset-0 bg-gray-100 cursor-crosshair"
      onClick={handleCanvasClick}
    >
      {images.map((image, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            left: `${image.x}px`,
            top: `${image.y}px`,
            width: `${image.width}px`,
            height: `${image.height}px`,
          }}
        >
          <img
            src={image.url}
            alt={`Image ${index}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      <Dialog>
        <DialogTrigger asChild>
          <Button className="fixed bottom-4 right-4 rounded-full w-12 h-12 p-0">
            <Plus className="h-6 w-6" />
            <span className="sr-only">Add Image</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-white text-">
          <DialogHeader>
            <DialogTitle>Add New Image</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imageUpload" className="text-right">
                Image
              </Label>
              <Input
                id="imageUpload"
                type="file"
                className="col-span-3"
                onChange={handleImageUpload}
                accept="image/*"
              />
            </div>
            {newImage && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="imageWidth" className="text-right">
                    Width (px)
                  </Label>
                  <Input
                    id="imageWidth"
                    type="number"
                    name="width"
                    value={newImage.width}
                    onChange={handleImageSizeChange}
                    className="col-span-3"
                    min="10"
                    max="500"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="imageHeight" className="text-right">
                    Height (px)
                  </Label>
                  <Input
                    id="imageHeight"
                    type="number"
                    name="height"
                    value={newImage.height}
                    onChange={handleImageSizeChange}
                    className="col-span-3"
                    min="10"
                    max="500"
                  />
                </div>
                <p className="text-sm text-gray-500">
                  Click on the canvas to place the image
                </p>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
