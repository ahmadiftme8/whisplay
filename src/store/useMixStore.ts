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
    { id: 'rain', name: 'Baran (Rain)', category: 'nature', url: '/sounds/nature/baran.mp3' },
    { id: 'ocean', name: 'Relax Sea', category: 'nature', url: '/sounds/nature/Relax Sound - Sea.mp3' },
    // Flashholders until user adds more
    { id: 'thunder', name: 'Thunderstorm', category: 'nature', url: '/sounds/nature/thunder.mp3' },

    // White Noise
    { id: 'brown', name: 'Brown Noise', category: 'white-noise', url: '/sounds/white-noise/Deep_Sleep_Brown_Noise_Womb_Sound_Brown_Noise_All_Night,_Loop.mp3' },

    // Ambient
    { id: 'drone-1', name: 'Deep Sleep', category: 'ambient', url: '/sounds/ambient/Deep_Sleep_Music_Calming_Music_for_Sleep_Fall_Asleep_Stress_Relief.mp3' },
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
        { id: 0, name: "Rain", color: "bg-blue-900", volume: 50, muted: false, sampleUrl: "/sounds/nature/baran.mp3" },
        { id: 1, name: "Ocean", color: "bg-blue-500", volume: 40, muted: false, sampleUrl: "/sounds/nature/Relax Sound - Sea.mp3" },
        { id: 2, name: "Brown Noise", color: "bg-gray-700", volume: 30, muted: false, sampleUrl: "/sounds/white-noise/Deep_Sleep_Brown_Noise_Womb_Sound_Brown_Noise_All_Night,_Loop.mp3" },
        { id: 3, name: "Ambient", color: "bg-orange-900", volume: 20, muted: false, sampleUrl: "/sounds/ambient/Deep_Sleep_Music_Calming_Music_for_Sleep_Fall_Asleep_Stress_Relief.mp3" },
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
