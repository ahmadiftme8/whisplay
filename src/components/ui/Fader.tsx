"use client";

import React, { useRef, useState, useEffect } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface FaderProps {
    value: number; // 0-100
    onChange: (val: number) => void;
    min?: number;
    max?: number;
    className?: string;
    label?: string;
}

export const Fader: React.FC<FaderProps> = ({
    value,
    onChange,
    min = 0,
    max = 100,
    className,
    label,
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const trackRef = useRef<HTMLDivElement>(null);
    const startYRef = useRef<number>(0);
    const startValueRef = useRef<number>(0);

    // Calculate percentage for visual positioning (0 = bottom, 100 = top)
    const percent = ((value - min) / (max - min)) * 100;

    const handlePointerDown = (e: React.PointerEvent) => {
        setIsDragging(true);
        startYRef.current = e.clientY;
        startValueRef.current = value;
        (e.target as Element).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging) return;

        // Movement: moving UP (negative Y) increases value.
        const deltaY = startYRef.current - e.clientY;

        // Sensitivity: how many pixels for full range?
        // Let's rely on pixel-to-value mapping or simply sensitivity factor.
        // If track is ~200px, 2px = 1%. 
        const sensitivity = 2; // 2px per unit
        const deltaValue = deltaY / sensitivity;

        let newValue = startValueRef.current + deltaValue;
        newValue = Math.max(min, Math.min(max, newValue));

        onChange(newValue);
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        setIsDragging(false);
        (e.target as Element).releasePointerCapture(e.pointerId);
    };

    return (
        <div className={twMerge("flex flex-col items-center gap-2 h-full min-h-[160px]", className)}>
            {/* Track / Groove */}
            <div
                className="relative flex-1 w-12 bg-[#151515] rounded-full border border-white/5 shadow-inner overflow-visible touch-none"
                ref={trackRef}
            >
                {/* Center Line visual */}
                <div className="absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-0.5 bg-white/5" />

                {/* Handle / Cap container - absolute positioned based on value */}
                {/* We map value 0 at bottom, 100 at top. Bottom CSS property = percent% */}
                <div
                    className="absolute left-0 right-0 h-8 -ml-1 -mr-1" // extend slightly wider than track
                    style={{ bottom: `${percent}%`, marginBottom: -16 }} // Center handle on value
                >
                    {/* The Physical Handle */}
                    <div
                        className={clsx(
                            "w-full h-12 bg-linear-to-b from-[#4a4a4a] to-[#2b2b2b] rounded-md border border-[#555] shadow-xl flex items-center justify-center cursor-ns-resize transition-shadow duration-150",
                            isDragging ? "shadow-knob-pressed scale-105" : "shadow-knob"
                        )}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                    >
                        {/* Handle Grip Lines */}
                        <div className="w-8 h-0.5 bg-black/50 mb-1 rounded-full" />
                        <div className="w-8 h-0.5 bg-black/50 rounded-full" />

                        {/* Indicator Line */}
                        <div className="absolute w-[80%] h-[2px] bg-amber-glow shadow-led-glow blur-[0.5px]" />
                    </div>
                </div>
            </div>

            {label && (
                <span className="text-[10px] font-mono tracking-widest text-metal-light uppercase drop-shadow-sm mt-2">
                    {label}
                </span>
            )}
        </div>
    );
};
