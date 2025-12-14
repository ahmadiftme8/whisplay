"use client";

import { useState, useEffect } from "react";
import { Moon, Clock } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { clsx } from "clsx";
import { useMixStore } from "@/store/useMixStore";

interface SleepTimerMenuProps {
    onSetTimer: (minutes: number) => void;
}

export const SleepTimerMenu: React.FC<SleepTimerMenuProps> = ({ onSetTimer }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTime, setActiveTime] = useState<number | null>(null);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    // Countdown logic for display
    useEffect(() => {
        if (!activeTime) {
            setTimeLeft(null);
            return;
        }

        setTimeLeft(activeTime * 60);
        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev === null || prev <= 0) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [activeTime]);

    const handleSetTime = (min: number) => {
        setActiveTime(min === 0 ? null : min);
        onSetTimer(min);
        setIsOpen(false);
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="relative z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    "p-2 rounded-full transition-all border",
                    activeTime ? "bg-amber-glow/20 border-amber-glow text-amber-glow shadow-led-glow" : "bg-transparent border-transparent text-white/50 hover:bg-white/10"
                )}
            >
                <div className="flex items-center gap-2">
                    <Moon size={20} />
                    {timeLeft !== null && (
                        <span className="text-xs font-mono w-10 text-left">
                            {formatTime(timeLeft)}
                        </span>
                    )}
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute right-0 top-12 w-48 bg-metal-light border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 flex flex-col"
                        >
                            <div className="p-3 bg-black/20 border-b border-white/5 text-xs text-white/40 uppercase tracking-widest font-mono">
                                Sleep Timer
                            </div>
                            {[15, 30, 60].map((min) => (
                                <button
                                    key={min}
                                    onClick={() => handleSetTime(min)}
                                    className={clsx(
                                        "flex items-center gap-3 p-3 text-sm transition-colors hover:bg-white/5 text-left",
                                        activeTime === min ? "text-amber-glow" : "text-white/80"
                                    )}
                                >
                                    <Clock size={16} />
                                    {min} Minutes
                                </button>
                            ))}
                            <div className="h-px bg-white/5 my-1" />
                            <button
                                onClick={() => handleSetTime(0)}
                                className="p-3 text-sm text-red-400 hover:bg-white/5 text-left transition-colors"
                            >
                                Disable Timer
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};
