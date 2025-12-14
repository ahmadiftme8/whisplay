"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as Tone from "tone";
import { useMixStore } from "@/store/useMixStore";

export const useAudioEngine = () => {
    const [isReady, setIsReady] = useState(false);
    const playersRef = useRef<Tone.Player[]>([]);
    const channelGainsRef = useRef<Tone.Gain[]>([]);
    const masterGainRef = useRef<Tone.Gain | null>(null);
    const lfosRef = useRef<Tone.LFO[]>([]);
    const driftGainsRef = useRef<Tone.Gain[]>([]); // New secondary gain stage for drift

    const { tracks, driftEnabled, masterVolume } = useMixStore();

    // Initialize Audio Context
    const initializeAudio = async () => {
        if (isReady) return;
        await Tone.start();

        // Create Master Gain
        masterGainRef.current = new Tone.Gain(1).toDestination();

        // Initialize 4 Channels
        // In a real app, we'd load buffers here. For now, placeholders or silence.
        // We'll set them up so they can be connected to buffers later.
        const players: Tone.Player[] = [];
        const gains: Tone.Gain[] = [];
        const driftGains: Tone.Gain[] = [];
        const lfos: Tone.LFO[] = [];

        for (let i = 0; i < 4; i++) {
            // Signal Path: Player -> VolGain -> DriftGain -> Master
            const driftGain = new Tone.Gain(1).connect(masterGainRef.current!);
            const volGain = new Tone.Gain(0).connect(driftGain);

            const player = new Tone.Player({
                loop: true,
                fadeIn: 0.1,
                fadeOut: 0.1,
            }).connect(volGain);

            // Drift LFO
            // Slow random frequency between 0.05 and 0.15 Hz
            const freq = 0.05 + Math.random() * 0.1;
            // Modulates gain between 0.8 and 1.2
            const lfo = new Tone.LFO(freq, 0.8, 1.2).start();

            // Connect LFO to driftGain.gain
            // NOTE: Tone.Gain.gain is an AudioParam. 
            // When connecting LFO to AudioParam, it modulates around the base value? 
            // Actually LFO output range is set above (0.8 to 1.2).
            // If we connect to gain, it overrides the value or adds?
            lfo.connect(driftGain.gain);

            players.push(player);
            gains.push(volGain);
            driftGains.push(driftGain);
            lfos.push(lfo);
        }

        playersRef.current = players;
        channelGainsRef.current = gains;
        driftGainsRef.current = driftGains;
        lfosRef.current = lfos;

        setIsReady(true);
        console.log("Audio Engine Initialized");
    };

    // Sync Volume Changes
    useEffect(() => {
        if (!isReady) return;

        tracks.forEach((track) => {
            const gainNode = channelGainsRef.current[track.id];
            if (gainNode) {
                // Linear ramp to new value to avoid clicking
                // Convert user 0-100 to 0-1 gain (maybe logarithmic if we want)
                // For ambient mixer, linear 0-1 is often okay, or Tone.dbToGain
                const targetGain = track.muted ? 0 : track.volume / 100;
                gainNode.gain.rampTo(targetGain, 0.1);
            }
        });
    }, [tracks, isReady]);

    // Handle Drift Toggle
    useEffect(() => {
        if (!isReady) return;

        // To enable drift, we ensure LFOs are running and amplitude is > 0
        // To disable, we can stop LFOs or set amplitude to 0 (which defaults modulation to nothing?)
        // Actually, if LFO is disconnected, gain stays at last value?
        // Tone LFO behavior: if stopped, output is 0? 
        // Re-architecture for Clean Toggle:
        // If drift OFF: Set DriftGain.gain to 1, mismatch LFO.
        // If drift ON: Connect LFO to DriftGain again?

        driftGainsRef.current.forEach((gainNode, i) => {
            const lfo = lfosRef.current[i];
            if (driftEnabled) {
                // Ensure LFO is influencing gain
                // If already connected, do nothing?
                // Tone.js doesn't easily let us check connection.
                // Simplest: Always run LFO, but change amplitude?
                // LFO.min/max can be changed.
                lfo.min = 0.8;
                lfo.max = 1.2;
            } else {
                // Flatten modulation
                lfo.min = 1;
                lfo.max = 1;
                // gainNode.gain.value = 1;
            }
        });

    }, [driftEnabled, isReady]);

    // Master Volume / Sleep Timer Logic
    // We don't have a sleep timer in the UI yet, but we will support master volume ramping
    useEffect(() => {
        if (!isReady || !masterGainRef.current) return;
        // masterVolume is 0-100
        const target = masterVolume / 100;
        masterGainRef.current.gain.rampTo(target, 0.5);
    }, [masterVolume, isReady]);

    const setTimer = (minutes: number) => {
        if (!isReady || !masterGainRef.current) return;
        if (minutes === 0) {
            // Cancel timer / Reset
            // We rely on the generic volume effect above to restore volume if store updates
            // But here we might want to ensure we cancel scheduled events
            masterGainRef.current.gain.cancelScheduledValues(Tone.now());
            masterGainRef.current.gain.rampTo(1, 1);
            return;
        }

        const duration = minutes * 60;
        // Ramp to 0 over duration
        masterGainRef.current.gain.rampTo(0, duration);
        // Scheduled stop?
        // playersRef.current.forEach(p => p.stop(Tone.now() + duration));
    };


    // Function to load a track url
    const loadTrack = async (trackId: number, url: string) => {
        if (!isReady) return;
        const player = playersRef.current[trackId];
        if (!player) return;

        try {
            await player.load(url);
            if (player.state !== "started") {
                player.start();
            }
        } catch (e) {
            console.error("Failed to load sound:", url, e);
        }
    };

    // Playback Control
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlayback = async () => {
        if (!isReady) return;

        // Access raw context to handle suspension correctly across Tone.js versions/types
        const ctx = Tone.context as any;

        if (Tone.context.state === 'running') {
            if (ctx.rawContext && ctx.rawContext.suspend) {
                await ctx.rawContext.suspend();
            } else if (ctx.suspend) {
                await ctx.suspend();
            }
            setIsPlaying(false);
        } else {
            await Tone.start(); // Helper to resume
            setIsPlaying(true);
        }
    };

    // Initialize state on load
    useEffect(() => {
        if (isReady) {
            setIsPlaying(Tone.context.state === 'running');
        }
    }, [isReady]);

    return {
        initializeAudio,
        isReady,
        loadTrack,
        setTimer,
        isPlaying,
        togglePlayback,
    };
};
