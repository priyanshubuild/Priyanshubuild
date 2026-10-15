"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";

function NumberDrop({
  x,
  y,
  number,
  landed,
  rotation = 0,
}: {
  x: number;
  y: number;
  number: number;
  landed: boolean;
  rotation?: number;
}) {
  return (
    <div
      className="pointer-events-none absolute text-4xl font-bold"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        color: "rgb(255, 255, 255)",
        textShadow: landed ? "0 2px 4px rgba(255, 255, 255, 0.2)" : "none",
        opacity: landed ? 1 : 0.9,
        transition: landed ? "opacity 0.3s ease" : "none",
        fontFamily: "'Space Grotesk', sans-serif",
        letterSpacing: "-0.02em",
      }}
    >
      {number}
    </div>
  );
}

interface DropData {
  id: number;
  x: number;
  y: number;
  vy: number;
  vx: number;
  landed: boolean;
  restCount: number;
  number: number;
}

const GRAVITY = 0.8;
const DROP_SIZE = 32;
const DROP_RADIUS = DROP_SIZE / 2;
const FRICTION = 0.88;
const COLLISION_DISTANCE = DROP_SIZE + 2;
const BOUNCE_DAMPING = 0.72;
const AIR_RESISTANCE = 0.98;

function DropsContainer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [drops, setDrops] = useState<DropData[]>([]);
  const dropsRef = useRef<DropData[]>([]);
  const dropIdRef = useRef(0);
  const rotationRef = useRef<Map<number, number>>(new Map());

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const numbers = [4, 0, 4];
    const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];

    const newDrop: DropData = {
      id: dropIdRef.current++,
      x,
      y,
      vy: 0,
      vx: (Math.random() - 0.5) * 6,
      landed: false,
      restCount: 0,
      number: randomNumber,
    };

    dropsRef.current.push(newDrop);
    rotationRef.current.set(newDrop.id, 0);
    setDrops([...dropsRef.current]);
  };

  useEffect(() => {
    if (!containerRef.current || !drops.length) return;

    const container = containerRef.current;
    const width = container.offsetWidth;
    const height = container.offsetHeight;

    let animationFrameId: number;

    const simulate = () => {
      dropsRef.current = dropsRef.current.map((drop, idx) => {
        let { x, y, vy, vx, restCount } = drop;
        vy += GRAVITY;
        y += vy;
        x += vx;
        vx *= FRICTION;
        vy *= AIR_RESISTANCE;

        const currentRotation = rotationRef.current.get(drop.id) || 0;
        rotationRef.current.set(drop.id, currentRotation + vx * 2);

        if (x < DROP_RADIUS) {
          x = DROP_RADIUS;
          vx = Math.abs(vx) * BOUNCE_DAMPING;
        }
        if (x > width - DROP_RADIUS) {
          x = width - DROP_RADIUS;
          vx = -Math.abs(vx) * BOUNCE_DAMPING;
        }

        let onSurface = false;
        dropsRef.current.forEach((other, otherIdx) => {
          if (idx === otherIdx) return;
          const dx = other.x - x;
          const dy = other.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < COLLISION_DISTANCE) {
            if (dy > 0 && dy < DROP_SIZE * 1.5) {
              onSurface = true;
              if (Math.abs(vx) < 0.1 && Math.abs(vy) < 0.1) restCount++;
              else restCount = 0;

              const angle = Math.atan2(dy, dx);
              x = other.x - Math.cos(angle) * COLLISION_DISTANCE;
              y = other.y - Math.sin(angle) * COLLISION_DISTANCE;

              if (vy > 0.5) vy = -vy * BOUNCE_DAMPING;
              else vy = 0;

              vx *= 0.93;
            }
          }
        });

        if (y >= height - DROP_RADIUS) {
          onSurface = true;
          y = height - DROP_RADIUS;
          if (vy > 1) vy = -vy * BOUNCE_DAMPING;
          else vy = 0;
          if (Math.abs(vx) < 0.05) {
            vx = 0;
            restCount++;
          } else restCount = 0;
          vx *= 0.9;
        }

        if (!onSurface) restCount = 0;

        return { ...drop, x, y, vy, vx, landed: restCount > 10, restCount };
      });

      setDrops([...dropsRef.current]);
      if (!dropsRef.current.every((drop) => drop.landed))
        animationFrameId = requestAnimationFrame(simulate);
    };

    animationFrameId = requestAnimationFrame(simulate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [drops.length]);

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      className="relative h-full w-full cursor-crosshair overflow-hidden bg-[#09090B] select-none"
    >
      {drops.map((drop) => (
        <NumberDrop
          key={drop.id}
          x={drop.x}
          y={drop.y}
          number={drop.number}
          landed={drop.landed}
          rotation={rotationRef.current.get(drop.id) || 0}
        />
      ))}
    </div>
  );
}

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#09090B] p-4"
    >
      <div className="absolute inset-0 h-full w-full">
        <DropsContainer />
      </div>

      <div className="font-space-grotesk relative z-10 max-w-md text-center">
        <h1 className="mb-2 text-7xl font-bold tracking-tight text-white md:text-8xl">
          404
        </h1>
        <p className="mb-2 text-lg font-light text-gray-300 md:text-xl">
          Page Not Found
        </p>
        <p className="mt-4 mb-6 text-sm text-gray-400">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <Link
          href="/"
          className="inline-block rounded-xl bg-white px-8 py-3 font-medium text-black transition-colors hover:bg-gray-200"
        >
          Go Home
        </Link>
      </div>

      <p className="absolute top-8 z-10 animate-bounce text-sm text-gray-400 select-none">
        Click anywhere to drop a 404
      </p>
    </main>
  );
}
