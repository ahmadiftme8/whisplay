"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Music2, CloudRain, Wind } from "lucide-react";
import { AVAILABLE_SOUNDS, SoundCategory, SoundOption, useMixStore } from "@/store/useMixStore";
import { clsx } from "clsx";

interface TrackSelectorProps {
    isOpen: boolean;
    trackId: number | null;
    onClose: () => void;
    onSelect: (trackId: number, sound: SoundOption) => void;
}

export const TrackSelector: React.FC<TrackSelectorProps> = ({
    isOpen,
    trackId,
    onClose,
    onSelect,
}) => {
    const [activeTab, setActiveTab] = useState<SoundCategory>('nature');
    const tracks = useMixStore((state) => state.tracks);
    const currentTrack = trackId !== null ? tracks[trackId] : null;

    const categories: { id: SoundCategory; label: string; icon: React.ReactNode }[] = [
        { id: 'nature', label: 'Nature', icon: <CloudRain size={16} /> },
        { id: 'white-noise', label: 'Noises', icon: <Wind size={16} /> },
        { id: 'ambient', label: 'Ambient', icon: <Music2 size={16} /> },
    ];

    const filteredSounds = AVAILABLE_SOUNDS.filter(s => s.category === activeTab);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed bottom-0 left-0 right-0 h-[60dvh] bg-metal-DEFAULT border-t border-white/10 rounded-t-3xl z-50 flex flex-col shadow-2xl overflow-hidden"
                    >
                        {/* Handle / Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-metal-light/20">
                            <div>
                                <span className="text-xs font-mono text-amber-glow/60 uppercase tracking-widest">Select Sound</span>
                                <h2 className="text-lg font-bold text-white tracking-wide">
                                    {currentTrack ? `Channel ${currentTrack.id + 1}` : 'Channel'}
                                </h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                            >
                                <X size={24} className="text-white/60" />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex p-2 gap-2 overflow-x-auto no-scrollbar border-b border-white/5 bg-black/20">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveTab(cat.id)}
                                    className={clsx(
                                        "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                                        activeTab === cat.id
                                            ? "bg-amber-glow text-black shadow-led-glow"
                                            : "bg-white/5 text-white/60 hover:bg-white/10"
                                    )}
                                >
                                    {cat.icon}
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        {/* List */}
                        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-3 pb-8">
                            {filteredSounds.map((sound) => (
                                <button
                                    key={sound.id}
                                    onClick={() => trackId !== null && onSelect(trackId, sound)}
                                    className={clsx(
                                        "flex flex-col items-start p-4 rounded-xl border transition-all text-left group active:scale-95",
                                        currentTrack?.sampleUrl === sound.url
                                            ? "bg-amber-glow/10 border-amber-glow/50 ring-1 ring-amber-glow/50"
                                            : "bg-white/5 border-white/5 hover:bg-white/10"
                                    )}
                                >
                                    <span className={clsx(
                                        "text-sm font-medium group-hover:text-amber-glow transition-colors",
                                        currentTrack?.sampleUrl === sound.url ? "text-amber-glow" : "text-white/90"
                                    )}>
                                        {sound.name}
                                    </span>
                                    <span className="text-xs text-white/40 mt-1 capitalize">{sound.category}</span>
                                </button>
                            ))}
                        </div>

                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
