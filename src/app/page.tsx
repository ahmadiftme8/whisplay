"use client";

import { useEffect, useState } from "react";
import { useAudioEngine } from "@/hooks/useAudioEngine";
import { Fader } from "@/components/ui/Fader";
import { useMixStore } from "@/store/useMixStore";
import { Play } from "lucide-react";
import { clsx } from "clsx";
import { TrackSelector } from "@/components/ui/TrackSelector";
import { SoundOption } from "@/store/useMixStore";
import { SleepTimerMenu } from "@/components/ui/SleepTimerMenu";
import { Waves, ListMusic } from "lucide-react";

export default function Home() {
  const { initializeAudio, isReady, loadTrack, setTimer } = useAudioEngine();
  const { tracks, setTrackVolume, setTrackSample, driftEnabled, setDrift } = useMixStore();
  const [hasInteracted, setHasInteracted] = useState(false);
  const [editingTrackId, setEditingTrackId] = useState<number | null>(null);

  const handleStart = async () => {
    await initializeAudio();
    setHasInteracted(true);
  };

  const handleTrackSelect = async (trackId: number, sound: SoundOption) => {
    // 1. Update State
    setTrackSample(trackId, sound);
    // 2. Update Audio Engine
    await loadTrack(trackId, sound.url);
    // 3. Close Drawer
    setEditingTrackId(null);
  };

  return (
    <main className="relative h-[100dvh] w-full bg-metal-dark overflow-hidden flex flex-col items-center">
      {/* Background Texture Overlay (Brushed Metal) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />

      {/* Header / Top Bar - Compact on Mobile */}
      <header className="w-full shrink-0 h-16 px-4 flex justify-between items-center bg-metal/50 backdrop-blur-sm border-b border-white/5 z-10">
        <h1 className="text-lg md:text-xl font-bold tracking-widest text-amber-glow/80 uppercase truncate mr-4">Whisplay</h1>
        <div className="flex gap-2 items-center shrink-0">
          {/* Drift Toggle */}
          <button
            onClick={() => setDrift(!driftEnabled)}
            className={clsx(
              "p-2 rounded-full transition-all border",
              driftEnabled
                ? "bg-amber-glow/20 border-amber-glow text-amber-glow shadow-led-glow"
                : "bg-transparent border-transparent text-white/40 hover:text-white/80"
            )}
            title="Toggle Drift (LFO)"
          >
            <Waves size={18} />
          </button>

          {/* Sleep Timer */}
          <SleepTimerMenu onSetTimer={setTimer} />
        </div>
      </header>

      {/* The Deck (Responsive Flex Layout) */}
      <div className="flex-1 w-full max-w-4xl p-4 flex gap-2 md:gap-4 items-stretch justify-center h-full min-h-0">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="flex-1 relative flex flex-col items-center bg-metal border border-white/5 rounded-2xl md:rounded-full py-4 shadow-2xl min-w-0"
          >
            {/* Top Section: Icon & Header */}
            <div className="shrink-0 flex flex-col items-center gap-2 mb-2 w-full px-1">
              <button
                onClick={() => setEditingTrackId(track.id)}
                className="flex flex-col items-center gap-1 group w-full pt-2"
                title="Change Sound"
              >
                <div className="p-2 md:p-3 rounded-full bg-black/20 border border-white/5 group-hover:border-amber-glow/50 group-hover:text-amber-glow transition-all shadow-inner">
                  <ListMusic size={16} className="opacity-50 group-hover:opacity-100" />
                </div>
                <span className="text-[10px] md:text-xs font-mono text-metal-light group-hover:text-amber-glow transition-colors uppercase tracking-widest truncate w-full text-center">
                  {track.name}
                </span>
              </button>
            </div>

            {/* Fader Area (Flex-1 to fill vertical space) */}
            <div className="flex-1 w-full flex justify-center min-h-0 py-2">
              <Fader
                value={track.volume}
                onChange={(val) => setTrackVolume(track.id, val)}
                className="h-full"
              // label="GAIN" // Label moved/removed for cleaner mobile logic
              />
            </div>

            {/* Bottom: Mute/Activity Area */}
            <div className="shrink-0 mt-2 h-4 w-4 md:h-6 md:w-6 rounded-full bg-black/50 shadow-inner flex items-center justify-center">
              <div
                className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-amber-glow transition-opacity duration-300"
                style={{ opacity: track.muted ? 0 : (track.volume > 0 ? 1 : 0.2) }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Track Selector Drawer */}
      <TrackSelector
        isOpen={editingTrackId !== null}
        trackId={editingTrackId}
        onClose={() => setEditingTrackId(null)}
        onSelect={handleTrackSelect}
      />

      {/* Start Overlay */}
      {!hasInteracted && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
          <button
            onClick={handleStart}
            className="group flex flex-col items-center gap-4 transition-transform active:scale-95"
          >
            <div className="p-8 rounded-full bg-metal border border-white/10 shadow-knob group-hover:shadow-knob-pressed transition-shadow">
              <Play size={48} className="text-amber-glow ml-1 fill-amber-glow/20" />
            </div>
            <span className="text-amber-glow/80 font-mono tracking-[0.2em] text-sm animate-pulse">
              INITIALIZE SYSTEM
            </span>
          </button>
        </div>
      )}
    </main>
  );
}
