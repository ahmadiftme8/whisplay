"use client";

import { useState, useEffect } from "react";
import { useAudioEngine } from "@/hooks/useAudioEngine";
import { Fader } from "@/components/ui/Fader";
import { useMixStore } from "@/store/useMixStore";
import { Play, Pause, SkipBack, SkipForward, Moon, HelpCircle } from "lucide-react";
import { TrackSelector } from "@/components/ui/TrackSelector";
import { SoundOption } from "@/store/useMixStore";
import { SleepTimerMenu } from "@/components/ui/SleepTimerMenu";
import {
    AppBar,
    Toolbar,
    Button,
    Window,
    WindowHeader,
    WindowContent,
    ScrollView,
    Cutout,
    Avatar,
    Separator,
    GroupBox
} from "react95";

function ClientClock() {
    const [time, setTime] = useState<string | null>(null);

    useEffect(() => {
        setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        const timer = setInterval(() => {
            setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    if (!time) return <span>--:--</span>;
    return <span>{time}</span>;
}

export default function Home() {
    const { initializeAudio, isReady, loadTrack, setTimer, isPlaying, togglePlayback } = useAudioEngine();
    const { tracks, setTrackVolume, setTrackSample, driftEnabled, setDrift } = useMixStore();
    const [hasInteracted, setHasInteracted] = useState(false);
    const [editingTrackId, setEditingTrackId] = useState<number | null>(null);

    const handleStart = async () => {
        await initializeAudio();
        setHasInteracted(true);
    };

    const handleTrackSelect = async (trackId: number, sound: SoundOption) => {
        setTrackSample(trackId, sound);
        await loadTrack(trackId, sound.url);
        setEditingTrackId(null);
    };

    return (
        <main style={{ height: '100dvh', width: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: '#008080' }}>

            {/* Start Overlay */}
            {!hasInteracted && (
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 9999, background: '#008080',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <Window className="window" style={{ maxWidth: 300 }}>
                        <WindowHeader className="window-title">
                            <span>Welcome.exe</span>
                        </WindowHeader>
                        <WindowContent>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, textAlign: 'center' }}>
                                <p style={{ lineHeight: 1.5 }}>
                                    Welcome to Whisplay OS.<br />
                                    Please initialize the audio engine to continue.
                                </p>
                                <Button onClick={handleStart} size="lg">
                                    <Play size={16} style={{ marginRight: 8 }} />
                                    Start System
                                </Button>
                            </div>
                        </WindowContent>
                    </Window>
                </div>
            )}

            {/* Desktop Area */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: 50 }}>
                <Window className="window" style={{ width: 350, maxWidth: '95%' }}>
                    <WindowHeader className="window-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <img src="https://win98icons.alexmeub.com/icons/png/cd_audio_cd-0.png" style={{ height: 16 }} alt="" />
                            <span>Whisplay Player</span>
                        </div>
                        <Button size="sm" square>
                            <span style={{ fontWeight: 'bold', transform: 'translateY(-1px)' }}>x</span>
                        </Button>
                    </WindowHeader>

                    <Toolbar>
                        <Button variant="menu" size="sm">File</Button>
                        <Button variant="menu" size="sm">Options</Button>
                        <Button variant="menu" size="sm">Help</Button>
                    </Toolbar>

                    <WindowContent>
                        {/* Artwork Area */}
                        <div style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
                            <Cutout style={{ width: 100, height: 100, background: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <img
                                    src="https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=300&auto=format&fit=crop"
                                    alt="Album Art"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </Cutout>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div style={{ background: 'navy', color: 'lime', padding: 8, fontFamily: 'monospace', fontSize: 13, border: '2px solid white', boxShadow: 'inset 1px 1px 2px black' }}>
                                    <div style={{ marginBottom: 4 }}>TRACK: {tracks.find(t => t.volume > 0)?.name || "Ready"}</div>
                                    <div>STATUS: {isPlaying ? "PLAYING" : "STOPPED"}</div>
                                </div>

                                <div style={{ display: 'flex', gap: 4 }}>
                                    <Button onClick={togglePlayback} active={isPlaying} style={{ flex: 1, fontWeight: 'bold' }}>
                                        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                                    </Button>
                                    <Button square>
                                        <SkipBack size={16} />
                                    </Button>
                                    <Button square>
                                        <SkipForward size={16} />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <Separator style={{ marginBottom: 15 }} />

                        {/* Controls/Mixer */}
                        <GroupBox label="Mixer">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {tracks.map((track, i) => (
                                    <div key={track.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <Button
                                            onClick={() => setEditingTrackId(track.id)}
                                            style={{ minWidth: 80, textAlign: 'left', justifyContent: 'flex-start' }}
                                            active={editingTrackId === track.id}
                                            size="sm"
                                        >
                                            {track.name.substring(0, 8)}...
                                        </Button>
                                        <div style={{ flex: 1 }}>
                                            <Fader
                                                value={track.volume}
                                                onChange={(val) => setTrackVolume(track.id, val)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </GroupBox>

                        <div style={{ marginTop: 15, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Button onClick={() => setDrift(!driftEnabled)} active={driftEnabled}>
                                <Moon size={16} style={{ marginRight: 6 }} />
                                Drift Mode
                            </Button>
                            <SleepTimerMenu onSetTimer={setTimer} />
                        </div>

                    </WindowContent>

                    {/* Status Bar */}
                    <div className="status-bar" style={{ marginTop: 4, display: 'flex', gap: 2 }}>
                        <Cutout style={{ flex: 1, padding: '2px 6px' }}>
                            <span style={{ fontSize: 11 }}>{isPlaying ? "Playing..." : "Ready"}</span>
                        </Cutout>
                        <Cutout style={{ width: 60, padding: '2px 6px' }}>
                            <span style={{ fontSize: 11 }}>{isReady ? "Online" : "Booting..."}</span>
                        </Cutout>
                    </div>
                </Window>
            </div>

            {/* Taskbar */}
            <AppBar style={{ position: 'fixed', bottom: 0, top: 'auto', left: 0, right: 0, zIndex: 9000 }}>
                <Toolbar style={{ justifyContent: 'space-between', height: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                        <Button variant="menu" style={{ fontWeight: 'bold', height: '100%', display: 'flex', alignItems: 'center' }}>
                            <img
                                src="https://win98icons.alexmeub.com/icons/png/start_menu-0.png"
                                alt="logo"
                                style={{ height: '22px', marginRight: 6 }}
                            />
                            Start
                        </Button>
                        <Separator orientation="vertical" size="40px" style={{ margin: '0 8px' }} />
                        {/* Taskbar Items could go here */}
                    </div>
                    <Cutout style={{ background: 'transparent', width: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 32 }}>
                        <ClientClock />
                    </Cutout>
                </Toolbar>
            </AppBar>

            {/* Track Selector Modal */}
            <TrackSelector
                isOpen={editingTrackId !== null}
                trackId={editingTrackId}
                onClose={() => setEditingTrackId(null)}
                onSelect={handleTrackSelect}
            />

        </main>
    );
}
