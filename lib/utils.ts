import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function colorHash(inputString: string) {
  // Tailwind color palette
  const colors = [
    'red', 'orange', 'amber',
    'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue',
    'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'
  ];
  const shades = ['200', '300', '400', '500', '600', '700'];

  // Pattern names
  const patterns = [
    'architect', 'jigsaw', 'topography', 'cutout', 'hideout', 'yyy', 'squares', 
    'fallingtriangles', 'hexagons', 'temple', 'deathstar', 'fourpointstars', 
    'randomshapes', 'anchorsaway', 'fancyrectangles', 'brickwall', 
    'overlappingcircles', 'plus', 'wiggle', 'bubbles', 
    'diagonalstripes', 'aztec', 'tictactoe', 'endlessclouds', 
    'floortile', 'parkayfloor'
  ];

  // Calculate a hash value from the input string
  const hashValue = inputString.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  // Select color and shade based on the hash value
  const color = colors[hashValue % colors.length];
  const shade = shades[Math.floor(hashValue / colors.length) % shades.length];

  // Select pattern based on the hash value
  const pattern = patterns[hashValue % patterns.length];

  // Return the Tailwind color class and pattern class
  return `bg-${color}-${shade} heropattern-${pattern}-white/10`;
}