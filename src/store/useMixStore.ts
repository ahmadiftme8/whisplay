import { create } from 'zustand';

export interface TrackState {
    id: number;
    name: string;
    color: string;
    volume: number; // 0-100
    muted: boolean;
    sampleUrl: string;
}

export type SoundCategory = 'nature' | 'white-noise' | 'ambient';

export interface SoundOption {
    id: string;
    name: string;
    category: SoundCategory;
    url: string;
}

export const AVAILABLE_SOUNDS: SoundOption[] = [
    // Nature
    { id: 'rain', name: 'Heavy Rain', category: 'nature', url: '/sounds/nature/rain.mp3' },
    { id: 'thunder', name: 'Thunderstorm', category: 'nature', url: '/sounds/nature/thunder.mp3' },
    { id: 'wind', name: 'Howling Wind', category: 'nature', url: '/sounds/nature/wind.mp3' },
    { id: 'fire', name: 'Crackling Fire', category: 'nature', url: '/sounds/nature/fire.mp3' },
    { id: 'ocean', name: 'Ocean Waves', category: 'nature', url: '/sounds/nature/ocean.mp3' },
    { id: 'crickets', name: 'Night Crickets', category: 'nature', url: '/sounds/nature/crickets.mp3' },

    // White Noise
    { id: 'white', name: 'White Noise', category: 'white-noise', url: '/sounds/white-noise/white.mp3' },
    { id: 'pink', name: 'Pink Noise', category: 'white-noise', url: '/sounds/white-noise/pink.mp3' },
    { id: 'brown', name: 'Brown Noise', category: 'white-noise', url: '/sounds/white-noise/brown.mp3' },
    { id: 'fan', name: 'Box Fan', category: 'white-noise', url: '/sounds/white-noise/fan.mp3' },

    // Ambient
    { id: 'drone-1', name: 'Deep Space', category: 'ambient', url: '/sounds/ambient/deep-space.mp3' },
    { id: 'drone-2', name: 'Warm Pad', category: 'ambient', url: '/sounds/ambient/warm-pad.mp3' },
    { id: 'drone-3', name: 'Meditate', category: 'ambient', url: '/sounds/ambient/meditate.mp3' },
];

interface MixStore {
    masterVolume: number;
    driftEnabled: boolean;
    tracks: TrackState[];
    setTrackVolume: (id: number, val: number) => void;
    toggleTrackMute: (id: number) => void;
    setDrift: (enabled: boolean) => void;
    setMasterVolume: (val: number) => void;
    setTrackSample: (trackId: number, sound: SoundOption) => void;
}

export const useMixStore = create<MixStore>((set) => ({
    masterVolume: 80,
    driftEnabled: false,
    tracks: [
        { id: 0, name: "Rain", color: "bg-blue-900", volume: 50, muted: false, sampleUrl: "/sounds/nature/rain.mp3" },
        { id: 1, name: "Thunder", color: "bg-purple-900", volume: 20, muted: false, sampleUrl: "/sounds/nature/thunder.mp3" },
        { id: 2, name: "Wind", color: "bg-gray-700", volume: 40, muted: false, sampleUrl: "/sounds/nature/wind.mp3" },
        { id: 3, name: "Fire", color: "bg-orange-900", volume: 0, muted: false, sampleUrl: "/sounds/nature/fire.mp3" },
    ],
    setTrackVolume: (id, val) =>
        set((state) => ({
            tracks: state.tracks.map((t) => (t.id === id ? { ...t, volume: val } : t)),
        })),
    toggleTrackMute: (id) =>
        set((state) => ({
            tracks: state.tracks.map((t) => (t.id === id ? { ...t, muted: !t.muted } : t)),
        })),
    setDrift: (enabled) => set({ driftEnabled: enabled }),
    setMasterVolume: (val) => set({ masterVolume: val }),
    setTrackSample: (trackId, sound) =>
        set((state) => ({
            tracks: state.tracks.map((t) =>
                t.id === trackId ? { ...t, name: sound.name, sampleUrl: sound.url } : t
            )
        })),
}));
