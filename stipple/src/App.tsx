import React, { useState, useRef, useEffect } from 'react';
import { 
  Palette, 
  Upload, 
  Info, 
  History, 
  Trash2, 
  Copy, 
  Check, 
  EyeOff, 
  Heart,
  FileDown,
  Menu,
  X
} from 'lucide-react';
import StippleBackground from './components/StippleBackground';
import { 
  ColorData, 
  quantifyImageColors, 
  rgbToHex, 
  rgbToHsl, 
  findClosestColorName, 
  getColorPosition, 
  getColorType, 
  getColorTemperature,
  simulateColorBlindness
} from './utils/colorUtils';

// Standard styles
const SPRUCE = '#1b3907';
const OCEAN = '#015f7e';

// App definition
export default function App() {
  const [activeTab, setActiveTab] = useState<'analyze' | 'museum' | 'blindness'>('analyze');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [collection, setCollection] = useState<SavedColor[]>([]);
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const handleTabChange = (tab: 'analyze' | 'museum' | 'blindness') => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  // Toast effect
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // Load collection from localStorage
  useEffect(() => {
    const data = localStorage.getItem('stipple_museum');
    if (data) {
      try {
        setCollection(JSON.parse(data));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const updateCollection = (newColl: SavedColor[]) => {
    setCollection(newColl);
    localStorage.setItem('stipple_museum', JSON.stringify(newColl));
  };

  const addToMuseum = (color: ColorData) => {
    const newItem: SavedColor = {
      id: Math.random().toString(36).substr(2, 9),
      ...color,
      date: new Date().toLocaleDateString()
    };
    updateCollection([newItem, ...collection]);
    showToast(`Added ${color.name} to Museum`);
  };

  const removeFromMuseum = (id: string) => {
    const name = collection.find(c => c.id === id)?.name;
    updateCollection(collection.filter(c => c.id !== id));
    showToast(`Removed ${name} from Museum`, 'info');
  };

  const exportMuseum = () => {
    const blob = new Blob([JSON.stringify(collection, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stipple_museum_export_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Museum exported as JSON');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast(`Copied ${text} to clipboard`);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-stone-50 text-stone-900">
      {/* Toast Notifier */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transform transition-all duration-300 animate-slide-in text-white text-sm font-medium ${
              t.type === 'error' ? 'bg-red-500' : t.type === 'info' ? 'bg-ocean' : 'bg-spruce'
            }`}
          >
            {t.type === 'success' && <Check size={16} />}
            {t.type === 'info' && <Info size={16} />}
            {t.message}
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-stone-200/60 shadow-sm px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Classic continuous color wheel logo based on your reference */}
          <div className="relative w-8 h-8 rounded-full border border-stone-300/80 overflow-hidden">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  'conic-gradient(from -90deg, #ff002b 0deg, #ff6a00 45deg, #ffe600 90deg, #7dff00 135deg, #00ff2a 180deg, #00e5ff 225deg, #005bff 270deg, #7a00ff 315deg, #ff00bf 360deg)',
              }}
            />
            <div className="absolute inset-[8px] rounded-full bg-white border border-stone-300/70" />
          </div>
          <span className="font-serif text-xl font-bold tracking-tight" style={{ color: SPRUCE }}>Stipple</span>
        </div>

        <nav className="hidden md:flex items-center gap-4 text-sm">
          <button 
            onClick={() => handleTabChange('analyze')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${activeTab === 'analyze' ? 'bg-spruce text-white' : 'text-stone-600 hover:bg-stone-100'}`}
          >
            <Palette size={16} /> Color Lab
          </button>
          <button 
            onClick={() => handleTabChange('museum')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${activeTab === 'museum' ? 'bg-spruce text-white' : 'text-stone-600 hover:bg-stone-100'}`}
          >
            <History size={16} /> Museum
            {collection.length > 0 && (
              <span className={`text-xs ml-0.5 px-1.5 py-0.5 rounded-full ${activeTab === 'museum' ? 'bg-white text-spruce' : 'bg-tulip text-white'}`}>
                {collection.length}
              </span>
            )}
          </button>
          <button 
            onClick={() => handleTabChange('blindness')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${activeTab === 'blindness' ? 'bg-spruce text-white' : 'text-stone-600 hover:bg-stone-100'}`}
          >
            <EyeOff size={16} /> Color Vision
          </button>
        </nav>

        <button
          type="button"
          aria-label="Toggle navigation menu"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-stone-700 hover:bg-stone-100 transition-colors"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {isMobileMenuOpen && (
        <div className="md:hidden sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-4 py-3">
          <nav className="flex flex-col gap-2 text-sm">
            <button
              onClick={() => handleTabChange('analyze')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${activeTab === 'analyze' ? 'bg-spruce text-white' : 'text-stone-700 hover:bg-stone-100'}`}
            >
              <Palette size={16} /> Color Lab
            </button>
            <button
              onClick={() => handleTabChange('museum')}
              className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${activeTab === 'museum' ? 'bg-spruce text-white' : 'text-stone-700 hover:bg-stone-100'}`}
            >
              <span className="flex items-center gap-2">
                <History size={16} /> Museum
              </span>
              {collection.length > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === 'museum' ? 'bg-white text-spruce' : 'bg-tulip text-white'}`}>
                  {collection.length}
                </span>
              )}
            </button>
            <button
              onClick={() => handleTabChange('blindness')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${activeTab === 'blindness' ? 'bg-spruce text-white' : 'text-stone-700 hover:bg-stone-100'}`}
            >
              <EyeOff size={16} /> Color Vision
            </button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Hero Section — Full Stipple Canvas Animation */}
        <section className="relative overflow-hidden" style={{ height: 340 }}>
          {/* Live canvas stipple background */}
          <StippleBackground height={340} />

          {/* Radial vignette overlay to soften edges */}
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background:
                'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, rgba(10,26,6,0.55) 100%)',
            }}
          />

          {/* Horizontal scan lines for depth */}
          <div
            className="absolute inset-0 pointer-events-none z-10 opacity-10"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.04) 3px, rgba(255,255,255,0.04) 4px)',
            }}
          />

          {/* Hero Text Content */}
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 pointer-events-none select-none">
            {/* Eyebrow label */}
            <div className="flex items-center gap-3 mb-5 animate-fade-up">
              <div className="h-px w-10 bg-gradient-to-r from-transparent to-tulip/70" />
              <span className="font-mono text-xs tracking-[0.3em] uppercase font-medium" style={{ color: 'rgba(188,71,95,0.9)' }}>
                Color Analysis Studio
              </span>
              <div className="h-px w-10 bg-gradient-to-l from-transparent to-tulip/70" />
            </div>

            {/* Main Quote */}
            <h1
              className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold italic leading-tight animate-fade-up-delay"
              style={{
                color: 'rgba(255,255,255,0.95)',
                textShadow: '0 2px 30px rgba(0,0,0,0.8), 0 0 80px rgba(188,71,95,0.3)',
              }}
            >
              "Every Dot Tells a
              <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #e8c9a0 0%, #bc475f 45%, #015f7e 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Color Story
              </span>
              "
            </h1>

            {/* Divider dot row */}
            <div className="flex items-center gap-1.5 my-5 animate-fade-up-delay">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-full"
                  style={{
                    width: i === 3 ? 8 : i === 2 || i === 4 ? 5 : 3,
                    height: i === 3 ? 8 : i === 2 || i === 4 ? 5 : 3,
                    backgroundColor:
                      i === 3
                        ? '#bc475f'
                        : i === 2 || i === 4
                        ? 'rgba(255,255,255,0.5)'
                        : 'rgba(255,255,255,0.2)',
                  }}
                />
              ))}
            </div>

            {/* Subtitle */}
            <p
              className="font-mono text-xs tracking-[0.25em] uppercase animate-fade-up-delay-2"
              style={{ color: 'rgba(255,255,255,0.45)' }}
            >
              The Art and Science of Chromatic Discovery
            </p>
          </div>

          {/* Bottom fade into page background */}
          <div
            className="absolute bottom-0 left-0 right-0 h-16 z-20 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, transparent, #f5f5f4)',
            }}
          />
        </section>

        {activeTab === 'analyze' && (
          <AnalyzeSection onSaveToMuseum={addToMuseum} copyToClipboard={copyToClipboard} />
        )}

        {activeTab === 'museum' && (
          <MuseumSection collection={collection} onRemove={removeFromMuseum} onExport={exportMuseum} copyToClipboard={copyToClipboard} />
        )}

        {activeTab === 'blindness' && (
          <BlindnessSection copyToClipboard={copyToClipboard} />
        )}
      </main>
      
      <footer className="border-t border-stone-200 py-6 text-center text-xs text-stone-400 font-mono tracking-wider">
        © 2026 STIPPLE LABS. ALL RIGHTS RESERVED.
      </footer>
    </div>
  );
}

interface SavedColor extends ColorData {
  id: string;
  date: string;
}

interface ToastType {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

// ─────────────────────────────────────────────────────────────────────────────
// ANALYZE SECTION
// ─────────────────────────────────────────────────────────────────────────────

function AnalyzeSection({ onSaveToMuseum, copyToClipboard }: { onSaveToMuseum: (c: ColorData) => void, copyToClipboard: (t: string) => void }) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [dominantColors, setDominantColors] = useState<ColorData[]>([]);
  const [hoverColor, setHoverColor] = useState<ColorData | null>(null);
  const [selectedColor, setSelectedColor] = useState<ColorData | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const magnifierCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [zoom, setZoom] = useState(1);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [showMagnifier, setShowMagnifier] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        alert('File is too large! Maximum 15MB allowed.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target?.result as string);
        setSelectedColor(null);
        setHoverColor(null);
        setDominantColors([]);
        setZoom(1);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = () => {
    if (!imgRef.current || !canvasRef.current) return;
    const img = imgRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);

    const colors = quantifyImageColors(canvas, 8);
    setDominantColors(colors);
    if (colors.length > 0) setSelectedColor(colors[0]);
  };

  const sampleColorAtPixel = (clientX: number, clientY: number): ColorData | null => {
    if (!imgRef.current || !canvasRef.current) return null;
    const img = imgRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const rect = img.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const scaleX = img.naturalWidth / rect.width;
    const scaleY = img.naturalHeight / rect.height;

    const px = Math.floor(x * scaleX);
    const py = Math.floor(y * scaleY);

    if (px < 0 || px >= canvas.width || py < 0 || py >= canvas.height) return null;

    const pixelData = ctx.getImageData(px, py, 1, 1).data;
    const rgb = { r: pixelData[0], g: pixelData[1], b: pixelData[2] };
    const hsl = rgbToHsl(rgb);
    const hex = rgbToHex(rgb);
    const { name } = findClosestColorName(rgb);

    return {
      hex, rgb, hsl, name,
      position: getColorPosition(hsl.h),
      type: getColorType(hsl.h, hsl.s, hsl.l),
      temperature: getColorTemperature(hsl.h)
    };
  };

  // Draw magnifier showing zoomed pixel grid around cursor
  const drawMagnifier = (px: number, py: number) => {
    const magCanvas = magnifierCanvasRef.current;
    const srcCanvas = canvasRef.current;
    if (!magCanvas || !srcCanvas) return;
    const magCtx = magCanvas.getContext('2d');
    if (!magCtx) return;

    const MAG_SIZE = 160;
    const SAMPLE_RADIUS = 8;
    const SAMPLE_SIZE = SAMPLE_RADIUS * 2 + 1;
    const PIXEL_SIZE = MAG_SIZE / SAMPLE_SIZE;

    magCanvas.width = MAG_SIZE;
    magCanvas.height = MAG_SIZE;

    magCtx.fillStyle = '#111';
    magCtx.fillRect(0, 0, MAG_SIZE, MAG_SIZE);
    magCtx.imageSmoothingEnabled = false;

    const srcX = px - SAMPLE_RADIUS;
    const srcY = py - SAMPLE_RADIUS;
    const clampedSrcX = Math.max(0, srcX);
    const clampedSrcY = Math.max(0, srcY);
    const clampedEndX = Math.min(srcCanvas.width, srcX + SAMPLE_SIZE);
    const clampedEndY = Math.min(srcCanvas.height, srcY + SAMPLE_SIZE);
    const clampedW = clampedEndX - clampedSrcX;
    const clampedH = clampedEndY - clampedSrcY;

    if (clampedW > 0 && clampedH > 0) {
      const destX = (clampedSrcX - srcX) * PIXEL_SIZE;
      const destY = (clampedSrcY - srcY) * PIXEL_SIZE;
      magCtx.drawImage(
        srcCanvas,
        clampedSrcX, clampedSrcY, clampedW, clampedH,
        destX, destY, clampedW * PIXEL_SIZE, clampedH * PIXEL_SIZE
      );
    }

    // Grid lines
    magCtx.strokeStyle = 'rgba(255,255,255,0.1)';
    magCtx.lineWidth = 0.5;
    for (let i = 0; i <= SAMPLE_SIZE; i++) {
      const pos = i * PIXEL_SIZE;
      magCtx.beginPath(); magCtx.moveTo(pos, 0); magCtx.lineTo(pos, MAG_SIZE); magCtx.stroke();
      magCtx.beginPath(); magCtx.moveTo(0, pos); magCtx.lineTo(MAG_SIZE, pos); magCtx.stroke();
    }

    // Center pixel highlight
    const cp = SAMPLE_RADIUS * PIXEL_SIZE;
    magCtx.strokeStyle = 'rgba(0,0,0,0.6)';
    magCtx.lineWidth = 3;
    magCtx.strokeRect(cp, cp, PIXEL_SIZE, PIXEL_SIZE);
    magCtx.strokeStyle = '#ffffff';
    magCtx.lineWidth = 1.5;
    magCtx.strokeRect(cp + 1, cp + 1, PIXEL_SIZE - 2, PIXEL_SIZE - 2);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imgRef.current || !canvasRef.current) return;
    const img = imgRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = img.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const scaleX = img.naturalWidth / rect.width;
    const scaleY = img.naturalHeight / rect.height;
    const px = Math.floor(x * scaleX);
    const py = Math.floor(y * scaleY);

    if (px < 0 || px >= canvas.width || py < 0 || py >= canvas.height) return;

    const pixelData = ctx.getImageData(px, py, 1, 1).data;
    const rgb = { r: pixelData[0], g: pixelData[1], b: pixelData[2] };
    const hsl = rgbToHsl(rgb);
    const hex = rgbToHex(rgb);
    const { name } = findClosestColorName(rgb);

    setHoverColor({
      hex, rgb, hsl, name,
      position: getColorPosition(hsl.h),
      type: getColorType(hsl.h, hsl.s, hsl.l),
      temperature: getColorTemperature(hsl.h)
    });

    if (containerRef.current) {
      const cr = containerRef.current.getBoundingClientRect();
      setCursorPos({ x: e.clientX - cr.left, y: e.clientY - cr.top });
    }

    drawMagnifier(px, py);
  };

  const handleImageClick = (e: React.MouseEvent) => {
    const color = sampleColorAtPixel(e.clientX, e.clientY);
    if (color) setSelectedColor(color);
  };

  // Scroll-to-zoom with non-passive wheel listener
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      // Allow standard scrolling natively when user scrolls their wheel
      // Only zoom if they hold Ctrl or Meta (Cmd) key, just like Google Maps
      if (!e.ctrlKey && !e.metaKey) return;
      
      e.preventDefault();
      
      setZoom(prevZoom => {
        const delta = e.deltaY > 0 ? -0.5 : 0.5;
        const newZoom = Math.max(1, Math.min(10, Math.round((prevZoom + delta) * 10) / 10));
        if (newZoom === prevZoom) return prevZoom;

        // Calculate mouse position relative to the scroll container
        const rect = el.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Calculate the ratio of mouse position to content size
        const scrollX = el.scrollLeft + mouseX;
        const scrollY = el.scrollTop + mouseY;

        // The scaling factor
        const scale = newZoom / prevZoom;

        // Adjust scroll position after state update
        requestAnimationFrame(() => {
          el.scrollLeft = scrollX * scale - mouseX;
          el.scrollTop = scrollY * scale - mouseY;
        });

        return newZoom;
      });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [imageSrc]);

  const displayedColor = selectedColor || (dominantColors.length > 0 ? dominantColors[0] : null);

  // Position magnifier loupe to avoid going off-edge
  const getMagnifierStyle = (): React.CSSProperties => {
    const magW = 160;
    const offset = 24;
    const cw = containerRef.current?.clientWidth || 500;
    let left = cursorPos.x + offset;
    let top = cursorPos.y - magW / 2;
    if (left + magW > cw - 5) left = cursorPos.x - offset - magW;
    if (top < 5) top = 5;
    return { left, top };
  };

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 xl:grid-cols-12 gap-8">
      {/* Sidebar: Inputs & Preview */}
      <div className="xl:col-span-5 flex flex-col gap-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <h2 className="font-serif text-lg font-bold mb-4 flex items-center gap-2" style={{ color: SPRUCE }}>
            <Upload size={18} /> Upload Image
          </h2>

          {!imageSrc ? (
            <div className="border-2 border-dashed border-stone-300 rounded-xl h-64 flex flex-col items-center justify-center cursor-pointer hover:border-tulip transition-colors bg-stone-50">
              <input type="file" className="hidden" id="imageInput" accept="image/*" onChange={handleFileChange} />
              <label htmlFor="imageInput" className="cursor-pointer flex flex-col items-center">
                <Upload size={36} className="text-stone-400 mb-2" />
                <p className="font-medium text-sm text-stone-600">Click to upload or drag & drop</p>
                <p className="text-xs text-stone-400 mt-1">JPG, PNG, WEBP (Max 15MB)</p>
              </label>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {/* Zoomable image container with pixel magnifier */}
              <div ref={containerRef} className="relative">
                <div
                  ref={scrollContainerRef}
                  className="overflow-auto border border-stone-200 rounded-xl cursor-crosshair bg-stone-900/5"
                  style={{ maxHeight: 480 }}
                >
                  <img
                    ref={imgRef}
                    src={imageSrc}
                    alt="Preview"
                    className="block select-none max-w-none"
                    draggable={false}
                    style={{
                      width: `${zoom * 100}%`,
                      imageRendering: zoom >= 4 ? 'pixelated' : 'auto',
                    }}
                    onLoad={processImage}
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => setShowMagnifier(true)}
                    onMouseLeave={() => { setShowMagnifier(false); setHoverColor(null); }}
                    onClick={handleImageClick}
                  />
                </div>
                <canvas ref={canvasRef} className="hidden" />

                {/* Pixel magnifier loupe */}
                {showMagnifier && hoverColor && (
                  <div className="absolute pointer-events-none z-50" style={getMagnifierStyle()}>
                    <div
                      className="w-[160px] h-[160px] rounded-full overflow-hidden"
                      style={{
                        border: `3px solid ${hoverColor.hex}`,
                        boxShadow: '0 0 0 2px rgba(255,255,255,0.9), 0 8px 32px rgba(0,0,0,0.35)',
                      }}
                    >
                      <canvas ref={magnifierCanvasRef} width={160} height={160} className="w-full h-full" />
                    </div>
                    <div className="mt-2 flex items-center justify-center gap-1.5 bg-white/95 backdrop-blur-sm rounded-lg px-2.5 py-1.5 shadow-lg border border-stone-100 mx-auto w-fit">
                      <div className="w-3.5 h-3.5 rounded-sm border border-stone-200/60 flex-shrink-0" style={{ backgroundColor: hoverColor.hex }} />
                      <span className="font-serif text-xs font-bold text-stone-800 truncate max-w-[80px]">{hoverColor.name}</span>
                      <span className="font-mono text-[10px] text-stone-500">{hoverColor.hex.toUpperCase()}</span>
                    </div>
                  </div>
                )}

                {/* Zoom badge */}
                {zoom > 1 && (
                  <div className="absolute top-3 right-3 bg-black/60 text-white text-xs font-mono px-2.5 py-1 rounded-full backdrop-blur-sm z-40">
                    {zoom.toFixed(1)}×
                  </div>
                )}
              </div>

              {/* Zoom controls */}
              <div className="flex items-center gap-3 px-1">
                <button
                  onClick={() => setZoom(prev => Math.max(1, +(prev - 0.5).toFixed(1)))}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-lg transition-colors flex-shrink-0"
                >−</button>
                <div className="flex-1 relative h-1.5 bg-stone-200 rounded-full overflow-hidden">
                  <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-150" style={{ width: `${((zoom - 1) / 9) * 100}%`, backgroundColor: OCEAN }} />
                </div>
                <button
                  onClick={() => setZoom(prev => Math.min(10, +(prev + 0.5).toFixed(1)))}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-lg transition-colors flex-shrink-0"
                >+</button>
                <span className="font-mono text-xs text-stone-500 w-10 text-right flex-shrink-0">{zoom.toFixed(1)}×</span>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => document.getElementById('imageInput')?.click()}
                  className="flex-1 py-2 text-sm font-medium rounded-lg text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors"
                >Change Image</button>
                <input type="file" className="hidden" id="imageInput" accept="image/*" onChange={handleFileChange} />
                <button
                  onClick={processImage}
                  className="flex-1 py-2 text-sm font-medium rounded-lg text-white transition-colors"
                  style={{ backgroundColor: OCEAN }}
                >Re-Analyze</button>
              </div>
              <p className="text-center text-[10px] text-stone-400 font-mono tracking-wide">Scroll over image to zoom · Hover to magnify pixels · Click to lock color</p>
            </div>
          )}
        </div>

        {/* Dominant Colors Strip — horizontal line */}
        {dominantColors.length > 0 && (
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
            <h3 className="font-serif text-sm font-bold mb-3 tracking-wide uppercase" style={{ color: SPRUCE }}>
              Dominant Colors
            </h3>
            {/* Continuous color bar */}
            <div className="flex w-full h-10 rounded-xl overflow-hidden border border-stone-200 shadow-inner mb-3">
              {dominantColors.map((col, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedColor(col)}
                  className="flex-1 h-full transition-all duration-200 hover:flex-[2] focus:outline-none relative group"
                  style={{ backgroundColor: col.hex }}
                  title={`${col.name} · ${col.hex}`}
                >
                  {selectedColor?.hex === col.hex && (
                    <div className="absolute inset-0 ring-2 ring-inset ring-white/80" />
                  )}
                </button>
              ))}
            </div>
            {/* Color swatches with labels below the bar */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {dominantColors.map((col, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedColor(col)}
                  className={`flex flex-col items-center gap-1.5 flex-shrink-0 group transition-transform hover:scale-105 ${selectedColor?.hex === col.hex ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full border-2 shadow-sm transition-all ${selectedColor?.hex === col.hex ? 'border-stone-700 scale-110' : 'border-stone-200'}`}
                    style={{ backgroundColor: col.hex }}
                  />
                  <span className="font-mono text-[9px] text-stone-400 leading-none">{col.hex.toUpperCase()}</span>
                </button>
              ))}
            </div>
          </div>
        )}



      </div>

      {/* Main Color Detail Analysis */}
      <div className="xl:col-span-7">
        {displayedColor ? (
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="relative w-full md:w-48 h-48 rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex-shrink-0" style={{ backgroundColor: displayedColor.hex }}>
                <div className="absolute bottom-3 right-3 flex gap-1.5">
                  <button 
                    onClick={() => copyToClipboard(displayedColor.hex)}
                    className="p-1.5 rounded-full bg-white/80 hover:bg-white text-stone-700 shadow-sm transition-colors"
                  >
                    <Copy size={16} />
                  </button>
                  <button 
                    onClick={() => onSaveToMuseum(displayedColor)}
                    className="p-1.5 rounded-full bg-white/80 hover:bg-white text-tulip shadow-sm transition-colors"
                  >
                    <Heart size={16} />
                  </button>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center">
                <span className="text-xs font-mono font-bold tracking-widest text-stone-400 uppercase">SPECIFICATION</span>
                <h2 className="font-serif text-3xl font-bold mt-1 text-stone-800">{displayedColor.name}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <code className="bg-stone-100 text-stone-700 font-mono text-sm px-2 py-1 rounded cursor-pointer" onClick={() => copyToClipboard(displayedColor.hex)}>
                    {displayedColor.hex}
                  </code>
                </div>
                <div className="grid grid-cols-2 mt-4 gap-y-2 text-sm border-t border-stone-100 pt-4">
                  <div><span className="text-stone-400">Position:</span> <span className="font-medium text-stone-800">{displayedColor.position}</span></div>
                  <div><span className="text-stone-400">Temp:</span> <span className="font-medium text-stone-800">{displayedColor.temperature}</span></div>
                  <div><span className="text-stone-400">Type:</span> <span className="font-medium text-stone-800">{displayedColor.type}</span></div>
                </div>
              </div>
            </div>

            {/* In-depth details section with stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/60">
                <span className="text-xs font-mono text-stone-400">RGB Spectrum</span>
                <div className="mt-2 space-y-2 font-mono text-sm">
                  <div className="flex justify-between">
                    <span>Red</span>
                    <span className="font-medium text-red-600">{displayedColor.rgb.r}</span>
                  </div>
                  <div className="w-full bg-stone-200 h-1 rounded-full overflow-hidden">
                    <div className="bg-red-500 h-full" style={{ width: `${(displayedColor.rgb.r / 255) * 100}%` }}></div>
                  </div>
                  <div className="flex justify-between">
                    <span>Green</span>
                    <span className="font-medium text-green-600">{displayedColor.rgb.g}</span>
                  </div>
                  <div className="w-full bg-stone-200 h-1 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full" style={{ width: `${(displayedColor.rgb.g / 255) * 100}%` }}></div>
                  </div>
                  <div className="flex justify-between">
                    <span>Blue</span>
                    <span className="font-medium text-blue-600">{displayedColor.rgb.b}</span>
                  </div>
                  <div className="w-full bg-stone-200 h-1 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full" style={{ width: `${(displayedColor.rgb.b / 255) * 100}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/60">
                <span className="text-xs font-mono text-stone-400">HSL Profile</span>
                <div className="mt-2 space-y-2 font-mono text-sm">
                  <div className="flex justify-between">
                    <span>Hue</span>
                    <span className="font-medium">{displayedColor.hsl.h}°</span>
                  </div>
                  <div className="w-full bg-stone-200 h-1 rounded-full overflow-hidden">
                    <div className="bg-stone-500 h-full" style={{ width: `${(displayedColor.hsl.h / 360) * 100}%` }}></div>
                  </div>
                  <div className="flex justify-between">
                    <span>Sat</span>
                    <span className="font-medium">{displayedColor.hsl.s}%</span>
                  </div>
                  <div className="w-full bg-stone-200 h-1 rounded-full overflow-hidden">
                    <div className="bg-stone-500 h-full" style={{ width: `${displayedColor.hsl.s}%` }}></div>
                  </div>
                  <div className="flex justify-between">
                    <span>Lum</span>
                    <span className="font-medium">{displayedColor.hsl.l}%</span>
                  </div>
                  <div className="w-full bg-stone-200 h-1 rounded-full overflow-hidden">
                    <div className="bg-stone-500 h-full" style={{ width: `${displayedColor.hsl.l}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/60 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono text-stone-400">Contrast Check</span>
                  <div className="mt-2">
                    <div 
                      className="p-3 rounded-lg flex items-center justify-center font-bold text-lg"
                      style={{ backgroundColor: displayedColor.hex, color: displayedColor.hsl.l > 60 ? '#000000' : '#ffffff' }}
                    >
                      Text Visibility
                    </div>
                  </div>
                </div>
                <div className="text-xs text-stone-500 mt-2 font-mono">
                  Readability on self-background for accessible UI design.
                </div>
              </div>
            </div>
          </div>
        ) : imageSrc ? (
          <div className="bg-white p-12 rounded-2xl border border-stone-200 shadow-sm flex flex-col items-center justify-center text-center text-stone-400 h-full">
            <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-4">
              <Palette size={32} className="text-stone-300" />
            </div>
            <p className="font-serif text-xl font-bold mb-2 text-stone-700">Select a Color</p>
            <p className="text-sm max-w-sm text-stone-500">Hover over the image to see a preview, then click any pixel to view its full color specifications.</p>
          </div>
        ) : (
          <div className="bg-white p-12 rounded-2xl border border-stone-200 shadow-sm flex flex-col items-center justify-center text-center text-stone-400 h-full">
            <Palette size={48} className="mb-4 text-stone-300" />
            <p className="font-serif text-xl font-bold mb-2 text-stone-700">No Image Uploaded</p>
            <p className="text-sm max-w-sm">Upload an image on the left and hover over pixels to view full specification details.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MUSEUM SECTION
// ─────────────────────────────────────────────────────────────────────────────

function MuseumSection({ collection, onRemove, onExport, copyToClipboard }: { collection: SavedColor[], onRemove: (id: string) => void, onExport: () => void, copyToClipboard: (t: string) => void }) {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-serif text-2xl font-bold" style={{ color: SPRUCE }}>My Virtual Museum</h2>
          <p className="text-sm text-stone-500">Your curated collection of visual storytelling.</p>
        </div>
        {collection.length > 0 && (
          <button 
            onClick={onExport}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-white font-medium text-sm transition-colors"
            style={{ backgroundColor: OCEAN }}
          >
            <FileDown size={16} /> Export JSON
          </button>
        )}
      </div>

      {collection.length === 0 ? (
        <div className="bg-white border border-stone-200 p-12 rounded-2xl flex flex-col items-center justify-center text-center">
          <History size={48} className="text-stone-300 mb-4" />
          <h3 className="font-serif text-xl font-bold text-stone-700 mb-2">The Gallery is Empty</h3>
          <p className="text-stone-500 text-sm max-w-sm">Analyze images and add colors to your museum. They'll survive browser refreshes.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {collection.map((col) => (
            <div key={col.id} className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex flex-col group">
              <div className="h-32 relative" style={{ backgroundColor: col.hex }}>
                <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onRemove(col.id)}
                    className="p-1.5 rounded-full bg-white/80 hover:bg-white text-red-600 shadow-sm transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-serif text-lg font-bold text-stone-800 truncate">{col.name}</h3>
                    <span className="text-xs text-stone-400 font-mono">{col.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <code className="text-xs font-mono text-stone-600 cursor-pointer" onClick={() => copyToClipboard(col.hex)}>
                      {col.hex}
                    </code>
                  </div>
                  <div className="grid grid-cols-2 gap-y-1 gap-x-2 mt-3 text-xs text-stone-500 border-t border-stone-100 pt-3">
                    <div>Pos: <span className="text-stone-800">{col.position}</span></div>
                    <div>Type: <span className="text-stone-800">{col.type}</span></div>
                    <div>Temp: <span className="text-stone-800">{col.temperature}</span></div>
                  </div>
                </div>
                <button 
                  onClick={() => copyToClipboard(col.hex)}
                  className="mt-4 w-full py-1.5 text-xs font-mono tracking-wider text-stone-600 border border-stone-200 rounded-lg bg-stone-50 hover:bg-stone-100 transition-colors"
                >
                  COPY HEX
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COLOR BLINDNESS SECTION
// ─────────────────────────────────────────────────────────────────────────────

function BlindnessSection({ copyToClipboard }: { copyToClipboard: (t: string) => void }) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [activeSimulation, setActiveSimulation] = useState<'Standard' | 'Protanopia' | 'Deuteranopia' | 'Tritanopia'>('Standard');
  const [hoverColor, setHoverColor] = useState<ColorData | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target?.result as string);
        setHoverColor(null);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (imageSrc && imgRef.current && canvasRef.current) {
      const img = imgRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      img.onload = () => {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);
        applySimulationToCanvas();
      };
    }
  }, [imageSrc, activeSimulation]);

  const applySimulationToCanvas = () => {
    if (!imgRef.current || !canvasRef.current) return;
    const img = imgRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(img, 0, 0);

    if (activeSimulation === 'Standard') return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const rgb = { r: data[i], g: data[i+1], b: data[i+2] };
      const simRgb = simulateColorBlindness(rgb, activeSimulation as any);
      data[i] = simRgb.r;
      data[i+1] = simRgb.g;
      data[i+2] = simRgb.b;
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const px = Math.floor(x * scaleX);
    const py = Math.floor(y * scaleY);

    if (px < 0 || px >= canvas.width || py < 0 || py >= canvas.height) return;

    const pixelData = ctx.getImageData(px, py, 1, 1).data;
    const rgb = { r: pixelData[0], g: pixelData[1], b: pixelData[2] };
    const hsl = rgbToHsl(rgb);
    const hex = rgbToHex(rgb);
    const { name } = findClosestColorName(rgb);

    setHoverColor({
      hex,
      rgb,
      hsl,
      name,
      position: getColorPosition(hsl.h),
      type: getColorType(hsl.h, hsl.s, hsl.l),
      temperature: getColorTemperature(hsl.h)
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 xl:grid-cols-12 gap-8">
      <div className="xl:col-span-5 flex flex-col gap-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <h2 className="font-serif text-lg font-bold mb-4 flex items-center gap-2" style={{ color: SPRUCE }}>
            <EyeOff size={18} /> Color Vision Simulation
          </h2>
          
          {!imageSrc ? (
            <div className="border-2 border-dashed border-stone-300 rounded-xl h-64 flex flex-col items-center justify-center cursor-pointer hover:border-tulip transition-colors bg-stone-50">
              <input type="file" className="hidden" id="blindnessInput" accept="image/*" onChange={handleFileChange} />
              <label htmlFor="blindnessInput" className="cursor-pointer flex flex-col items-center">
                <Upload size={36} className="text-stone-400 mb-2" />
                <p className="font-medium text-sm text-stone-600">Upload image to simulate visual types</p>
                <p className="text-xs text-stone-400 mt-1">Check how others see your image</p>
              </label>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {(['Standard', 'Protanopia', 'Deuteranopia', 'Tritanopia'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setActiveSimulation(type)}
                    className={`py-2 px-1 text-xs font-mono font-medium rounded-lg border transition-all ${activeSimulation === type ? 'bg-spruce text-white border-transparent' : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              
              <div className="relative border border-stone-200 rounded-xl overflow-hidden h-96 cursor-crosshair">
                <img ref={imgRef} src={imageSrc} alt="Hidden" className="hidden" />
                <canvas 
                  ref={canvasRef} 
                  className="w-full h-full object-contain"
                  onMouseMove={handleMouseMove}
                />
              </div>

              <button 
                onClick={() => document.getElementById('blindnessInput')?.click()}
                className="w-full py-2 text-sm font-medium rounded-lg text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors"
              >
                Change Image
              </button>
              <input type="file" className="hidden" id="blindnessInput" accept="image/*" onChange={handleFileChange} />
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm text-sm text-stone-600">
          <h3 className="font-serif text-lg font-bold mb-2" style={{ color: SPRUCE }}>About Vision Deficiencies</h3>
          <ul className="space-y-2 font-mono text-xs">
            <li><strong className="text-stone-800">Protanopia:</strong> Lack of red cones. Reds look dimmer.</li>
            <li><strong className="text-stone-800">Deuteranopia:</strong> Lack of green cones. Difficulty distinguishing green/red.</li>
            <li><strong className="text-stone-800">Tritanopia:</strong> Lack of blue cones. Difficulty distinguishing blue/yellow.</li>
          </ul>
        </div>
      </div>

      <div className="xl:col-span-7">
        {hoverColor ? (
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col gap-6">
            <h3 className="font-serif text-lg font-bold" style={{ color: SPRUCE }}>Simulated Specification</h3>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="relative w-full md:w-48 h-48 rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex-shrink-0" style={{ backgroundColor: hoverColor.hex }}>
                <div className="absolute bottom-3 right-3 flex gap-1.5">
                  <button 
                    onClick={() => copyToClipboard(hoverColor.hex)}
                    className="p-1.5 rounded-full bg-white/80 hover:bg-white text-stone-700 shadow-sm transition-colors"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center">
                <span className="text-xs font-mono font-bold tracking-widest text-stone-400 uppercase">SPECIFICATION</span>
                <h2 className="font-serif text-3xl font-bold mt-1 text-stone-800">{hoverColor.name}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <code className="bg-stone-100 text-stone-700 font-mono text-sm px-2 py-1 rounded cursor-pointer" onClick={() => copyToClipboard(hoverColor.hex)}>
                    {hoverColor.hex}
                  </code>
                </div>
                <div className="grid grid-cols-2 mt-4 gap-y-2 text-sm border-t border-stone-100 pt-4">
                  <div><span className="text-stone-400">Position:</span> <span className="font-medium text-stone-800">{hoverColor.position}</span></div>
                  <div><span className="text-stone-400">Temp:</span> <span className="font-medium text-stone-800">{hoverColor.temperature}</span></div>
                  <div><span className="text-stone-400">Type:</span> <span className="font-medium text-stone-800">{hoverColor.type}</span></div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/60 font-mono text-sm">
                <span className="text-xs text-stone-400">RGB Profile</span>
                <div className="mt-2 flex justify-between"><span>R:</span> <span>{hoverColor.rgb.r}</span></div>
                <div className="flex justify-between"><span>G:</span> <span>{hoverColor.rgb.g}</span></div>
                <div className="flex justify-between"><span>B:</span> <span>{hoverColor.rgb.b}</span></div>
              </div>
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/60 font-mono text-sm">
                <span className="text-xs text-stone-400">HSL Profile</span>
                <div className="mt-2 flex justify-between"><span>Hue:</span> <span>{hoverColor.hsl.h}°</span></div>
                <div className="flex justify-between"><span>Sat:</span> <span>{hoverColor.hsl.s}%</span></div>
                <div className="flex justify-between"><span>Lum:</span> <span>{hoverColor.hsl.l}%</span></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-12 rounded-2xl border border-stone-200 shadow-sm flex flex-col items-center justify-center text-center text-stone-400 h-full">
            <EyeOff size={48} className="mb-4 text-stone-300" />
            <p className="font-serif text-xl font-bold mb-2 text-stone-700">No Simulation Active</p>
            <p className="text-sm max-w-sm">Upload an image, pick a color blindness type, and hover the image to inspect simulated views.</p>
          </div>
        )}
      </div>
    </div>
  );
}
