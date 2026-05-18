"use client";

import { useRef, useMemo, useCallback, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 22000;
const MOUSE_RADIUS = 2;
const MOUSE_FORCE = 0.4;
const SCROLL_SMOOTH = 0.08;
const FORM_SPEED = 0.12;
const DAMPING = 0.82;

function sampleImagePositions(
  imageData: ImageData,
  count: number,
  scale: number
): Float32Array {
  const { data, width, height } = imageData;
  const positions = new Float32Array(count * 3);

  const opaquePoints: [number, number][] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const a = data[idx + 3];
      if (a < 128) continue;
      const isWhitish = r > 220 && g > 220 && b > 220;
      if (isWhitish) continue;
      const isPinkish = r > 120 && r > g + 30 && r > b - 20;
      if (!isPinkish) continue;
      opaquePoints.push([x, y]);
    }
  }

  if (opaquePoints.length === 0) {
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * scale;
      positions[i * 3 + 1] = (Math.random() - 0.5) * scale;
      positions[i * 3 + 2] = 0;
    }
    return positions;
  }

  const jitter = scale / Math.sqrt(opaquePoints.length) * 0.4;

  for (let i = 0; i < count; i++) {
    const pt = opaquePoints[Math.floor(Math.random() * opaquePoints.length)];
    const px = ((pt[0] / width) - 0.5) * scale;
    const py = -((pt[1] / height) - 0.5) * scale;
    positions[i * 3] = px + (Math.random() - 0.5) * jitter;
    positions[i * 3 + 1] = py + (Math.random() - 0.5) * jitter;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
  }

  return positions;
}

function generateScattered(count: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const radius = 4 + Math.random() * 8;
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = Math.random() * Math.PI * 2;
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = (radius * Math.cos(phi)) * 0.5;
  }
  return positions;
}

function loadLogoImage(url: string, size: number = 800): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;

      const ratio = img.width / img.height;
      let drawW: number, drawH: number, drawX: number, drawY: number;
      const padding = size * 0.06;
      const usable = size - padding * 2;
      if (ratio > 1) {
        drawW = usable;
        drawH = usable / ratio;
      } else {
        drawH = usable;
        drawW = usable * ratio;
      }
      drawX = (size - drawW) / 2;
      drawY = (size - drawH) / 2;

      ctx.drawImage(img, drawX, drawY, drawW, drawH);

      const eraseTop = drawY + drawH * 0.82;
      const eraseH = drawH * 0.18;
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillRect(drawX, eraseTop, drawW, eraseH);
      ctx.restore();

      ctx.fillStyle = "#E8275C";
      ctx.font = `bold ${drawW * 0.055}px Arial, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("X  I  A  O    J  I    S  H  U  O    A  I", size / 2, eraseTop + eraseH * 0.5);

      resolve(ctx.getImageData(0, 0, size, size));
    };
    img.onerror = (e) => reject(e);
    img.src = url;
  });
}

function drawLogo(): ImageData {
  const canvas = document.createElement("canvas");
  const S = 700;
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext("2d")!;
  const P = "#E8275C";

  const cx = S / 2;
  const ringCy = S * 0.36;
  const ringR = S * 0.27;
  const ringW = S * 0.045;

  ctx.beginPath();
  ctx.arc(cx, ringCy, ringR, 0, Math.PI * 2);
  ctx.lineWidth = ringW;
  ctx.strokeStyle = P;
  ctx.stroke();

  const headR = ringR * 0.45;
  const headX = cx;
  const headY = ringCy - ringR * 0.28;

  ctx.beginPath();
  ctx.arc(headX, headY, headR, 0, Math.PI * 2);
  ctx.fillStyle = P;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(headX + headR * 0.82, headY + headR * 0.05);
  ctx.lineTo(headX + headR * 1.35, headY + headR * 0.2);
  ctx.lineTo(headX + headR * 0.82, headY + headR * 0.42);
  ctx.closePath();
  ctx.fillStyle = P;
  ctx.fill();

  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(headX + headR * 0.35, headY - headR * 0.1, headR * 0.28, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.beginPath();
  ctx.moveTo(headX - headR * 0.05, headY - headR * 0.92);
  ctx.bezierCurveTo(
    headX + headR * 0.15, headY - headR * 1.2,
    headX + headR * 0.4, headY - headR * 1.35,
    headX + headR * 0.15, headY - headR * 1.1
  );
  ctx.lineWidth = ringW * 0.5;
  ctx.strokeStyle = P;
  ctx.lineCap = "round";
  ctx.stroke();

  const bodyTop = headY + headR * 0.78;
  const bodyTopW = headR * 0.62;
  const bodyBottomW = headR * 0.78;
  const bodyBottom = ringCy + ringR * 0.85;

  ctx.beginPath();
  ctx.moveTo(headX - bodyTopW, bodyTop);
  ctx.lineTo(headX - bodyBottomW, bodyBottom);
  ctx.quadraticCurveTo(
    headX - bodyBottomW, bodyBottom + headR * 0.15,
    headX - bodyBottomW * 0.7, bodyBottom + headR * 0.15
  );
  ctx.lineTo(headX + bodyBottomW * 0.7, bodyBottom + headR * 0.15);
  ctx.quadraticCurveTo(
    headX + bodyBottomW, bodyBottom + headR * 0.15,
    headX + bodyBottomW, bodyBottom
  );
  ctx.lineTo(headX + bodyTopW, bodyTop);
  ctx.closePath();
  ctx.fillStyle = P;
  ctx.fill();

  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  for (let d = 0; d < 3; d++) {
    const dy = bodyTop + (bodyBottom - bodyTop) * (0.4 + d * 0.22);
    ctx.beginPath();
    ctx.arc(headX, dy, S * 0.022, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  const textY = S * 0.78;
  ctx.font = `900 ${S * 0.13}px "Microsoft YaHei", "PingFang SC", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = P;
  ctx.fillText("小鸡说Ai", cx, textY);

  const subY = S * 0.88;
  ctx.font = `bold ${S * 0.038}px Arial, sans-serif`;
  ctx.fillText("X I A O   J I   A I", cx, subY);

  return ctx.getImageData(0, 0, S, S);
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

interface ParticleFieldProps {
  scrollProgress: React.MutableRefObject<number>;
}

export default function ParticleField({ scrollProgress }: ParticleFieldProps) {
  const meshRef = useRef<THREE.Points>(null);
  const mouseRef = useRef(new THREE.Vector3(0, 0, 0));
  const velocitiesRef = useRef(new Float32Array(PARTICLE_COUNT * 3));
  const targetPositionsRef = useRef(new Float32Array(PARTICLE_COUNT * 3));
  const scatteredRef = useRef<Float32Array | null>(null);
  const logoRef = useRef<Float32Array | null>(null);
  const smoothProgressRef = useRef(0);
  const [ready, setReady] = useState(false);
  const { camera } = useThree();

  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const radius = 4 + Math.random() * 8;
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = (radius * Math.cos(phi)) * 0.5;

      const colorChoice = Math.random();
      let color: THREE.Color;
      if (colorChoice < 0.7) {
        color = new THREE.Color("#FF2D7A");
      } else if (colorChoice < 0.95) {
        color = new THREE.Color("#FF5499");
      } else {
        color = new THREE.Color("#FFA0C0");
      }
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      sizes[i] = Math.random() * 0.5 + 0.5;
    }

    return { positions, colors, sizes };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      let imageData: ImageData;
      try {
        imageData = await loadLogoImage("/logo.png", 500);
      } catch {
        imageData = drawLogo();
      }
      if (cancelled) return;

      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
      const logoScale = isMobile ? 4.5 : 7;
      const logoShape = sampleImagePositions(imageData, PARTICLE_COUNT, logoScale);
      const scatteredShape = generateScattered(PARTICLE_COUNT);

      logoRef.current = logoShape;
      scatteredRef.current = scatteredShape;

      setReady(true);
    };

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  const handlePointerMove = useCallback(
    (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      const vec = new THREE.Vector3(x, y, 0.5);
      vec.unproject(camera);
      vec.sub(camera.position).normalize();
      const dist = -camera.position.z / vec.z;
      mouseRef.current.copy(camera.position).add(vec.multiplyScalar(dist));
    },
    [camera]
  );

  useEffect(() => {
    window.addEventListener("mousemove", handlePointerMove);
    return () => window.removeEventListener("mousemove", handlePointerMove);
  }, [handlePointerMove]);

  useFrame((state) => {
    if (!meshRef.current || !ready || !logoRef.current || !scatteredRef.current) return;

    const posArr = meshRef.current.geometry.attributes.position.array as Float32Array;
    const vel = velocitiesRef.current;
    const targetPositions = targetPositionsRef.current;
    const logo = logoRef.current;
    const scattered = scatteredRef.current;

    smoothProgressRef.current += (scrollProgress.current - smoothProgressRef.current) * SCROLL_SMOOTH;
    const p = Math.max(0, Math.min(1, smoothProgressRef.current));
    const time = state.clock.elapsedTime;

    let logoT: number;
    let dissolveT = 0;
    if (p < 0.2) {
      logoT = 0;
    } else if (p < 0.6) {
      logoT = easeInOutCubic((p - 0.2) / 0.4);
    } else if (p < 0.85) {
      logoT = 1;
    } else {
      logoT = 1;
      dissolveT = (p - 0.85) / 0.15;
    }

    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    const breathe = Math.sin(time * 0.8) * 0.02 * (1 - logoT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      const noise = Math.sin(time * 0.4 + i * 0.13) * 0.04 * (1 - logoT);
      const sx = scattered[i3] + Math.cos(time * 0.3 + i * 0.07) * 0.05 * (1 - logoT) + breathe;
      const sy = scattered[i3 + 1] + Math.sin(time * 0.35 + i * 0.11) * 0.05 * (1 - logoT);
      const sz = scattered[i3 + 2] + noise;

      let tx = sx * (1 - logoT) + logo[i3] * logoT;
      let ty = sy * (1 - logoT) + logo[i3 + 1] * logoT;
      let tz = sz * (1 - logoT) + logo[i3 + 2] * logoT;

      if (dissolveT > 0) {
        const lx = logo[i3];
        const ly = logo[i3 + 1];
        const dirLen = Math.sqrt(lx * lx + ly * ly) + 0.001;
        const outwardX = (lx / dirLen) * dissolveT * 8;
        const outwardY = (ly / dirLen) * dissolveT * 8;
        const outwardZ = dissolveT * 6;
        tx += outwardX;
        ty += outwardY;
        tz += outwardZ;
      }

      targetPositions[i3] = tx;
      targetPositions[i3 + 1] = ty;
      targetPositions[i3 + 2] = tz;

      vel[i3] += (tx - posArr[i3]) * FORM_SPEED;
      vel[i3 + 1] += (ty - posArr[i3 + 1]) * FORM_SPEED;
      vel[i3 + 2] += (tz - posArr[i3 + 2]) * FORM_SPEED;

      const dx = posArr[i3] - mx;
      const dy = posArr[i3 + 1] - my;
      const dz = posArr[i3 + 2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist < MOUSE_RADIUS && dist > 0.01) {
        const force = ((MOUSE_RADIUS - dist) / MOUSE_RADIUS) * MOUSE_FORCE;
        vel[i3] += (dx / dist) * force;
        vel[i3 + 1] += (dy / dist) * force;
        vel[i3 + 2] += (dz / dist) * force * 0.3;
      }

      vel[i3] *= DAMPING;
      vel[i3 + 1] *= DAMPING;
      vel[i3 + 2] *= DAMPING;

      posArr[i3] += vel[i3];
      posArr[i3 + 1] += vel[i3 + 1];
      posArr[i3 + 2] += vel[i3 + 2];
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true;

    meshRef.current.rotation.y = (1 - logoT) * Math.sin(time * 0.1) * 0.15 + logoT * (p > 0.6 ? (p - 0.6) * 0.3 : 0);
    meshRef.current.rotation.x = (1 - logoT) * Math.cos(time * 0.13) * 0.1;
    meshRef.current.position.set(0, 0, 0);

    if (meshRef.current.material instanceof THREE.ShaderMaterial) {
      const u = meshRef.current.material.uniforms.opacity;
      if (u) u.value = Math.max(0, 1 - dissolveT * 0.7);
    }
  });

  const vertexShader = `
    attribute float size;
    varying vec3 vColor;
    varying float vDist;
    void main() {
      vColor = color;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vDist = -mvPosition.z;
      gl_PointSize = size * (38.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    varying vec3 vColor;
    varying float vDist;
    uniform float opacity;
    void main() {
      float dist = length(gl_PointCoord - vec2(0.5));
      if (dist > 0.5) discard;
      float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
      alpha = pow(alpha, 1.8) * 0.85;
      float depthFade = clamp(1.0 - vDist / 25.0, 0.3, 1.0);
      gl_FragColor = vec4(vColor, alpha * depthFade * opacity);
    }
  `;

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{ opacity: { value: 1 } }}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
        vertexColors
      />
    </points>
  );
}
