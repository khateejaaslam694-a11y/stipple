export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface ColorData {
  hex: string;
  rgb: RGB;
  hsl: HSL;
  name: string;
  position: string;
  type: string;
  temperature: string;
}

const colorDatabase: { name: string; rgb: RGB }[] = [
  { name: 'Absolute Zero', rgb: { r: 0, g: 72, b: 186 } },
  { name: 'Acid Green', rgb: { r: 176, g: 191, b: 26 } },
  { name: 'Alabaster', rgb: { r: 242, g: 240, b: 230 } },
  { name: 'Alice Blue', rgb: { r: 240, g: 248, b: 255 } },
  { name: 'Alizarin Crimson', rgb: { r: 227, g: 38, b: 54 } },
  { name: 'Alloy Orange', rgb: { r: 196, g: 98, b: 16 } },
  { name: 'Almond', rgb: { r: 239, g: 222, b: 205 } },
  { name: 'Amber', rgb: { r: 255, g: 191, b: 0 } },
  { name: 'Amethyst', rgb: { r: 153, g: 102, b: 204 } },
  { name: 'Antique Brass', rgb: { r: 205, g: 149, b: 117 } },
  { name: 'Antique Bronze', rgb: { r: 102, g: 93, b: 30 } },
  { name: 'Antique Ruby', rgb: { r: 132, g: 27, b: 45 } },
  { name: 'Apricot', rgb: { r: 251, g: 206, b: 177 } },
  { name: 'Aqua', rgb: { r: 0, g: 255, b: 255 } },
  { name: 'Aquamarine', rgb: { r: 127, g: 255, b: 212 } },
  { name: 'Arctic Lime', rgb: { r: 208, g: 255, b: 20 } },
  { name: 'Artichoke', rgb: { r: 143, g: 151, b: 121 } },
  { name: 'Auburn', rgb: { r: 165, g: 42, b: 42 } },
  { name: 'Aureolin', rgb: { r: 253, g: 238, b: 0 } },
  { name: 'Avocado', rgb: { r: 86, g: 130, b: 3 } },
  { name: 'Azure', rgb: { r: 0, g: 127, b: 255 } },
  { name: 'Baby Blue', rgb: { r: 137, g: 207, b: 240 } },
  { name: 'Banana Mania', rgb: { r: 250, g: 231, b: 181 } },
  { name: 'Barbie Pink', rgb: { r: 218, g: 24, b: 132 } },
  { name: 'Barn Red', rgb: { r: 124, g: 10, b: 2 } },
  { name: 'Beaver', rgb: { r: 159, g: 129, b: 112 } },
  { name: 'Beige', rgb: { r: 245, g: 245, b: 220 } },
  { name: 'Bistre', rgb: { r: 61, g: 43, b: 31 } },
  { name: 'Bittersweet', rgb: { r: 254, g: 111, b: 94 } },
  { name: 'Black', rgb: { r: 0, g: 0, b: 0 } },
  { name: 'Blizzard Blue', rgb: { r: 172, g: 228, b: 239 } },
  { name: 'Blood Red', rgb: { r: 102, g: 0, b: 0 } },
  { name: 'Blue', rgb: { r: 0, g: 0, b: 255 } },
  { name: 'Blue Bell', rgb: { r: 162, g: 162, b: 208 } },
  { name: 'Blue Gray', rgb: { r: 102, g: 153, b: 204 } },
  { name: 'Blue Green', rgb: { r: 13, g: 152, b: 186 } },
  { name: 'Blush', rgb: { r: 222, g: 93, b: 131 } },
  { name: 'Bole', rgb: { r: 121, g: 68, b: 59 } },
  { name: 'Bone', rgb: { r: 227, g: 218, b: 201 } },
  { name: 'Brick Red', rgb: { r: 203, g: 65, b: 84 } },
  { name: 'British Racing Green', rgb: { r: 1, g: 66, b: 37 } },
  { name: 'Bronze', rgb: { r: 205, g: 127, b: 50 } },
  { name: 'Brown', rgb: { r: 150, g: 75, b: 0 } },
  { name: 'Bubble Gum', rgb: { r: 255, g: 193, b: 204 } },
  { name: 'Burgundy', rgb: { r: 128, g: 0, b: 32 } },
  { name: 'Burnt Orange', rgb: { r: 204, g: 85, b: 0 } },
  { name: 'Burnt Sienna', rgb: { r: 233, g: 116, b: 81 } },
  { name: 'Burnt Umber', rgb: { r: 138, g: 51, b: 36 } },
  { name: 'Cadet Blue', rgb: { r: 95, g: 158, b: 160 } },
  { name: 'Cadmium Orange', rgb: { r: 237, g: 135, b: 45 } },
  { name: 'Cadmium Red', rgb: { r: 227, g: 0, b: 34 } },
  { name: 'Cadmium Yellow', rgb: { r: 255, g: 246, b: 0 } },
  { name: 'Camel', rgb: { r: 193, g: 154, b: 107 } },
  { name: 'Canary Yellow', rgb: { r: 255, g: 239, b: 0 } },
  { name: 'Candy Apple Red', rgb: { r: 255, g: 8, b: 0 } },
  { name: 'Caramel', rgb: { r: 133, g: 79, b: 40 } },
  { name: 'Cardinal', rgb: { r: 196, g: 30, b: 58 } },
  { name: 'Caribbean Green', rgb: { r: 0, g: 204, b: 153 } },
  { name: 'Carmine', rgb: { r: 150, g: 0, b: 24 } },
  { name: 'Carnation Pink', rgb: { r: 255, g: 170, b: 204 } },
  { name: 'Celadon', rgb: { r: 172, g: 225, b: 175 } },
  { name: 'Cerise', rgb: { r: 222, g: 49, b: 99 } },
  { name: 'Cerulean', rgb: { r: 0, g: 123, b: 167 } },
  { name: 'Champagne', rgb: { r: 247, g: 231, b: 206 } },
  { name: 'Charcoal', rgb: { r: 54, g: 69, b: 79 } },
  { name: 'Chartreuse', rgb: { r: 127, g: 255, b: 0 } },
  { name: 'Cherry Blossom Pink', rgb: { r: 255, g: 183, b: 197 } },
  { name: 'Chestnut', rgb: { r: 149, g: 69, b: 53 } },
  { name: 'Chocolate', rgb: { r: 123, g: 63, b: 0 } },
  { name: 'Cinnabar', rgb: { r: 227, g: 66, b: 52 } },
  { name: 'Cinnamon', rgb: { r: 210, g: 105, b: 30 } },
  { name: 'Citrine', rgb: { r: 228, g: 208, b: 10 } },
  { name: 'Cobalt Blue', rgb: { r: 0, g: 71, b: 171 } },
  { name: 'Copper', rgb: { r: 184, g: 115, b: 51 } },
  { name: 'Coral', rgb: { r: 255, g: 127, b: 80 } },
  { name: 'Cornflower Blue', rgb: { r: 100, g: 149, b: 237 } },
  { name: 'Cream', rgb: { r: 255, g: 253, b: 208 } },
  { name: 'Crimson', rgb: { r: 220, g: 20, b: 60 } },
  { name: 'Cyan', rgb: { r: 0, g: 255, b: 255 } },
  { name: 'Dandelion', rgb: { r: 240, g: 225, b: 48 } },
  { name: 'Dark Blue', rgb: { r: 0, g: 0, b: 139 } },
  { name: 'Dark Green', rgb: { r: 1, g: 50, b: 32 } },
  { name: 'Deep Sky Blue', rgb: { r: 0, g: 191, b: 255 } },
  { name: 'Denim', rgb: { r: 21, g: 96, b: 189 } },
  { name: 'Desert Sand', rgb: { r: 237, g: 201, b: 175 } },
  { name: 'Ebony', rgb: { r: 85, g: 93, b: 80 } },
  { name: 'Ecru', rgb: { r: 194, g: 178, b: 128 } },
  { name: 'Eggplant', rgb: { r: 97, g: 64, b: 81 } },
  { name: 'Egyptian Blue', rgb: { r: 16, g: 52, b: 166 } },
  { name: 'Emerald', rgb: { r: 80, g: 200, b: 120 } },
  { name: 'Fern', rgb: { r: 113, g: 188, b: 120 } },
  { name: 'Fire Engine Red', rgb: { r: 206, g: 32, b: 41 } },
  { name: 'Flax', rgb: { r: 238, g: 220, b: 130 } },
  { name: 'Forest Green', rgb: { r: 34, g: 139, b: 34 } },
  { name: 'French Rose', rgb: { r: 246, g: 74, b: 138 } },
  { name: 'Fuchsia', rgb: { r: 255, g: 0, b: 255 } },
  { name: 'Gainsboro', rgb: { r: 220, g: 220, b: 220 } },
  { name: 'Gamboge', rgb: { r: 228, g: 155, b: 15 } },
  { name: 'Gold', rgb: { r: 255, g: 215, b: 0 } },
  { name: 'Goldenrod', rgb: { r: 218, g: 165, b: 32 } },
  { name: 'Granny Smith Apple', rgb: { r: 168, g: 228, b: 160 } },
  { name: 'Grape', rgb: { r: 111, g: 45, b: 168 } },
  { name: 'Gray', rgb: { r: 128, g: 128, b: 128 } },
  { name: 'Green', rgb: { r: 0, g: 128, b: 0 } },
  { name: 'Heliotrope', rgb: { r: 223, g: 115, b: 255 } },
  { name: 'Hot Pink', rgb: { r: 255, g: 105, b: 180 } },
  { name: 'Imperial Red', rgb: { r: 237, g: 41, b: 57 } },
  { name: 'Indian Red', rgb: { r: 205, g: 92, b: 92 } },
  { name: 'Indigo', rgb: { r: 75, g: 0, b: 130 } },
  { name: 'Ivory', rgb: { r: 255, g: 255, b: 240 } },
  { name: 'Jade', rgb: { r: 0, g: 168, b: 107 } },
  { name: 'Jungle Green', rgb: { r: 41, g: 171, b: 135 } },
  { name: 'Khaki', rgb: { r: 195, g: 176, b: 145 } },
  { name: 'Lavender', rgb: { r: 230, g: 230, b: 250 } },
  { name: 'Lemon', rgb: { r: 255, g: 247, b: 0 } },
  { name: 'Lilac', rgb: { r: 200, g: 162, b: 200 } },
  { name: 'Lime', rgb: { r: 0, g: 255, b: 0 } },
  { name: 'Magenta', rgb: { r: 255, g: 0, b: 255 } },
  { name: 'Mahogany', rgb: { r: 192, g: 64, b: 0 } },
  { name: 'Malachite', rgb: { r: 11, g: 218, b: 81 } },
  { name: 'Maroon', rgb: { r: 128, g: 0, b: 0 } },
  { name: 'Mauve', rgb: { r: 224, g: 176, b: 255 } },
  { name: 'Mint', rgb: { r: 62, g: 180, b: 137 } },
  { name: 'Misty Rose', rgb: { r: 255, g: 228, b: 225 } },
  { name: 'Moss Green', rgb: { r: 138, g: 154, b: 91 } },
  { name: 'Mustard', rgb: { r: 255, g: 219, b: 88 } },
  { name: 'Navy Blue', rgb: { r: 0, g: 0, b: 128 } },
  { name: 'Ochre', rgb: { r: 204, g: 119, b: 34 } },
  { name: 'Olive', rgb: { r: 128, g: 128, b: 0 } },
  { name: 'Onyx', rgb: { r: 53, g: 56, b: 57 } },
  { name: 'Orange', rgb: { r: 255, g: 165, b: 0 } },
  { name: 'Orchid', rgb: { r: 218, g: 112, b: 214 } },
  { name: 'Pacific Blue', rgb: { r: 28, g: 169, b: 201 } },
  { name: 'Pale Green', rgb: { r: 152, g: 251, b: 152 } },
  { name: 'Papaya Whip', rgb: { r: 255, g: 239, b: 213 } },
  { name: 'Peach', rgb: { r: 255, g: 229, b: 180 } },
  { name: 'Pear', rgb: { r: 209, g: 226, b: 49 } },
  { name: 'Periwinkle', rgb: { r: 204, g: 204, b: 255 } },
  { name: 'Persian Blue', rgb: { r: 28, g: 57, b: 187 } },
  { name: 'Pine Green', rgb: { r: 1, g: 121, b: 111 } },
  { name: 'Pink', rgb: { r: 255, g: 192, b: 203 } },
  { name: 'Plum', rgb: { r: 142, g: 69, b: 133 } },
  { name: 'Prussian Blue', rgb: { r: 0, g: 49, b: 83 } },
  { name: 'Purple', rgb: { r: 128, g: 0, b: 128 } },
  { name: 'Raspberry', rgb: { r: 227, g: 11, b: 92 } },
  { name: 'Red', rgb: { r: 255, g: 0, b: 0 } },
  { name: 'Rose', rgb: { r: 255, g: 0, b: 127 } },
  { name: 'Royal Blue', rgb: { r: 65, g: 105, b: 225 } },
  { name: 'Ruby', rgb: { r: 224, g: 17, b: 95 } },
  { name: 'Russet', rgb: { r: 128, g: 70, b: 27 } },
  { name: 'Rust', rgb: { r: 183, g: 65, b: 14 } },
  { name: 'Saffron', rgb: { r: 244, g: 196, b: 48 } },
  { name: 'Salmon', rgb: { r: 250, g: 128, b: 114 } },
  { name: 'Sapphire', rgb: { r: 15, g: 82, b: 186 } },
  { name: 'Scarlet', rgb: { r: 255, g: 36, b: 0 } },
  { name: 'Sea Green', rgb: { r: 46, g: 139, b: 87 } },
  { name: 'Sepia', rgb: { r: 112, g: 66, b: 20 } },
  { name: 'Shadow', rgb: { r: 138, g: 121, b: 93 } },
  { name: 'Shamrock Green', rgb: { r: 0, g: 158, b: 96 } },
  { name: 'Sienna', rgb: { r: 160, g: 82, b: 45 } },
  { name: 'Silver', rgb: { r: 192, g: 192, b: 192 } },
  { name: 'Sky Blue', rgb: { r: 135, g: 206, b: 235 } },
  { name: 'Slate Gray', rgb: { r: 112, g: 128, b: 144 } },
  { name: 'Steel Blue', rgb: { r: 70, g: 130, b: 180 } },
  { name: 'Sunset', rgb: { r: 250, g: 214, b: 165 } },
  { name: 'Tan', rgb: { r: 210, g: 180, b: 140 } },
  { name: 'Tangerine', rgb: { r: 242, g: 133, b: 0 } },
  { name: 'Taupe', rgb: { r: 72, g: 60, b: 50 } },
  { name: 'Teal', rgb: { r: 0, g: 128, b: 128 } },
  { name: 'Thistle', rgb: { r: 216, g: 191, b: 216 } },
  { name: 'Tomato', rgb: { r: 255, g: 99, b: 71 } },
  { name: 'Turquoise', rgb: { r: 64, g: 224, b: 208 } },
  { name: 'Ultramarine', rgb: { r: 18, g: 10, b: 143 } },
  { name: 'Vanilla', rgb: { r: 243, g: 229, b: 171 } },
  { name: 'Vermilion', rgb: { r: 227, g: 66, b: 52 } },
  { name: 'Violet', rgb: { r: 143, g: 0, b: 255 } },
  { name: 'Viridian', rgb: { r: 64, g: 130, b: 109 } },
  { name: 'Wheat', rgb: { r: 245, g: 222, b: 179 } },
  { name: 'White', rgb: { r: 255, g: 255, b: 255 } },
  { name: 'Wisteria', rgb: { r: 201, g: 160, b: 220 } },
  { name: 'Yellow', rgb: { r: 255, g: 255, b: 0 } },
  { name: 'Zinnwaldite', rgb: { r: 235, g: 194, b: 175 } }
];

export function rgbToHex({ r, g, b }: RGB): string {
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function hexToRgb(hex: string): RGB {
  hex = hex.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  return {
    r: parseInt(hex.substring(0, 2), 16),
    g: parseInt(hex.substring(2, 4), 16),
    b: parseInt(hex.substring(4, 6), 16)
  };
}

export function rgbToHsl({ r, g, b }: RGB): HSL {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

export function findClosestColorName(rgb: RGB): { name: string; distance: number } {
  let minDistance = Infinity;
  let closestColor = 'Unknown';

  for (const color of colorDatabase) {
    // Euclidean distance
    const distance = Math.sqrt(
      Math.pow(rgb.r - color.rgb.r, 2) +
      Math.pow(rgb.g - color.rgb.g, 2) +
      Math.pow(rgb.b - color.rgb.b, 2)
    );

    if (distance < minDistance) {
      minDistance = distance;
      closestColor = color.name;
    }
  }

  return { name: closestColor, distance: minDistance };
}

export function getColorPosition(hue: number): string {
  if (hue >= 345 || hue < 15) return 'Red';
  if (hue >= 15 && hue < 45) return 'Orange';
  if (hue >= 45 && hue < 75) return 'Yellow';
  if (hue >= 75 && hue < 165) return 'Green';
  if (hue >= 165 && hue < 255) return 'Blue';
  if (hue >= 255 && hue < 315) return 'Purple';
  if (hue >= 315 && hue < 345) return 'Magenta/Pink';
  return 'Neutral';
}

export function getColorType(hue: number, s: number, l: number): string {
  if (s < 10 || l < 10 || l > 90) return 'Neutral';
  
  // Primary (R:0/360, G:120, B:240)
  if ((hue >= 345 || hue < 15) || (hue >= 105 && hue < 135) || (hue >= 225 && hue < 255)) {
    return 'Primary';
  }
  // Secondary (O/Y:60, G/C:180, V/M:300)
  if ((hue >= 45 && hue < 75) || (hue >= 165 && hue < 195) || (hue >= 285 && hue < 315)) {
    return 'Secondary';
  }
  return 'Tertiary';
}

export function getColorTemperature(hue: number): string {
  if (hue >= 0 && hue < 180) return 'Warm';
  if (hue >= 180 && hue < 345) return 'Cool';
  return 'Neutral';
}

export function quantifyImageColors(canvas: HTMLCanvasElement, count: number): ColorData[] {
  const ctx = canvas.getContext('2d');
  if (!ctx) return [];

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  const pixelCount = pixels.length / 4;

  const colorMap: { [key: string]: { rgb: RGB; count: number } } = {};

  // Sample every few pixels for performance
  const sampleStep = Math.max(1, Math.floor(pixelCount / 2000));

  for (let i = 0; i < pixels.length; i += 4 * sampleStep) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const a = pixels[i + 3];

    if (a < 128) continue; // Skip transparent

    // Quantize to reduce uniqueness
    const qr = Math.round(r / 15) * 15;
    const qg = Math.round(g / 15) * 15;
    const qb = Math.round(b / 15) * 15;
    const key = `${qr},${qg},${qb}`;

    if (!colorMap[key]) {
      colorMap[key] = { rgb: { r: qr, g: qg, b: qb }, count: 0 };
    }
    colorMap[key].count++;
  }

  const sortedColors = Object.values(colorMap).sort((a, b) => b.count - a.count);
  const dominant = sortedColors.slice(0, count);

  return dominant.map(d => {
    const hex = rgbToHex(d.rgb);
    const hsl = rgbToHsl(d.rgb);
    const { name } = findClosestColorName(d.rgb);
    return {
      hex,
      rgb: d.rgb,
      hsl,
      name,
      position: getColorPosition(hsl.h),
      type: getColorType(hsl.h, hsl.s, hsl.l),
      temperature: getColorTemperature(hsl.h)
    };
  });
}

// Color blindness simulation logic using LMS matrices
export function simulateColorBlindness(rgb: RGB, type: 'Protanopia' | 'Deuteranopia' | 'Tritanopia'): RGB {
  // Simple approximation matrices
  const { r, g, b } = rgb;
  
  if (type === 'Protanopia') {
    return {
      r: Math.round(r * 0.567 + g * 0.433 + b * 0),
      g: Math.round(r * 0.558 + g * 0.442 + b * 0),
      b: Math.round(r * 0 + g * 0.242 + b * 0.758)
    };
  } else if (type === 'Deuteranopia') {
    return {
      r: Math.round(r * 0.625 + g * 0.375 + b * 0),
      g: Math.round(r * 0.70 + g * 0.30 + b * 0),
      b: Math.round(r * 0 + g * 0.30 + b * 0.70)
    };
  } else if (type === 'Tritanopia') {
    return {
      r: Math.round(r * 0.95 + g * 0.05 + b * 0),
      g: Math.round(r * 0 + g * 0.433 + b * 0.567),
      b: Math.round(r * 0 + g * 0.475 + b * 0.525)
    };
  }
  return rgb;
}
