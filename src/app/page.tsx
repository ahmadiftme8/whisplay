"use client";

import { useEffect, useState } from "react";
import { useAudioEngine } from "@/hooks/useAudioEngine";
import { RotaryKnob } from "@/components/ui/RotaryKnob";
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
    <main className="relative h-[100dvh] w-full bg-metal-dark overflow-hidden flex flex-col items-center justify-center">
      {/* Background Texture Overlay (Brushed Metal) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />

      {/* Header / Top Bar */}
      <header className="absolute top-0 w-full p-6 flex justify-between items-center bg-metal/50 backdrop-blur-sm border-b border-white/5 z-10">
        <h1 className="text-xl font-bold tracking-widest text-amber-glow/80 uppercase">Whisplay</h1>
        <div className="flex gap-4 items-center">
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
            <Waves size={20} />
          </button>

          {/* Sleep Timer */}
          <SleepTimerMenu onSetTimer={setTimer} />
        </div>
      </header>

      {/* The Deck (4 Channels) */}
      <div className="grid grid-cols-4 gap-2 w-full max-w-2xl h-full pt-20 pb-10 px-4">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="relative flex flex-col items-center justify-center gap-8 bg-metal border border-white/5 rounded-full py-8 shadow-2xl"
          >
            {/* Channel Label/Button */}
            {/* Channel Label/Button */}
            <button
              onClick={() => setEditingTrackId(track.id)}
              className="absolute top-6 flex flex-col items-center gap-1 group"
              title="Change Sound"
            >
              <div className="p-2 rounded-full bg-black/20 border border-white/5 group-hover:border-amber-glow/50 group-hover:text-amber-glow transition-all shadow-inner">
                <ListMusic size={14} className="opacity-50 group-hover:opacity-100" />
              </div>
              <span className="text-[10px] font-mono text-metal-light group-hover:text-amber-glow transition-colors uppercase tracking-widest">
                {track.name}
              </span>
            </button>

            {/* Volume Knob */}
            <RotaryKnob
              value={track.volume}
              onChange={(val) => setTrackVolume(track.id, val)}
              label="GAIN"
            />

            {/* Mute/Solo Indicators (Placeholder) */}
            <div className="mt-auto h-1 w-12 bg-black/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-glow transition-all duration-300"
                style={{ width: `${track.volume}%`, opacity: track.muted ? 0.2 : 1 }}
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
