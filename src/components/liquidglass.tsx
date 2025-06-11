'use client';
import { useCallback, useRef, useState } from 'react';

// Enhanced displacement map with more organic patterns
const createDisplacementMap = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Create organic noise pattern
  const imageData = ctx.createImageData(512, 512);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const noise = Math.random();
    const organic = Math.sin(i * 0.001) * 128 + 128;
    data[i] = noise * organic; // R
    data[i + 1] = noise * organic; // G
    data[i + 2] = noise * organic; // B
    data[i + 3] = 255; // A
  }

  ctx.putImageData(imageData, 0, 0);

  // Add gradient overlay for smoother edges
  const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
  gradient.addColorStop(0, 'rgba(255,255,255,0.5)');
  gradient.addColorStop(1, 'rgba(0,0,0,0.5)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 512);

  return canvas.toDataURL();
};

const displacementMap = createDisplacementMap();

/* ---------- Enhanced SVG filters ---------- */
const GlassFilter: React.FC<{
  id: string;
  displacementScale: number;
  aberrationIntensity: number;
  width: number;
  height: number;
  shimmerIntensity: number;
  refractionAmount: number;
}> = ({
  id,
  displacementScale,
  aberrationIntensity,
  width,
  height,
  shimmerIntensity,
  refractionAmount,
}) => (
  <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
    <defs>
      {/* Animated turbulence for shimmer effect */}
      <filter id={`${id}-turbulence`}>
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.02 0.1"
          numOctaves="4"
          seed="2"
        >
          <animate
            attributeName="baseFrequency"
            dur="20s"
            values="0.02 0.1;0.04 0.2;0.02 0.1"
            repeatCount="indefinite"
          />
        </feTurbulence>
      </filter>

      {/* Main glass filter with enhanced effects */}
      <filter
        id={id}
        x="-50%"
        y="-50%"
        width="200%"
        height="200%"
        colorInterpolationFilters="sRGB"
      >
        {/* Displacement map */}
        <feImage
          href={displacementMap}
          result="DISPLACEMENT_MAP"
          preserveAspectRatio="xMidYMid slice"
        />

        {/* Turbulence for organic movement */}
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.01 0.01"
          numOctaves="2"
          result="TURBULENCE"
        />

        {/* Combine displacement with turbulence */}
        <feComposite
          in="DISPLACEMENT_MAP"
          in2="TURBULENCE"
          operator="multiply"
          result="COMBINED_DISPLACEMENT"
        />

        {/* Create refraction effect */}
        <feGaussianBlur
          in="SourceGraphic"
          stdDeviation="0.5"
          result="BLUR_SOURCE"
        />

        {/* R channel with refraction */}
        <feDisplacementMap
          in="BLUR_SOURCE"
          in2="COMBINED_DISPLACEMENT"
          scale={displacementScale * refractionAmount}
          xChannelSelector="R"
          yChannelSelector="G"
          result="R_DISPLACED"
        />
        <feColorMatrix
          in="R_DISPLACED"
          type="matrix"
          values="1 0 0 0 0
                  0 0 0 0 0
                  0 0 0 0 0
                  0 0 0 1 0"
          result="R_CHANNEL"
        />

        {/* G channel with different displacement */}
        <feDisplacementMap
          in="BLUR_SOURCE"
          in2="COMBINED_DISPLACEMENT"
          scale={displacementScale * refractionAmount * 1.1}
          xChannelSelector="G"
          yChannelSelector="B"
          result="G_DISPLACED"
        />
        <feColorMatrix
          in="G_DISPLACED"
          type="matrix"
          values="0 0 0 0 0
                  0 1 0 0 0
                  0 0 0 0 0
                  0 0 0 1 0"
          result="G_CHANNEL"
        />

        {/* B channel with maximum displacement */}
        <feDisplacementMap
          in="BLUR_SOURCE"
          in2="COMBINED_DISPLACEMENT"
          scale={displacementScale * refractionAmount * 1.2}
          xChannelSelector="B"
          yChannelSelector="R"
          result="B_DISPLACED"
        />
        <feColorMatrix
          in="B_DISPLACED"
          type="matrix"
          values="0 0 0 0 0
                  0 0 0 0 0
                  0 0 1 0 0
                  0 0 0 1 0"
          result="B_CHANNEL"
        />

        {/* Combine channels with additive blending */}
        <feComposite
          in="R_CHANNEL"
          in2="G_CHANNEL"
          operator="screen"
          result="RG_COMBINED"
        />
        <feComposite
          in="RG_COMBINED"
          in2="B_CHANNEL"
          operator="screen"
          result="RGB_COMBINED"
        />

        {/* Add shimmer highlights */}
        <feGaussianBlur in="RGB_COMBINED" stdDeviation="2" result="GLOW" />
        <feColorMatrix
          in="GLOW"
          type="matrix"
          values={`${1 + shimmerIntensity} 0 0 0 0
                   0 ${1 + shimmerIntensity} 0 0 0
                   0 0 ${1 + shimmerIntensity} 0 0
                   0 0 0 1 0`}
          result="SHIMMER"
        />

        {/* Final composite */}
        <feComposite in="SHIMMER" in2="RGB_COMBINED" operator="screen" />

        {/* Subtle drop shadow for depth */}
        <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.2" />
      </filter>

      {/* Iridescent gradient for overlay effects */}
      <linearGradient
        id={`${id}-iridescent`}
        x1="0%"
        y1="0%"
        x2="100%"
        y2="100%"
      >
        <stop offset="0%" stopColor="#ff00ff" stopOpacity="0.2">
          <animate
            attributeName="stopColor"
            dur="10s"
            values="#ff00ff;#00ffff;#ffff00;#ff00ff"
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="50%" stopColor="#00ffff" stopOpacity="0.1">
          <animate
            attributeName="stopColor"
            dur="10s"
            values="#00ffff;#ffff00;#ff00ff;#00ffff"
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="100%" stopColor="#ffff00" stopOpacity="0.2">
          <animate
            attributeName="stopColor"
            dur="10s"
            values="#ffff00;#ff00ff;#00ffff;#ffff00"
            repeatCount="indefinite"
          />
        </stop>
      </linearGradient>
    </defs>
  </svg>
);

/* ---------- Enhanced Liquid Glass Component ---------- */
interface LiquidGlassProps {
  children: React.ReactNode;
  displacementScale?: number;
  blurAmount?: number;
  saturation?: number;
  aberrationIntensity?: number;
  shimmerIntensity?: number;
  refractionAmount?: number;
  elasticity?: number;
  cornerRadius?: number;
  globalMousePos?: { x: number; y: number };
  mouseOffset?: { x: number; y: number };
  mouseContainer?: React.RefObject<HTMLElement | null> | null;
  className?: string;
  padding?: string;
  style?: React.CSSProperties;
  overLight?: boolean;
  onClick?: () => void;
  magneticPull?: boolean;
  glowIntensity?: number;
}

export default function LiquidGlass({
  cornerRadius = 999,
  globalMousePos: externalGlobalMousePos,
  mouseOffset: externalMouseOffset,
  mouseContainer = null,
  className = '',
  padding = '24px 32px',
  overLight = false,
  style = {},
  onClick,
  magneticPull = true,
  glowIntensity = 0.5,
}: LiquidGlassProps) {
  const glassRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [glassSize, setGlassSize] = useState({ width: 270, height: 69 });
  const [internalGlobalMousePos, setInternalGlobalMousePos] = useState({
    x: 0,
    y: 0,
  });
  const [internalMouseOffset, setInternalMouseOffset] = useState({
    x: 0,
    y: 0,
  });
  const [ripples, setRipples] = useState<
    Array<{ x: number; y: number; id: number }>
  >([]);

  // Use external mouse position if provided
  const globalMousePos = externalGlobalMousePos || internalGlobalMousePos;
  const mouseOffset = externalMouseOffset || internalMouseOffset;

  // Magnetic pull effect
  const [magneticOffset, setMagneticOffset] = useState({ x: 0, y: 0 });

  // Internal mouse tracking with magnetic effect
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const container = mouseContainer?.current || glassRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      // Magnetic pull calculation
      if (magneticPull && distance < 150) {
        const pullStrength = (150 - distance) / 150;
        setMagneticOffset({
          x: distanceX * pullStrength * 0.1,
          y: distanceY * pullStrength * 0.1,
        });
      } else {
        setMagneticOffset({ x: 0, y: 0 });
      }

      setInternalMouseOffset({
        x: (distanceX / rect.width) * 100,
        y: (distanceY / rect.height) * 100,
      });

      setInternalGlobalMousePos({ x: e.clientX, y: e.clientY });
    },
    [mouseContainer, magneticPull]
  );

  return (
    <>
      {/* Glow effect */}
      <div
        className={`absolute pointer-events-none transition-all duration-300`}
        style={{
          width: `${glassSize.width + 100}px`,
          height: `${glassSize.height + 100}px`,
          borderRadius: `${cornerRadius}px`,
          background: `radial-gradient(circle at 50% 50%, 
            rgba(138, 43, 226, ${
              isHovered ? glowIntensity : glowIntensity * 0.3
            }) 0%, 
            rgba(30, 144, 255, ${
              isHovered ? glowIntensity * 0.5 : glowIntensity * 0.1
            }) 50%, 
            transparent 70%)`,
          filter: 'blur(40px)',
          opacity: overLight ? 0 : 1,
        }}
      />

      {/* Shadow layers for depth */}
      <div
        className={`absolute pointer-events-none transition-all duration-300`}
        style={{
          height: glassSize.height,
          width: glassSize.width,
          borderRadius: `${cornerRadius}px`,
          boxShadow: `
            0 10px 40px rgba(0, 0, 0, ${overLight ? 0.4 : 0.2}),
            0 2px 10px rgba(0, 0, 0, ${overLight ? 0.3 : 0.1})
          `,
        }}
      />

      <style jsx>{`
        @keyframes ripple {
          from {
            width: 20px;
            height: 20px;
            opacity: 1;
          }
          to {
            width: 100px;
            height: 100px;
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}
