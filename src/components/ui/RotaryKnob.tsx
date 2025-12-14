"use client";

import React, { useRef, useState, useEffect } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface RotaryKnobProps {
    value: number; // 0-100
    onChange: (val: number) => void;
    min?: number;
    max?: number;
    size?: number;
    className?: string;
    label?: string;
}

export const RotaryKnob: React.FC<RotaryKnobProps> = ({
    value,
    onChange,
    min = 0,
    max = 100,
    size = 120,
    className,
    label,
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const startYRef = useRef<number>(0);
    const startValueRef = useRef<number>(0);

    // Rotation range: -135 to +135 degrees (270 total)
    const MIN_ROTATION = -135;
    const MAX_ROTATION = 135;

    // Convert value (0-100) to rotation
    const valueToRotation = (v: number) => {
        const range = max - min;
        const rotationRange = MAX_ROTATION - MIN_ROTATION;
        const percent = (v - min) / range;
        return MIN_ROTATION + percent * rotationRange;
    };

    const currentRotation = valueToRotation(value);

    const handlePointerDown = (e: React.PointerEvent) => {
        setIsDragging(true);
        startYRef.current = e.clientY;
        startValueRef.current = value;
        // Capture pointer to handle moves outside element
        (e.target as Element).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging) return;

        const deltaY = startYRef.current - e.clientY;
        // Sensitivity: 2px drag = 1 unit change?
        const sensitivity = 2;
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
        <div className={twMerge("flex flex-col items-center gap-4", className)}>
            <div
                className={clsx(
                    "relative rounded-full transition-shadow duration-200 cursor-ns-resize touch-none select-none",
                    isDragging ? "shadow-knob-pressed" : "shadow-knob"
                )}
                style={{ width: size, height: size }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
            >
                {/* Knob Body (Skeuomorphic Gradient) */}
                <div
                    className="absolute inset-0 rounded-full bg-linear-to-b from-[#3a3a3a] to-[#1a1a1a] border border-[#444]"
                    style={{
                        background: `conic-gradient(from 180deg at 50% 50%, #2b2b2b 0deg, #3a3a3a 180deg, #1a1a1a 360deg)`
                    }}
                >
                    {/* Rotating Indicator */}
                    <div
                        className="absolute inset-0 w-full h-full pointer-events-none"
                        style={{ transform: `rotate(${currentRotation}deg)` }}
                    >
                        {/* Marker Line */}
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1.5 h-4 bg-amber-glow rounded-full shadow-led-glow" />
                    </div>
                </div>
            </div>

            {/* Label */}
            {label && (
                <span className="text-xs font-mono tracking-widest text-metal-light uppercase drop-shadow-sm">
                    {label}
                </span>
            )}
        </div>
    );
};
