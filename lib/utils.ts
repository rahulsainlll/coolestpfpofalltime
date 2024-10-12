import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function imgResize(imageUrl :string) {
  const params = new URLSearchParams()

  params.set('height', '400');
  params.set('width', '400');
  // params.set('quality', '100');
  // params.set('fit', 'crop');

  const imageSrc = `${imageUrl}?${params.toString()}`;

  return imageSrc;
}